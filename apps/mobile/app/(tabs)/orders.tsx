import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrdersTab() {
  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <View className="flex-1 px-6 pt-6">
        <Text
          className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400"
        >
          Your History
        </Text>
        <Text
          className="font-heading tracking-headline mt-1 text-3xl uppercase text-detergent-700"
        >
          Orders
        </Text>

        <View className="flex-1 items-center justify-center pb-24">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-detergent-100">
            <Text className="text-4xl">👕</Text>
          </View>
          <Text
            className="font-heading-medium mt-6 text-xl text-detergent-700"
          >
            No orders yet
          </Text>
          <Text
            className="font-body-light tracking-tight mt-2 text-center text-sm text-neutral-500"
          >
            Schedule your first pickup to get started
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
