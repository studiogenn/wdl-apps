import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-2">
          <Text
            className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400"
          >
            Welcome Back
          </Text>
          <Text
            className="font-heading tracking-headline mt-1 text-3xl uppercase text-detergent-700"
          >
            Dashboard
          </Text>
        </View>

        {/* Next Pickup Card */}
        <View className="mx-6 mt-6 rounded-card bg-detergent-400 p-8">
          <Text
            className="font-body-medium tracking-cta text-subtext-xs uppercase text-white/60"
          >
            Next Pickup
          </Text>
          <Text
            className="font-heading tracking-headline mt-2 text-2xl text-white"
          >
            No pickups scheduled
          </Text>
          <Text
            className="font-body-light tracking-tight mt-1 text-sm text-white/50"
          >
            Schedule your first pickup to get started
          </Text>
          <Pressable
            className="mt-6 self-start rounded-btn bg-fresh-lemon-200 px-8 py-3 active:opacity-90"
            onPress={() => router.push("/(tabs)/schedule")}
          >
            <Text
              className="font-heading-medium tracking-cta text-base uppercase text-detergent-700"
            >
              Schedule Pickup
            </Text>
          </Pressable>
        </View>

        {/* Stats Row */}
        <View className="mx-6 mt-6 flex-row gap-4">
          <View className="flex-1 rounded-card bg-detergent-100 p-6">
            <Text
              className="font-body tracking-tight text-4xl text-detergent-400"
            >
              0
            </Text>
            <Text
              className="font-body-medium tracking-cta text-subtext-xs mt-1 uppercase text-neutral-500"
            >
              Orders
            </Text>
          </View>
          <View className="flex-1 rounded-card bg-detergent-100 p-6">
            <Text
              className="font-body tracking-tight text-4xl text-detergent-400"
            >
              $0
            </Text>
            <Text
              className="font-body-medium tracking-cta text-subtext-xs mt-1 uppercase text-neutral-500"
            >
              Spent
            </Text>
          </View>
        </View>

        {/* How It Works */}
        <View className="mx-6 mt-8 mb-2">
          <Text
            className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400"
          >
            How It Works
          </Text>
          <Text
            className="font-heading tracking-headline mt-1 text-2xl uppercase text-detergent-700"
          >
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
            <View key={item.step} className="flex-row items-center rounded-card bg-white p-5">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-fresh-lemon-200">
                <Text
                  className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-700"
                >
                  {item.step}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="font-heading-medium text-lg text-detergent-700"
                >
                  {item.title}
                </Text>
                <Text
                  className="font-body-light tracking-tight text-sm text-neutral-500"
                >
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
