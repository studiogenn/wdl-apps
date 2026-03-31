import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethodsScreen() {
  // TODO: fetch saved cards from /api/mobile/cards
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">
          Payment Methods
        </Text>

        <View className="mt-8 flex-1 items-center justify-center pb-20">
          <Text className="text-sm text-neutral-500">No saved cards</Text>
        </View>

        <Pressable
          className="mb-8 rounded-md bg-detergent-400 py-4 active:opacity-80"
          onPress={() => router.push("/payment/add")}
        >
          <Text className="text-center text-lg font-body-bold text-white">
            Add Card
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
