import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useScheduleStore } from "@/lib/stores/schedule";
import { useProducts, useCreateOrder } from "@/lib/api/hooks";

function formatDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function ConfirmScreen() {
  const { address, selectedDate, selectedSlot, selectedProducts, planType, reset } =
    useScheduleStore();
  const { data: products } = useProducts();
  const createOrder = useCreateOrder();

  const selectedProductDetails = selectedProducts.map((sp) => {
    const product = products?.find((p) => p.productID === sp.productID);
    return {
      ...sp,
      name: product?.name ?? "Unknown",
      price: product?.price ?? 0,
    };
  });

  const subtotal = selectedProductDetails.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const deliveryFee = planType === "weekly" ? 0 : 3.95;
  const total = subtotal + deliveryFee;

  const handleConfirm = async () => {
    try {
      await createOrder.mutateAsync({
        pickupDate: selectedDate ?? undefined,
        pickupStart: selectedSlot ?? undefined,
        products: selectedProducts,
        finalTotal: total,
      });
      reset();
      router.replace("/(tabs)/orders");
    } catch (err) {
      Alert.alert(
        "Order Failed",
        err instanceof Error
          ? err.message
          : "Could not place your order. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-seabreeze-300">
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-heading tracking-headline mb-6 text-2xl uppercase text-detergent-700">
          Review Order
        </Text>

        <View className="rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-500">
            Pickup Address
          </Text>
          <Text className="font-body mt-2 text-base text-detergent-700">
            {address}
          </Text>
        </View>

        <View className="mt-4 rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-500">
            Pickup Time
          </Text>
          <Text className="font-body mt-2 text-base text-detergent-700">
            {selectedDate ? formatDate(selectedDate) : "Not selected"} ·{" "}
            {selectedSlot ?? "Not selected"}
          </Text>
        </View>

        <View className="mt-4 rounded-card bg-white p-6">
          <Text className="font-body-medium tracking-cta text-subtext-xs mb-3 uppercase text-neutral-500">
            Services
          </Text>
          {selectedProductDetails.map((p) => (
            <View key={p.productID} className="flex-row justify-between py-2">
              <Text className="font-body text-base text-detergent-700">
                {p.name}
              </Text>
              <Text className="font-body-medium text-base text-detergent-700">
                ${p.price.toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="mt-3 border-t border-neutral-200 pt-3">
            <View className="flex-row justify-between">
              <Text className="font-body-light text-sm text-neutral-500">
                Delivery Fee
              </Text>
              <Text className="font-body text-sm text-detergent-700">
                {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="font-heading-medium text-lg text-detergent-700">
                Total
              </Text>
              <Text className="font-heading-medium text-lg text-detergent-400">
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      <View className="px-6 pb-8">
        <Pressable
          className={`flex-row items-center justify-center rounded-btn py-4 ${createOrder.isPending ? "bg-fresh-lemon-300" : "bg-fresh-lemon-200 active:bg-fresh-lemon-300"}`}
          onPress={handleConfirm}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending && (
            <ActivityIndicator color="#050B39" className="mr-2" />
          )}
          <Text className="font-heading-medium tracking-cta text-center text-lg uppercase text-detergent-700">
            {createOrder.isPending ? "Placing Order..." : "Confirm & Pay"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
