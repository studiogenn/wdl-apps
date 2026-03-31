---
name: cleancloud-api
description: Deep expertise in the CleanCloud laundry/dry cleaning POS API. Use this skill when building features that integrate with CleanCloud for customer management, order processing, payments, scheduling, routing, messaging, subscriptions, promotions, inventory, invoicing, and reporting. Covers all 44 API endpoints, TypeScript types, Next.js API route patterns, error handling, rate limiting, and webhook integration for the WeDeliverLaundry frontend.
---

# CleanCloud API Integration

## Overview

CleanCloud is a laundry and dry cleaning management platform. This skill provides complete API integration guidance for building a custom frontend (WeDeliverLaundry) that replaces CleanCloud's default UI while using CleanCloud as the backend for order processing, customer management, payments, and operations.

**API Fundamentals:**
- Base URL: `https://cleancloudapp.com/api/`
- Protocol: HTTPS POST only (no GET, PUT, DELETE methods)
- Auth: `api_token` parameter in every request body
- Rate limits: 50,000 requests/month, 3 requests/second max
- Response format: JSON with `Success` or `Error` fields
- Date format: `yyyy-mm-dd` for dates, Unix timestamps at 12pm UTC for scheduling
- Time slots: 12-hour format strings (`"10am"`, `"1pm"`)

## Environment Setup

```bash
# .env.local
CLEANCLOUD_API_TOKEN=your-api-token-here
CLEANCLOUD_API_BASE_URL=https://cleancloudapp.com/api
```

```typescript
// src/lib/cleancloud/config.ts
export const CLEANCLOUD_CONFIG = {
  baseUrl: process.env.CLEANCLOUD_API_BASE_URL!,
  apiToken: process.env.CLEANCLOUD_API_TOKEN!,
} as const;
```

## TypeScript Types

### Core Response Types

```typescript
// src/types/cleancloud.ts

// Base response - all endpoints return one of these shapes
interface CleanCloudSuccess {
  Success: 'True';
}

interface CleanCloudError {
  Error: string;
}

type CleanCloudResponse<T = Record<string, never>> =
  | (CleanCloudSuccess & T)
  | CleanCloudError;

// Type guard
function isCleanCloudError(
  response: CleanCloudResponse
): response is CleanCloudError {
  return 'Error' in response;
}
```

### Customer Types

