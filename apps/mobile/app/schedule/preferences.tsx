import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function PreferencesScreen() {
  return (
    <View className="flex-1 bg-seabreeze-300 px-6 pt-6">
      <Text
        className="font-heading tracking-headline mb-2 text-2xl uppercase text-detergent-700"
      >
        Preferences
      </Text>
      <Text
        className="font-body-light tracking-tight mb-6 text-sm text-neutral-500"
      >
        Detergent, softener, starch, temperatures
      </Text>

      <View className="rounded-card bg-white p-6">
        <Text className="font-body-light text-neutral-500">
          Preference controls coming soon
        </Text>
      </View>

      <Pressable
        className="mt-6 rounded-btn bg-detergent-400 py-4 active:bg-detergent-500"
        onPress={() => router.push("/schedule/confirm")}
      >
        <Text
          className="font-heading-medium tracking-cta text-center text-lg uppercase text-white"
        >
          Continue
        </Text>
      </Pressable>
    </View>
  );
}
