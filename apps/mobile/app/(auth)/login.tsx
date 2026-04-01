import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useAuthStore } from "@/lib/stores/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const isValid = email.includes("@") && password.length >= 8;

  const handleLogin = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      Alert.alert("Sign In Failed", error.message ?? "Invalid credentials");
      return;
    }

    if (data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      });
    }

    setLoading(false);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-8 pt-12">
          <Pressable onPress={() => router.back()} className="mb-8">
            <Text className="font-heading-medium tracking-cta text-base uppercase text-detergent-400">
              Back
            </Text>
          </Pressable>

          <Text className="font-heading tracking-headline mb-2 text-3xl uppercase text-detergent-700">
            Sign In
          </Text>
          <Text className="font-body-light tracking-tight mb-8 text-base text-neutral-500">
            Welcome back to We Deliver Laundry
          </Text>

          <View className="gap-4">
            <View className="rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
              <TextInput
                className="font-body text-lg text-detergent-700"
                placeholder="Email"
                placeholderTextColor="#B4B5B6"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View className="rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
              <TextInput
                className="font-body text-lg text-detergent-700"
                placeholder="Password"
                placeholderTextColor="#B4B5B6"
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>
          </View>

          <Pressable
            className={`mt-8 w-full rounded-btn py-4 ${isValid && !loading ? "bg-detergent-400 active:bg-detergent-500" : "bg-neutral-300"}`}
            onPress={handleLogin}
            disabled={!isValid || loading}
          >
            <Text
              className={`font-heading-medium tracking-cta text-center text-xl uppercase ${isValid && !loading ? "text-white" : "text-neutral-400"}`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </Pressable>

          <Pressable
            className="mt-6"
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text className="font-body-light tracking-tight text-center text-base text-detergent-400">
              Don't have an account?{" "}
              <Text className="font-body-medium">Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
