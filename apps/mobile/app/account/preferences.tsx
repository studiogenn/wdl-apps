import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PreferencesScreen() {
  // TODO: fetch/save laundry preferences via /api/mobile/preferences
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-heading-bold text-detergent-700">
          Laundry Preferences
        </Text>
        <Text className="mt-2 text-sm text-neutral-500">
          Detergent, softener, starch, shirt/trouser preferences
        </Text>
      </View>
    </SafeAreaView>
  );
}