```typescript
interface CleanCloudCustomer {
  readonly customerID: number;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly customerTel: string;
  readonly customerAddress?: string;
  readonly customerAddressInstructions?: string;
  readonly customerRoute?: number;
  readonly customerLat?: number;
  readonly customerLng?: number;
  readonly customerNotes?: string;
  readonly customerGender?: CustomerGender;
  readonly birthdayDay?: number;
  readonly birthdayMonth?: number;
  readonly marketingOptIn?: 0 | 1;
  readonly credit?: number;
  readonly loyaltyPoints?: number;
  readonly starchPreference?: StarchPreference;
  readonly shirtPreference?: ShirtPreference;
  readonly trouserPreference?: TrouserPreference;
  readonly detergentType?: DetergentType;
  readonly detergentScent?: DetergentScent;
  readonly fabricSoftenerType?: FabricSoftenerType;
  readonly whitesWashTemp?: WashTemp;
  readonly whitesDryerHeat?: DryerHeat;
  readonly colorsWashTemp?: WashTemp;
  readonly colorsDryerHeat?: DryerHeat;
}

type CustomerGender = 0 | 1 | 2 | 3;
// 0=Not set, 1=Male, 2=Female, 3=Prefer Not to Say

type StarchPreference = 0 | 1 | 2 | 3 | 4;
// 0=None, 1=Light, 2=Medium, 3=Heavy, 4=No Preference

type ShirtPreference = 0 | 1 | 2 | 3;
// 0=Hanger, 1=Folded, 2=Box, 3=No Preference

type TrouserPreference = 0 | 1 | 2 | 3;
// 0=Creased, 1=No Crease, 2=On Hanger, 3=No Preference

type DetergentType = 0 | 1 | 2;
// 0=Regular, 1=Hypoallergenic, 2=No Preference

type DetergentScent = 0 | 1 | 2 | 3 | 4 | 5;
// 0=Original, 1=Lavender, 2=Fresh, 3=Free & Clear, 4=Spring, 5=No Preference

type FabricSoftenerType = 0 | 1 | 2 | 3;
// 0=Regular, 1=Sensitive, 2=None, 3=No Preference

type WashTemp = 0 | 1 | 2;
// 0=Cold, 1=Warm, 2=Hot

type DryerHeat = 0 | 1 | 2;
// 0=Low, 1=Medium, 2=High

interface CreateCustomerParams {
  readonly customerName: string;
  readonly customerTel: string;
  readonly customerEmail: string;
  readonly customerAddress?: string;
  readonly customerAddressInstructions?: string;
  readonly customerRoute?: number;
  readonly customerLat?: number;
  readonly customerLng?: number;
  readonly makeLatLng?: 1;
  readonly findRoute?: 1;
  readonly customerNotes?: string;
  readonly customerPassword?: string;
  readonly customerGender?: CustomerGender;
  readonly birthdayDay?: number;
  readonly birthdayMonth?: number;
  readonly promoCode?: string;
  readonly marketingOptIn?: 0 | 1;
  readonly starchPreference?: StarchPreference;
  readonly shirtPreference?: ShirtPreference;
  readonly trouserPreference?: TrouserPreference;
  readonly detergentType?: DetergentType;
  readonly detergentScent?: DetergentScent;
  readonly fabricSoftenerType?: FabricSoftenerType;
  readonly whitesWashTemp?: WashTemp;
  readonly whitesDryerHeat?: DryerHeat;
  readonly colorsWashTemp?: WashTemp;
  readonly colorsDryerHeat?: DryerHeat;
  readonly stripe?: string;
  readonly evoToken?: string;
  readonly noEmailRequired?: 1;
}

interface UpdateCustomerParams extends Partial<CreateCustomerParams> {
  readonly customerID: number;
}
```

### Order Types

```typescript
type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5;
// 0=Cleaning, 1=Ready, 2=Completed, 3=Pickup Requiring Confirmation
// 4=Accepted Pickup, 5=Detailing

type NotifyMethod = 1 | 2 | 3 | 4;
// 1=SMS, 2=Email, 3=Do Not Notify, 4=Email & SMS

type PaymentType = 0 | 1 | 2 | 3;
// 0=None, 1=Cash, 2=Card, 3=Check

interface OrderProduct {
  readonly id: number; // product ID; 0 for custom one-time items
  readonly price: number;
  readonly pieces: number;
  readonly quantity: number;
  readonly name: string;
}

interface CreateOrderParams {
  readonly customerID: number;
  readonly finalTotal: number;
  readonly products?: readonly OrderProduct[];
  readonly status?: OrderStatus;
  readonly discount?: number;
  readonly discountPercent?: number;
  readonly creditUsed?: number;
  readonly deliveryFee?: number;
  readonly tax?: number;
  readonly tax2?: number;
  readonly tax3?: number;
  readonly minimumAdjust?: number;
  readonly tip?: number;
  readonly tipPercent?: number;
  readonly express?: 0 | 1;
  readonly pickupDate?: number; // Unix timestamp at 12pm UTC
  readonly pickupStart?: string; // "10am"
  readonly pickupEnd?: string; // "12pm"
  readonly delivery?: 0 | 1;
  readonly deliveryDate?: number; // Unix timestamp
  readonly deliveryStart?: string;
  readonly deliveryEnd?: string;
  readonly orderNotes?: string;
  readonly notifyMethod?: NotifyMethod;
  readonly paid?: 0 | 1;
  readonly paymentType?: PaymentType;
  readonly priceListID?: number;
  readonly sendEmail?: 0 | 1;
  readonly staffVerify?: 0 | 1;
  readonly storeOrder?: 0 | 1;
  readonly storeDropOffDate?: number;
  readonly storeReadyByDate?: number;
  readonly storeReadyByTime?: string;
  readonly lockerOrder?: 0 | 1;
  readonly lockerNumber?: string;
  readonly lockerLocationID?: number;
}

interface UpdateOrderParams extends Partial<CreateOrderParams> {
  readonly orderID: number;
  readonly customerID?: number; // reassign order
  readonly pickupReschedule?: 1 | 2; // 1=staff, 2=customer
  readonly deliveryReschedule?: 1 | 2;
}

interface GetOrdersParams {
  readonly orderID?: number;
  readonly customerID?: number;
  readonly routeID?: number;
  readonly dateFrom?: string; // yyyy-mm-dd
  readonly dateTo?: string; // yyyy-mm-dd (max 31-day range)
  readonly updatedSecondsAgoFrom?: number;
  readonly status?: OrderStatus;
  readonly completed?: 0 | 1;
  readonly paid?: 0 | 1;
  readonly sendProductDetails?: 0 | 1;
}
```

