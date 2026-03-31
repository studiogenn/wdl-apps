import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScheduleStore } from "@/lib/stores/schedule";

export default function ScheduleTab() {
  const { setPlanType, reset } = useScheduleStore();

  const handleSelect = (type: "one-time" | "weekly") => {
    reset();
    setPlanType(type);
    router.push("/schedule/address");
  };

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <View className="flex-1 px-6 pt-6">
        <Text
          className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400"
        >
          Book a Pickup
        </Text>
        <Text
          className="font-heading tracking-headline mt-1 text-3xl uppercase text-detergent-700"
        >
          Schedule
        </Text>
        <Text
          className="font-body-light tracking-tight mt-2 text-base text-neutral-500"
        >
          Free pickup & delivery for weekly customers
        </Text>

        <View className="mt-8 gap-4">
          <Pressable
            className="rounded-card border-2 border-detergent-400 bg-white p-8 active:bg-detergent-100"
            onPress={() => handleSelect("one-time")}
          >
            <Text
              className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400"
            >
              Pay As You Go
            </Text>
            <Text
              className="font-heading-medium mt-2 text-2xl text-detergent-700"
            >
              One-Time Pickup
            </Text>
            <Text
              className="font-body-light tracking-tight mt-1 text-sm text-neutral-500"
            >
              $3.95 transport fee · Within 24 hours
            </Text>
          </Pressable>

          <Pressable
            className="rounded-card bg-fresh-lemon-200 p-8 active:bg-fresh-lemon-300"
            onPress={() => handleSelect("weekly")}
          >
            <Text
              className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-600"
            >
              Recommended
            </Text>
            <Text
              className="font-heading-medium mt-2 text-2xl text-detergent-700"
            >
              Weekly Plan
            </Text>
            <Text
              className="font-body-light tracking-tight mt-1 text-sm text-detergent-600"
            >
              FREE pickup & delivery · Cancel anytime
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
