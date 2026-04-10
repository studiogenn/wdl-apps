/**
 * Stripe → CleanCloud order pipeline.
 *
 * When a Stripe invoice is paid, this module:
 * 1. Extracts line items + subscription metadata from the invoice
 * 2. Finds or creates the customer in CleanCloud
 * 3. Maps Stripe products to CleanCloud product IDs
 * 4. Resolves the pickup schedule (customer-selected or auto-scheduled)
 * 5. Creates the order in CleanCloud
 */

import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  findOrCreateCustomer,
  addOrder,
  getNextPickupDelivery,
  updateCustomerNotes,
} from "@/lib/cleancloud/client";

// ─── Product mapping ─────────────────────────────────────────────────
// CleanCloud products:
//   id 4  = "Clean - Weekly Repeat" ($1.95/lb)
//   id 96 = "Rhythm - Biweekly Repeat" ($2.15/lb)
//   id 1  = "Instant - On Demand" ($2.95/lb)

function resolveCleanCloudProductId(productName: string): string {
  const name = productName.toLowerCase();

  if (name.includes("biweek") || name.includes("bimonth")) return "96";
  if (name.includes("weekly")) return "4";
  if (name.includes("base")) return "4";
  if (name.includes("overage")) return "1";
  if (
    name.includes("membership") ||
    name.includes("subscription") ||
    name.includes("monthly")
  )
    return "4";
  if (name.includes("student")) return "4";
  if (name.includes("single") || name.includes("pay as you go") || name.includes("payg"))
    return "1";
  if (name.includes("bedding")) return "1";

  return "0";
}

// ─── Stripe helpers ──────────────────────────────────────────────────

async function getStripeCustomer(customerId: string): Promise<{
  name: string;
  email: string;
  phone: string;
  address: string;
}> {
  const customer = (await getStripe().customers.retrieve(
    customerId,
  )) as Stripe.Customer;

  const shipping = customer.shipping;
  const addr = shipping?.address ?? customer.address;
  const addressStr = addr
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code]
        .filter(Boolean)
        .join(", ")
    : "";

  return {
    name: shipping?.name ?? customer.name ?? "Unknown",
    email: customer.email ?? "",
    phone: shipping?.phone ?? customer.phone ?? "",
    address: addressStr,
  };
}

async function getInvoiceDetails(invoiceId: string): Promise<{
  items: Array<{
    productName: string;
    amount: number;
    quantity: number;
    metadata: Record<string, string>;
  }>;
  total: number;
  customerId: string;
  subscriptionMetadata: Record<string, string>;
}> {
  const invoice = await getStripe().invoices.retrieve(invoiceId, {
    expand: ["lines.data.price.product"],
  });

  const items = (invoice.lines?.data ?? []).map((line) => {
    const lineAny = line as unknown as Record<string, unknown>;
    const price = lineAny.price as Record<string, unknown> | undefined;
    const product = price?.product as Stripe.Product | undefined;
    return {
      productName:
        (lineAny.description as string) ??
        product?.name ??
        "Subscription",
      amount: ((lineAny.amount as number) ?? 0) / 100,
      quantity: (lineAny.quantity as number) ?? 1,
      metadata: {
        ...(product?.metadata ?? {}),
        ...((price?.metadata as Record<string, string>) ?? {}),
      },
    };
  });

  let subscriptionMetadata: Record<string, string> = {};
  const subscriptionId =
    invoice.parent?.subscription_details?.subscription;
  if (subscriptionId) {
    try {
      const subId =
        typeof subscriptionId === "string"
          ? subscriptionId
          : subscriptionId.id;
      const sub = await getStripe().subscriptions.retrieve(subId);
      subscriptionMetadata = (sub.metadata as Record<string, string>) ?? {};
    } catch {
      // Non-critical
    }
  }

  return {
    items,
    total: (invoice.amount_paid ?? 0) / 100,
    customerId: invoice.customer as string,
    subscriptionMetadata,
  };
}

// ─── Main pipeline ───────────────────────────────────────────────────

