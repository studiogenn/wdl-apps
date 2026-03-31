import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  // TODO: fetch customer profile, allow editing name/email/address
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">
          Personal Information
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Profile editing will connect to CleanCloud customer API
        </Text>
      </View>
    </SafeAreaView>
  );
}
