import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "@/lib/api/hooks";
import type { Order, OrderStatus } from "@wdl/api";

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 0: return "Cleaning";
    case 1: return "Ready for Delivery";
    case 2: return "Completed";
    case 3: return "Awaiting Confirmation";
    case 4: return "Pickup Scheduled";
    case 5: return "Detailing";
    default: return "Processing";
  }
}

function getStatusStep(status: OrderStatus): number {
  switch (status) {
    case 3: return 0;
    case 4: return 1;
    case 5:
    case 0: return 2;
    case 1: return 3;
    case 2: return 4;
    default: return 0;
  }
}

const STEPS = ["Confirmed", "Picked Up", "Cleaning", "Ready", "Delivered"] as const;

function StatusTimeline({ status }: { readonly status: OrderStatus }) {
  const currentStep = getStatusStep(status);

  return (
    <View className="mt-6">
      {STEPS.map((label, i) => {
        const isComplete = i <= currentStep;
        const isCurrent = i === currentStep;
        return (
          <View key={label} className="flex-row items-start">
            <View className="items-center" style={{ width: 32 }}>
              <View
                className={`h-4 w-4 rounded-full ${isCurrent ? "bg-detergent-400" : isComplete ? "bg-detergent-300" : "bg-neutral-300"}`}
              />
              {i < STEPS.length - 1 && (
                <View
                  className={`w-0.5 ${isComplete ? "bg-detergent-300" : "bg-neutral-300"}`}
                  style={{ height: 32 }}
                />
              )}
            </View>
            <Text
              className={`ml-3 pb-4 text-base ${isCurrent ? "font-body-medium text-detergent-400" : isComplete ? "font-body text-detergent-700" : "font-body-light text-neutral-400"}`}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function OrderContent({ order }: { readonly order: Order }) {
  return (
    <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
      <Text className="font-heading tracking-headline text-3xl uppercase text-detergent-700">
        Order #{order.orderID}
      </Text>
      <Text className="font-body-light tracking-tight mt-1 text-sm text-neutral-500">
        {getStatusLabel(order.status)}
      </Text>

      <View className="mt-6 rounded-card bg-white p-6">
        <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-500">
          Status
        </Text>
        <StatusTimeline status={order.status} />
      </View>

      {order.pickupDate && (
        <View className="mt-4 rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-500">
            Pickup
          </Text>
          <Text className="font-body mt-2 text-base text-detergent-700">
            {formatDate(order.pickupDate)}
            {order.pickupStart ? ` · ${order.pickupStart}` : ""}
            {order.pickupEnd ? ` – ${order.pickupEnd}` : ""}
          </Text>
        </View>
      )}

      {order.deliveryDate && (
        <View className="mt-4 rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-500">
            Delivery
          </Text>
          <Text className="font-body mt-2 text-base text-detergent-700">
            {formatDate(order.deliveryDate)}
            {order.deliveryStart ? ` · ${order.deliveryStart}` : ""}
            {order.deliveryEnd ? ` – ${order.deliveryEnd}` : ""}
          </Text>
        </View>
      )}

      {order.products && order.products.length > 0 && (
        <View className="mt-4 rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs mb-3 uppercase text-neutral-500">
            Items
          </Text>
          {order.products.map((p, i) => (
            <View
              key={`${p.id}-${i}`}
              className="flex-row justify-between py-2"
            >
              <Text className="font-body text-base text-detergent-700">
                {p.name} × {p.quantity}
              </Text>
              <Text className="font-body-medium text-base text-detergent-700">
                ${(p.price * p.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className="mt-4 rounded-card bg-white p-6">
        <Text className="font-body-medium tracking-cta text-subtext-xs mb-3 uppercase text-neutral-500">
          Summary
        </Text>
        {order.deliveryFee != null && order.deliveryFee > 0 && (
          <View className="flex-row justify-between py-1">
            <Text className="font-body-light text-sm text-neutral-500">Delivery Fee</Text>
            <Text className="font-body text-sm text-detergent-700">
              ${order.deliveryFee.toFixed(2)}
            </Text>
          </View>
        )}
        {order.tax != null && order.tax > 0 && (
          <View className="flex-row justify-between py-1">
            <Text className="font-body-light text-sm text-neutral-500">Tax</Text>
            <Text className="font-body text-sm text-detergent-700">
              ${order.tax.toFixed(2)}
            </Text>
          </View>
        )}
        {order.tip != null && order.tip > 0 && (
          <View className="flex-row justify-between py-1">
            <Text className="font-body-light text-sm text-neutral-500">Tip</Text>
            <Text className="font-body text-sm text-detergent-700">
              ${order.tip.toFixed(2)}
            </Text>
          </View>
        )}
        {order.discount != null && order.discount > 0 && (
          <View className="flex-row justify-between py-1">
            <Text className="font-body-light text-sm text-neutral-500">Discount</Text>
            <Text className="font-body text-sm text-destructive-200">
              -${order.discount.toFixed(2)}
            </Text>
          </View>
        )}
        <View className="mt-2 border-t border-neutral-200 pt-3">
          <View className="flex-row justify-between">
            <Text className="font-heading-medium text-lg text-detergent-700">Total</Text>
            <Text className="font-heading-medium text-lg text-detergent-400">
              ${order.finalTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {order.orderNotes ? (
        <View className="mt-4 rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-500">
            Notes
          </Text>
          <Text className="font-body mt-2 text-base text-detergent-700">
            {order.orderNotes}
          </Text>
        </View>
      ) : null}

      <View className="h-8" />
    </ScrollView>
  );
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: orders, isLoading } = useOrders();
  const order = orders?.find((o) => String(o.orderID) === id);

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <View className="px-6 pt-4">
        <Pressable onPress={() => router.back()}>
          <Text className="font-heading-medium tracking-cta text-base uppercase text-detergent-400">
            Back
          </Text>
        </Pressable>
      </View>

      {isLoading && !order && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1227BE" />
        </View>
      )}

      {!isLoading && !order && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-heading-medium text-xl text-detergent-700">
            Order not found
          </Text>
          <Text className="font-body-light tracking-tight mt-2 text-center text-sm text-neutral-500">
            This order may have been removed or doesn't exist.
          </Text>
        </View>
      )}

      {order && <OrderContent order={order} />}
    </SafeAreaView>
  );
}