### Garment Types

```typescript
interface CleanCloudGarment {
  readonly barcodeID: string;
  readonly orderID: number;
  readonly color1?: number;
  readonly color2?: number;
  readonly extraNotes?: string;
  readonly conveyorLocation?: string;
  readonly customStatus?: number;
}

interface UpdateGarmentParams {
  readonly barcodeID: string;
  readonly orderID?: number;
  readonly color1?: number;
  readonly color2?: number;
  readonly extraNotes?: string;
  readonly conveyorLocation?: string;
  readonly customStatus?: number;
}
```

### Scheduling Types

```typescript
type RepeatFrequency = 1 | 2 | 3 | 4;
// 1=Weekly, 2=Biweekly, 3=Every 3 weeks, 4=Every 4 weeks

interface CreateRepeatPickupParams {
  readonly customerID: number;
  readonly pickupDate: number; // Unix timestamp at 12pm UTC
  readonly pickupStart: string;
  readonly pickupEnd: string;
  readonly frequency: RepeatFrequency;
  readonly duration: number; // 0=Until cancelled, 1-20=number of orders
  readonly deliveryDays?: number; // 0=no delivery, 1+=days after pickup
  readonly deliveryStart?: string;
  readonly deliveryEnd?: string;
  readonly tip?: number;
  readonly tipPercent?: number;
  readonly schedulerType?: 0 | 1; // 0=regular, 1=SMS confirm required
  readonly schedulerConfirmDays?: number;
  readonly ordersCreatedSoFar?: number;
  readonly deleteOld?: 1;
}

interface UpdateRepeatPickupParams extends CreateRepeatPickupParams {
  readonly pickupID: number;
}

interface AvailableDate {
  readonly date: number; // Unix timestamp
  readonly slots: readonly string[];
  readonly remaining: number;
}

interface TimeSlot {
  readonly time: string; // "10am", "11am", etc.
}
```

### Payment Types

```typescript
type PaymentProviderType = 1 | 2 | 3 | 4 | 5 | 6;
// 1=Stripe, 2=EVO, 3=Clearent, 4=Checkout.com
// 5=CleanCloud Pay, 6=Amazon

interface AddCardParams {
  readonly customerID: number;
  readonly type: 1 | 2 | 3 | 6;
  // 1=Stripe save, 2=Stripe setup intent, 3=Clearent, 6=Amazon
  readonly paymentMethodID: string;
}

interface ChargeCardParams {
  readonly customerID: number;
  readonly orderID: number;
  readonly type: PaymentProviderType;
}

interface GetCardsParams {
  readonly customerID: number;
  readonly type: 3 | 5 | 6; // Clearent, CleanCloud Pay, Amazon
}
```

### Subscription Types

```typescript
interface AddSubscriptionParams {
  readonly customerID: number;
  readonly subscriptionID: string; // e.g. "plan_JNIndsfsdfvc"
  readonly subscriptionConfirmed?: 1; // set after 3D Secure passes
}
```

