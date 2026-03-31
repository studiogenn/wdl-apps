import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportScreen() {
  // TODO: message support via /api/mobile/messages (CleanCloud /addMessage)
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">
          Support
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Chat with our team
        </Text>
        <View className="mt-4 rounded-md bg-neutral-200 p-4">
          <Text className="text-sm text-neutral-500">
            Call us: 855-968-5511
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Email: hello@wedeliverlaundry.com
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
