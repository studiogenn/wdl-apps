import { View, Text, Pressable, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "@/lib/api/hooks";
import { useAuthStore } from "@/lib/stores/auth";
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

function formatPickupDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function NextPickupCard({ orders }: { readonly orders: readonly Order[] }) {
  const upcoming = orders.find(
    (o) => o.pickupDate && (o.status === 3 || o.status === 4)
  );

  if (!upcoming) {
    return (
      <View className="mx-6 mt-6 rounded-card bg-detergent-400 p-8">
        <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-white/60">
          Next Pickup
        </Text>
        <Text className="font-heading tracking-headline mt-2 text-2xl text-white">
          No pickups scheduled
        </Text>
        <Text className="font-body-light tracking-tight mt-1 text-sm text-white/50">
          Schedule your first pickup to get started
        </Text>
        <Pressable
          className="mt-6 self-start rounded-btn bg-fresh-lemon-200 px-8 py-3 active:opacity-90"
          onPress={() => router.push("/(tabs)/schedule")}
        >
          <Text className="font-heading-medium tracking-cta text-base uppercase text-detergent-700">
            Schedule Pickup
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="mx-6 mt-6 rounded-card bg-detergent-400 p-8">
      <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-white/60">
        Next Pickup
      </Text>
      <Text className="font-heading tracking-headline mt-2 text-2xl text-white">
        {upcoming.pickupDate ? formatPickupDate(upcoming.pickupDate) : "Scheduled"}
      </Text>
      {upcoming.pickupStart && (
        <Text className="font-body-light tracking-tight mt-1 text-sm text-white/70">
          {upcoming.pickupStart}
          {upcoming.pickupEnd ? ` – ${upcoming.pickupEnd}` : ""}
        </Text>
      )}
      <View className="mt-4 self-start rounded-full bg-fresh-lemon-200 px-4 py-1.5">
        <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-700">
          {getStatusLabel(upcoming.status)}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: orders, isLoading, refetch } = useOrders();

  const orderCount = orders?.length ?? 0;
  const totalSpent = orders?.reduce((sum, o) => sum + (o.finalTotal ?? 0), 0) ?? 0;
  const activeOrders = orders?.filter((o) => o.status < 2) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View className="px-6 pt-6 pb-2">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400">
            {user?.name ? `Hey, ${user.name.split(" ")[0]}` : "Welcome Back"}
          </Text>
          <Text className="font-heading tracking-headline mt-1 text-3xl uppercase text-detergent-700">
            Dashboard
          </Text>
        </View>

        <NextPickupCard orders={orders ?? []} />

        <View className="mx-6 mt-6 flex-row gap-4">
          <View className="flex-1 rounded-card bg-detergent-100 p-6">
            <Text className="font-body tracking-tight text-4xl text-detergent-400">
              {orderCount}
            </Text>
            <Text className="font-body-medium tracking-cta text-subtext-xs mt-1 uppercase text-neutral-500">
              Orders
            </Text>
          </View>
          <View className="flex-1 rounded-card bg-detergent-100 p-6">
            <Text className="font-body tracking-tight text-4xl text-detergent-400">
              ${totalSpent.toFixed(0)}
            </Text>
            <Text className="font-body-medium tracking-cta text-subtext-xs mt-1 uppercase text-neutral-500">
              Spent
            </Text>
          </View>
        </View>

        {activeOrders.length > 0 && (
          <View className="mx-6 mt-8">
            <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400">
              In Progress
            </Text>
            <View className="mt-3 gap-3">
              {activeOrders.map((order) => (
                <Pressable
                  key={order.orderID}
                  className="flex-row items-center justify-between rounded-card bg-white p-5 active:bg-seabreeze-200"
                  onPress={() => router.push(`/order/${order.orderID}`)}
                >
                  <View>
                    <Text className="font-heading-medium text-lg text-detergent-700">
                      Order #{order.orderID}
                    </Text>
                    <Text className="font-body-light tracking-tight mt-0.5 text-sm text-neutral-500">
                      {getStatusLabel(order.status)} · ${order.finalTotal.toFixed(2)}
                    </Text>
                  </View>
                  <Text className="font-body-light text-lg text-neutral-300">›</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View className="mx-6 mt-8 mb-2">
          <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400">
            How It Works
          </Text>
          <Text className="font-heading tracking-headline mt-1 text-2xl uppercase text-detergent-700">
            Four Simple Steps
          </Text>
        </View>

        <View className="mx-6 mt-4 gap-4 pb-8">
          {[
            { step: "01", title: "Schedule", desc: "Book a pickup online or in the app" },
            { step: "02", title: "We Pick Up", desc: "Our driver collects from your door" },
            { step: "03", title: "We Clean", desc: "Professionally washed & folded" },
            { step: "04", title: "We Deliver", desc: "Returned within 24 hours" },
          ].map((item) => (
            <View
              key={item.step}
              className="flex-row items-center rounded-card bg-white p-5"
            >
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-fresh-lemon-200">
                <Text className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-700">
                  {item.step}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-heading-medium text-lg text-detergent-700">
                  {item.title}
                </Text>
                <Text className="font-body-light tracking-tight text-sm text-neutral-500">
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
