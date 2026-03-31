import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddPaymentScreen() {
  // TODO: Stripe CardField via @stripe/stripe-react-native
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-body-medium text-detergent-700">
          Add Payment Method
        </Text>
        <Text className="mt-2 text-center text-sm text-neutral-500">
          Stripe card input will render here
        </Text>
      </View>
    </SafeAreaView>
  );
}
