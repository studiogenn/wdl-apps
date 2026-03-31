import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReferralScreen() {
  // TODO: fetch referral code from /api/mobile/referral
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">
          Refer a Friend
        </Text>
        <Text className="mt-2 text-center text-sm text-neutral-500">
          Referral code and share functionality will load here
        </Text>
      </View>
    </SafeAreaView>
  );
}
