import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const isValid = form.name.length > 0 && form.email.includes("@") && form.address.length > 0;

  const handleRegister = () => {
    // TODO: POST /api/mobile/auth/register
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-8 pt-12" keyboardShouldPersistTaps="handled">
          <Text className="mb-2 text-3xl font-heading-bold text-detergent-700">
            Complete your profile
          </Text>
          <Text className="mb-8 text-base text-neutral-500">
            We need a few details to get your laundry started
          </Text>

          <View className="gap-4">
            <View>
              <Text className="mb-1 text-sm font-body-medium text-neutral-500">
                Full Name
              </Text>
              <TextInput
                className="rounded-md border-2 border-neutral-300 px-4 py-4 text-lg text-detergent-700 focus:border-detergent-400"
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                value={form.name}
                onChangeText={(name) => setForm({ ...form, name })}
              />
            </View>

            <View>
              <Text className="mb-1 text-sm font-body-medium text-neutral-500">
                Email
              </Text>
              <TextInput
                className="rounded-md border-2 border-neutral-300 px-4 py-4 text-lg text-detergent-700 focus:border-detergent-400"
                placeholder="john@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(email) => setForm({ ...form, email })}
              />
            </View>

            <View>
              <Text className="mb-1 text-sm font-body-medium text-neutral-500">
                Pickup Address
              </Text>
              <TextInput
                className="rounded-md border-2 border-neutral-300 px-4 py-4 text-lg text-detergent-700 focus:border-detergent-400"
                placeholder="123 Main St, Teaneck, NJ 07666"
                placeholderTextColor="#9CA3AF"
                value={form.address}
                onChangeText={(address) => setForm({ ...form, address })}
              />
            </View>
          </View>

          <Pressable
            className={`mt-8 w-full rounded-md py-4 ${isValid ? "bg-detergent-400 active:opacity-80" : "bg-neutral-200"}`}
            onPress={handleRegister}
            disabled={!isValid}
          >
            <Text
              className={`text-center text-lg font-body-bold ${isValid ? "text-white" : "text-neutral-400"}`}
            >
              Create Account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
