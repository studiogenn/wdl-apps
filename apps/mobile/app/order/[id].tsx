import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: fetch order detail from /api/mobile/orders/list
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">Order #{id}</Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Order details will load from CleanCloud
        </Text>
      </View>
    </SafeAreaView>
  );
}