### Messaging Types

```typescript
interface CleanCloudMessage {
  readonly messageID: number;
  readonly customerID: number;
  readonly message: string;
  readonly timestamp: string;
  readonly fromCustomer: boolean;
}
```

### Promotion & Loyalty Types

```typescript
interface PromoResult {
  readonly discountPercent?: number;
  readonly creditAmount?: number;
  readonly valid: boolean;
}

interface ReferralInfo {
  readonly referralCode: string;
  readonly giftAmount: number;
}
```

### Reporting Types

```typescript
interface SummaryReport {
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly averageOrderValue: number;
  // Additional fields returned by API
}

interface DriverLocation {
  readonly lat: number;
  readonly lng: number;
  readonly timestamp: number;
}
```

## API Client

### Base Client

```typescript
// src/lib/cleancloud/client.ts
import { CLEANCLOUD_CONFIG } from './config';

interface CleanCloudRequestOptions {
  readonly endpoint: string;
  readonly params?: Record<string, unknown>;
}

export async function cleancloudRequest<T>(
  options: CleanCloudRequestOptions
): Promise<T> {
  const { endpoint, params = {} } = options;
  const url = `${CLEANCLOUD_CONFIG.baseUrl}/${endpoint}`;

  const body = {
    api_token: CLEANCLOUD_CONFIG.apiToken,
    ...params,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new CleanCloudHttpError(response.status, response.statusText);
  }

  const data = await response.json();

  if ('Error' in data) {
    throw new CleanCloudApiError(data.Error);
  }

  return data as T;
}

export class CleanCloudApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CleanCloudApiError';
  }
}

export class CleanCloudHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string
  ) {
    super(`CleanCloud HTTP ${status}: ${statusText}`);
    this.name = 'CleanCloudHttpError';
  }
}
```

### Rate Limiter

```typescript
// src/lib/cleancloud/rate-limiter.ts

// CleanCloud allows max 3 requests/second
const RATE_LIMIT_MS = 334; // ~3 req/sec
let lastRequestTime = 0;

export async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_MS - elapsed)
    );
  }

  lastRequestTime = Date.now();
  return fn();
}
```

## Endpoint Reference

All endpoints use POST to `https://cleancloudapp.com/api/{endpoint}`. Every request body must include `api_token`.

### Customer Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/addCustomer` | Create customer | `customerName`, `customerTel`, `customerEmail` (required) |
| `/updateCustomer` | Update customer | `customerID` (required) + fields to update |
| `/deleteCustomer` | Delete customer | `customerID` (required) |
| `/loginCustomer` | Authenticate | `customerEmail`, `customerPassword` (required) -> returns `cid` |
| `/getCustomer` | Fetch customer(s) | `customerID` OR `dateFrom`+`dateTo` (max 31-day range) |
| `/passwordCustomer` | Reset password | `customerEmail` (required) -> sends reset email |
| `/addToCustomerGroup` | Add to group | `customerID`, `groupID` (required) |

### Order Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/addOrder` | Create order | `customerID`, `finalTotal` (required), `products[]` array |
| `/updateOrder` | Update order | `orderID` (required) + fields to update |
| `/deleteOrder` | Delete order | `orderID` (required), optional `checkPickupTime`, `sendEmail` |
| `/getOrders` | Fetch orders | Filter by `orderID`, `customerID`, `routeID`, `dateFrom`/`dateTo`, `status`, `paid`, `completed` |

**Order product array format:**
```json
{
  "products": [
    { "id": 123, "price": 5.99, "pieces": 1, "quantity": 2, "name": "Shirt" },
    { "id": 0, "price": 10.00, "pieces": 1, "quantity": 1, "name": "Custom Item" }
  ]
}
```
Max 5 custom one-time products (id=0) per order.

### Garment Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/getGarment` | Get single garment | `orderID`, `barcodeID` (required) |
| `/getGarments` | Get all in order | `orderID` (required) |
| `/updateGarment` | Update garment | `barcodeID` (required), optional `orderID`, `color1`, `color2`, `extraNotes`, `conveyorLocation`, `customStatus` |

