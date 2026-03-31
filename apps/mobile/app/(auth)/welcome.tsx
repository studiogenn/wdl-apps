import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-detergent-400">
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-16 items-center">
          <Text className="font-heading tracking-headline text-center text-5xl uppercase text-white">
            We Deliver
          </Text>
          <Text className="font-heading tracking-headline text-center text-5xl uppercase text-fresh-lemon-200">
            Laundry
          </Text>
          <Text className="font-body-light tracking-tight mt-4 text-lg text-white/70">
            Within 24 Hours
          </Text>
        </View>

        <View className="w-full gap-4">
          <Pressable
            className="w-full rounded-btn bg-fresh-lemon-200 py-4 active:opacity-90"
            onPress={() => router.push("/(auth)/phone")}
          >
            <Text className="font-heading-medium tracking-cta text-center text-xl uppercase text-detergent-700">
              Get Started
            </Text>
          </Pressable>

          <Pressable
            className="w-full rounded-btn border-2 border-white/30 py-4 active:opacity-80"
            onPress={() => router.push("/(auth)/phone")}
          >
            <Text className="font-heading-medium tracking-cta text-center text-xl uppercase text-white">
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="px-8 pb-8">
        <Text className="font-body-light text-center text-xs text-white/40">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
