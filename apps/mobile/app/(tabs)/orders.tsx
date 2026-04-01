import { View, Text, Pressable, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "@/lib/api/hooks";
import type { Order } from "@wdl/api";

function getStatusLabel(status: number): string {
  switch (status) {
    case 0: return "Cleaning";
    case 1: return "Ready";
    case 2: return "Completed";
    case 3: return "Awaiting Confirmation";
    case 4: return "Pickup Scheduled";
    case 5: return "Detailing";
    default: return "Processing";
  }
}

function getStatusColor(status: number): string {
  switch (status) {
    case 0:
    case 5:
      return "bg-fresh-lemon-200";
    case 1:
      return "bg-detergent-100";
    case 2:
      return "bg-seabreeze-200";
    case 3:
    case 4:
      return "bg-detergent-200";
    default:
      return "bg-neutral-200";
  }
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrderCard({ order }: { readonly order: Order }) {
  return (
    <Pressable
      className="rounded-card bg-white p-6 active:bg-seabreeze-200"
      onPress={() => router.push(`/order/${order.orderID}`)}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="font-heading-medium text-lg text-detergent-700">
            Order #{order.orderID}
          </Text>
          {order.pickupDate && (
            <Text className="font-body-light tracking-tight mt-1 text-sm text-neutral-500">
              {formatDate(order.pickupDate)}
              {order.pickupStart ? ` · ${order.pickupStart}` : ""}
            </Text>
          )}
        </View>
        <Text className="font-heading-medium text-lg text-detergent-400">
          ${order.finalTotal.toFixed(2)}
        </Text>
      </View>

      {order.products && order.products.length > 0 && (
        <Text className="font-body-light tracking-tight mt-2 text-sm text-neutral-500">
          {order.products.map((p) => p.name).join(", ")}
        </Text>
      )}

      <View className="mt-3 flex-row items-center justify-between">
        <View className={`self-start rounded-full px-3 py-1 ${getStatusColor(order.status)}`}>
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-700">
            {getStatusLabel(order.status)}
          </Text>
        </View>
        {order.paid === 1 && (
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-neutral-400">
            Paid
          </Text>
        )}
      </View>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center pb-24">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-detergent-100">
        <Text className="text-4xl">👕</Text>
      </View>
      <Text className="font-heading-medium mt-6 text-xl text-detergent-700">
        No orders yet
      </Text>
      <Text className="font-body-light tracking-tight mt-2 text-center text-sm text-neutral-500">
        Schedule your first pickup to get started
      </Text>
      <Pressable
        className="mt-6 rounded-btn bg-detergent-400 px-8 py-3 active:bg-detergent-500"
        onPress={() => router.push("/(tabs)/schedule")}
      >
        <Text className="font-heading-medium tracking-cta text-base uppercase text-white">
          Schedule Pickup
        </Text>
      </Pressable>
    </View>
  );
}

export default function OrdersTab() {
  const { data: orders, isLoading, error, refetch } = useOrders();

  const hasOrders = orders && orders.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <View className="px-6 pt-6 pb-2">
        <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400">
          Your History
        </Text>
        <Text className="font-heading tracking-headline mt-1 text-3xl uppercase text-detergent-700">
          Orders
        </Text>
      </View>

      {isLoading && !orders && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1227BE" />
        </View>
      )}

      {error && !orders && (
        <View className="mx-6 mt-8 rounded-card bg-destructive-100/20 p-6">
          <Text className="font-body-medium text-destructive-200">
            {error.message}
          </Text>
          <Pressable className="mt-4" onPress={() => refetch()}>
            <Text className="font-body-medium text-detergent-400">Retry</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !hasOrders && <EmptyState />}

      {hasOrders && (
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          <View className="gap-4 pt-4 pb-8">
            {orders.map((order) => (
              <OrderCard key={order.orderID} order={order} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