### Scheduling Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/repeatPickup` | Create recurring pickup | `customerID`, `pickupDate`, `pickupStart`, `pickupEnd`, `frequency`, `duration` (all required) |
| `/updateRepeatPickup` | Update recurring | `pickupID`, `customerID`, `pickupDate`, `pickupStart`, `pickupEnd`, `frequency`, `duration` (all required) |
| `/deletePickup` | Delete recurring | `pickupID`, `customerID` (required) |
| `/getPickups` | Get recurring pickups | `customerID` (required) |
| `/getDates` | Available pickup/delivery dates | `routeID` (required) -> dates with slots and capacity |
| `/getSlots` | Available time slots | `routeID`, `day` (Unix timestamp, required) -> comma-separated slots |

### Route Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/getRoute` | Find route for location | `lat`+`lng` OR `customerAddress` (one required), optional `routeID` to verify |

### Messaging Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/addMessage` | Send message | `customerID`, `message` (required) |
| `/getMessages` | Get messages | `customerID` (required), optional `limit` |

### Pricing Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/getPriceLists` | Get all price lists | (none beyond api_token) |
| `/getProducts` | Get products/services | Optional `priceListID`, `sendParents`, `sendUpcharges`, `inStore` |

### Payment Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/addCard` | Save payment card | `customerID`, `type` (1/2/3/6), `paymentMethodID` (required) |
| `/chargeCard` | Charge saved card | `customerID`, `orderID`, `type` (1-6) (required) |
| `/getCards` | Get saved cards | `customerID`, `type` (3/5/6) (required) |
| `/setDefaultCard` | Set default card | `customerID`, `cardID`, `type` (3/5/6) (required) |

### Subscription Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/addSubscription` | Subscribe customer | `customerID`, `subscriptionID` (required), optional `subscriptionConfirmed` for 3D Secure |
| `/deleteSubscription` | Cancel subscription | `customerID` (required) |
| `/getSubscription` | Get subscription info | `customerID` (required) |

### Promotion & Loyalty Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/usePromo` | Apply promo code | `customerID`, `promoCode` (required), optional `onlyCheckIfValid` |
| `/convertLoyaltyPoints` | Convert points to credit | `customerID` (required) -> returns `newCredit`, `creditGained` |
| `/getReferral` | Get referral info | `customerID` (required) -> referral code and gift amounts |

### Financial Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/getInventory` | Current inventory levels | (none beyond api_token) |
| `/getInvoices` | Get invoices | Optional `customerID`, `businessID`, `dateFrom`, `dateTo` |
| `/getPayments` | Get payment records | Optional `customerID`, `dateFrom`, `dateTo` |
| `/getBusinessAccounts` | Get business accounts | (none beyond api_token) |

### Reporting Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/summaryReport` | Daily summary | `dateFrom`, `dateTo` (yyyy-mm-dd, required) |
| `/driverLocation` | Driver GPS | `orderID`, `customerID` (required) |
| `/getPhotos` | Order photos | `orderID`, `customerID` (required) |

### Push Notification Endpoints

| Endpoint | Purpose | Key Params |
|----------|---------|------------|
| `/addPushToken` | Register device | `pushToken`, `customerID`, `platform` (0=Android, 1=iOS), `bundleID` (all required) |
| `/deletePushToken` | Unregister device | `pushToken`, `customerID` (required) |

## Next.js API Route Patterns

### Route Structure

```
src/app/api/cleancloud/
├── customers/
│   ├── route.ts           # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts       # GET (single), PATCH (update), DELETE
│       ├── login/route.ts
│       └── password/route.ts
├── orders/
│   ├── route.ts           # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts       # GET (single), PATCH (update), DELETE
│       └── garments/route.ts
├── scheduling/
│   ├── dates/route.ts     # Available dates
│   ├── slots/route.ts     # Available time slots
│   ├── pickups/route.ts   # Recurring pickups CRUD
│   └── route/route.ts     # Route lookup
├── payments/
│   ├── cards/route.ts     # Card management
│   ├── charge/route.ts    # Charge card
│   └── subscriptions/route.ts
├── messaging/route.ts     # Messages
├── products/route.ts      # Products & price lists
├── promotions/route.ts    # Promos, loyalty, referrals
├── reports/
│   ├── summary/route.ts
│   └── driver/route.ts
└── webhooks/route.ts      # Incoming webhooks from CleanCloud
```

