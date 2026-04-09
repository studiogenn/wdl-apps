import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackingScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();

  // TODO: poll tracking API /public/track/{token} every 10s
  // TODO: render react-native-maps with driver marker + route polyline
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">
          Live Tracking
        </Text>
        <Text className="mt-2 text-center text-sm text-neutral-500">
          Map with live driver location, ETA, and route will render here
        </Text>
      </View>
    </SafeAreaView>
  );
}