export async function handleInvoicePaid(
  invoice: Stripe.Invoice,
): Promise<void> {
  const invoiceId = invoice.id;
  console.log(`[Stripe → CleanCloud] Processing invoice ${invoiceId}`);

  // 1. Get line items, total, and subscription metadata
  const { items, total, customerId, subscriptionMetadata } =
    await getInvoiceDetails(invoiceId);

  if (items.length === 0) {
    console.log("[Stripe → CleanCloud] No line items, skipping");
    return;
  }

  // 2. Get customer details from Stripe
  const customer = await getStripeCustomer(customerId);
  if (!customer.email) {
    console.error(
      "[Stripe → CleanCloud] Customer has no email, cannot create order",
    );
    return;
  }

  // 3. Find or create customer in CleanCloud
  const cleanCloudCustomerId = await findOrCreateCustomer({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
  });

  // 4. Map Stripe products to CleanCloud products
  const products = items
    .filter((item) => {
      const name = item.productName.toLowerCase();
      if (name.includes("brand refresh") || name.includes("consulting")) {
        console.log(
          `[Stripe → CleanCloud] Skipping non-laundry item: ${item.productName}`,
        );
        return false;
      }
      return true;
    })
    .map((item) => ({
      id:
        item.metadata.cleancloud_product_id ??
        resolveCleanCloudProductId(item.productName),
      price: item.amount.toFixed(2),
      pieces: "1",
      quantity: item.quantity.toString(),
      name: item.productName,
    }));

  if (products.length === 0) {
    console.log(
      "[Stripe → CleanCloud] No laundry items after filtering, skipping",
    );
    return;
  }

  // 5. Resolve pickup schedule
  // Support both naming conventions from /join and /subscriptions flows
  const pickupAddress =
    subscriptionMetadata.pickup_address ??
    subscriptionMetadata.pickupAddress ??
    customer.address;
  const pickupDateRaw =
    subscriptionMetadata.pickup_date ??
    subscriptionMetadata.pickupDate ??
    "";
  const pickupSlotRaw =
    subscriptionMetadata.pickup_slot ??
    subscriptionMetadata.pickupTime ??
    "";

  let schedule: {
    pickupDate?: string;
    pickupStart?: string;
    pickupEnd?: string;
    deliveryDate?: string;
    deliveryStart?: string;
    deliveryEnd?: string;
  } = {};

  if (pickupDateRaw && pickupSlotRaw) {
    console.log(
      `[Stripe → CleanCloud] Using customer-selected schedule: ${pickupDateRaw} ${pickupSlotRaw}`,
    );
    const dateStamp = String(
      Math.floor(new Date(pickupDateRaw + "T12:00:00").getTime() / 1000),
    );
    const parts = pickupSlotRaw.split("-").map((s: string) => s.trim());
    const deliveryStamp = String(Number(dateStamp) + 86400);

    schedule = {
      pickupDate: dateStamp,
      pickupStart: parts[0],
      pickupEnd: parts[1] ?? parts[0],
      deliveryDate: deliveryStamp,
      deliveryStart: parts[0],
      deliveryEnd: parts[1] ?? parts[0],
    };
  } else if (pickupAddress) {
    const auto = await getNextPickupDelivery(pickupAddress);
    if (auto) {
      const pParts = auto.pickupTime.split("-").map((s: string) => s.trim());
      const dParts = auto.deliveryTime.split("-").map((s: string) => s.trim());
      schedule = {
        pickupDate: auto.pickupDate,
        pickupStart: pParts[0],
        pickupEnd: pParts[1] ?? pParts[0],
        deliveryDate: auto.deliveryDate,
        deliveryStart: dParts[0],
        deliveryEnd: dParts[1] ?? dParts[0],
      };
    }
  }

  // 6. Build order notes
  // Support metadata keys from both /join and /subscriptions flows
  const meta = subscriptionMetadata;
  const bags = meta.bags ?? "";
  const frequency = meta.frequency ?? "";
  const tier = meta.tier ?? "";
  const pickups = meta.pickups ?? "";
  const includedLbs = meta.includedLbs ?? "";
  const care = meta.care ?? "";
  const driverNotes = meta.driverNotes ?? "";
  const bedding = meta.bedding ?? "";
  const student = meta.student ?? "";
  const pickupZip = meta.pickupZip ?? "";
  const pickupApt = meta.pickupApt ?? "";
  const repeatPickup = meta.repeatPickup ?? "";

  // Only include info the operations team and drivers need
  const noteLines = [
    care && `Care upgrades: ${care}`,
    driverNotes && `Driver notes: ${driverNotes}`,
  ].filter(Boolean) as string[];

  // 7. Create order in CleanCloud
  const orderId = await addOrder({
    customerID: cleanCloudCustomerId,
    products,
    finalTotal: total.toFixed(2),
    orderNotes: noteLines.join("\n"),
    ...(repeatPickup === "true" && { regularOrder: 1 }),
    ...schedule,
  });

  console.log(
    `[Stripe → CleanCloud] Order ${orderId} created for ${customer.email} ($${total})`,
  );

  // 8. Update customer profile notes (care upgrades + driver notes only)
  if (noteLines.length > 0) {
    await updateCustomerNotes(cleanCloudCustomerId, noteLines.join("\n"));
  }
}