### Example: Customer Routes

```typescript
// src/app/api/cleancloud/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleancloudRequest, CleanCloudApiError } from '@/lib/cleancloud/client';
import { z } from 'zod';

const createCustomerSchema = z.object({
  customerName: z.string().min(1),
  customerTel: z.string().min(1),
  customerEmail: z.string().email(),
  customerAddress: z.string().optional(),
  customerPassword: z.string().min(6).optional(),
  makeLatLng: z.literal(1).optional(),
  findRoute: z.literal(1).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCustomerSchema.parse(body);

    const result = await cleancloudRequest<{ CustomerID: number }>({
      endpoint: 'addCustomer',
      params: validated,
    });

    return NextResponse.json({
      success: true,
      data: { customerId: result.CustomerID },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerID = searchParams.get('customerID');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const params: Record<string, unknown> = {};
    if (customerID) params.customerID = Number(customerID);
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const result = await cleancloudRequest<{ customers: unknown[] }>({
      endpoint: 'getCustomer',
      params,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example: Order Creation

```typescript
// src/app/api/cleancloud/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleancloudRequest, CleanCloudApiError } from '@/lib/cleancloud/client';
import { z } from 'zod';

const productSchema = z.object({
  id: z.number(),
  price: z.number().min(0),
  pieces: z.number().int().min(1),
  quantity: z.number().int().min(1),
  name: z.string().min(1),
});

const createOrderSchema = z.object({
  customerID: z.number().int(),
  finalTotal: z.number().min(0),
  products: z.array(productSchema).optional(),
  status: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  pickupDate: z.number().int().optional(),
  pickupStart: z.string().optional(),
  pickupEnd: z.string().optional(),
  delivery: z.union([z.literal(0), z.literal(1)]).optional(),
  deliveryDate: z.number().int().optional(),
  deliveryStart: z.string().optional(),
  deliveryEnd: z.string().optional(),
  orderNotes: z.string().optional(),
  notifyMethod: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  paid: z.union([z.literal(0), z.literal(1)]).optional(),
  paymentType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
  discount: z.number().optional(),
  discountPercent: z.number().optional(),
  tip: z.number().optional(),
  deliveryFee: z.number().optional(),
  tax: z.number().optional(),
  express: z.union([z.literal(0), z.literal(1)]).optional(),
  priceListID: z.number().optional(),
  storeOrder: z.union([z.literal(0), z.literal(1)]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Validate max 5 custom items
    const customItems = validated.products?.filter((p) => p.id === 0) ?? [];
    if (customItems.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum 5 custom one-time products per order' },
        { status: 400 }
      );
    }

    const result = await cleancloudRequest<{ orderID: number }>({
      endpoint: 'addOrder',
      params: validated,
    });

    return NextResponse.json({
      success: true,
      data: { orderId: result.orderID },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof CleanCloudApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Example: Scheduling Routes

```typescript
// src/app/api/cleancloud/scheduling/dates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cleancloudRequest } from '@/lib/cleancloud/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const routeID = searchParams.get('routeID');

  if (!routeID) {
    return NextResponse.json(
      { success: false, error: 'routeID is required' },
      { status: 400 }
    );
  }

  try {
    const result = await cleancloudRequest({
      endpoint: 'getDates',
      params: { routeID: Number(routeID) },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dates' },
      { status: 500 }
    );
  }
}
```

## Date/Time Handling

CleanCloud uses Unix timestamps set at 12pm UTC for dates and 12-hour format strings for time slots.

```typescript
// src/lib/cleancloud/dates.ts

/**
 * Convert a JS Date to CleanCloud Unix timestamp (12pm UTC on that date).
 */
export function toCleanCloudTimestamp(date: Date): number {
  const utcDate = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, 0, 0, 0
  ));
  return Math.floor(utcDate.getTime() / 1000);
}

/**
 * Convert a CleanCloud Unix timestamp to a JS Date.
 */
export function fromCleanCloudTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Format a date as yyyy-mm-dd for CleanCloud date range queries.
 */
export function toCleanCloudDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format hour as CleanCloud time slot ("10am", "1pm").
 */
export function toCleanCloudTimeSlot(hour: number): string {
  if (hour === 0 || hour === 12) {
    return hour === 0 ? '12am' : '12pm';
  }
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}
```

## Common Integration Patterns

### Customer Registration Flow

1. User fills signup form on frontend
2. Frontend POSTs to `/api/cleancloud/customers`
3. API route validates with Zod, calls `addCustomer`
4. Returns `CustomerID` to frontend
5. Store `CustomerID` in Supabase user profile for future lookups
6. Optionally call `addCard` to save payment method

### Order Placement Flow

1. Customer selects services -> fetch products via `getProducts`
2. Customer enters address -> check route via `getRoute`
3. Fetch available dates via `getDates` with `routeID`
4. Customer picks date -> fetch slots via `getSlots`
5. Build order with products, schedule, total
6. POST to `addOrder` -> returns `orderID`
7. Charge card via `chargeCard` with `orderID`
8. Update order `paid=1`, `paymentType=2` via `updateOrder`

### Real-Time Order Tracking

1. Poll `getOrders` with `orderID` to check status changes
2. Use `driverLocation` for live driver GPS during delivery
3. Update UI status bar: Accepted -> Cleaning -> Ready -> Out for Delivery -> Completed

### Recurring Pickup Setup

1. Customer selects frequency (weekly, biweekly, etc.)
2. Select first pickup date and time slot
3. Set delivery offset (e.g., 2 days after pickup)
4. Create via `repeatPickup`
5. Manage/cancel via `updateRepeatPickup` / `deletePickup`

## Error Handling

```typescript
// src/lib/cleancloud/errors.ts

// Known CleanCloud error messages and how to handle them
const ERROR_MAP: Record<string, string> = {
  'Invalid API Token': 'Authentication failed. Check your CleanCloud API configuration.',
  'Customer not found': 'Customer account not found. Please register first.',
  'Order not found': 'Order not found.',
  'Invalid email': 'Please provide a valid email address.',
  'Email already exists': 'An account with this email already exists.',
  'Rate limit exceeded': 'Too many requests. Please try again in a moment.',
  '3D Secure Authentication required': 'Your card requires additional verification.',
};

export function getReadableError(cleancloudError: string): string {
  for (const [pattern, message] of Object.entries(ERROR_MAP)) {
    if (cleancloudError.includes(pattern)) {
      return message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
```

## Rate Limiting Best Practices

- Max 3 requests/second, 50,000/month
- Use server-side caching for products and price lists (change infrequently)
- Batch customer data fetches using date ranges instead of individual lookups
- For order status polling, use `updatedSecondsAgoFrom` to only fetch recently changed orders
- Never call CleanCloud API directly from the browser; always proxy through Next.js API routes

## Key Constraints

1. **POST only** - Every endpoint is POST, even reads
2. **Max 31-day date ranges** - `getCustomer` and `getOrders` date filters limited to 31 days
3. **Max 5 custom products** - Orders limited to 5 items with `id=0`
4. **Unix timestamps at 12pm UTC** - All date-based scheduling uses this convention
5. **3D Secure flow** - `addSubscription` may return a 3D Secure error; re-submit with `subscriptionConfirmed=1` after user completes verification
6. **Grow/Grow+ plan required** - API access requires paid CleanCloud subscription
7. **No webhooks documented** - Poll for changes using `updatedSecondsAgoFrom` or date ranges
