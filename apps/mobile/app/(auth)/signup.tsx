import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useAuthStore } from "@/lib/stores/auth";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const isValid =
    name.length > 0 &&
    email.includes("@") &&
    password.length >= 8 &&
    password === confirmPassword;

  const handleSignup = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setLoading(false);
      Alert.alert("Sign Up Failed", error.message ?? "Could not create account");
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
    router.replace("/(auth)/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-8 pt-12"
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} className="mb-8">
            <Text className="font-heading-medium tracking-cta text-base uppercase text-detergent-400">
              Back
            </Text>
          </Pressable>

          <Text className="font-heading tracking-headline mb-2 text-3xl uppercase text-detergent-700">
            Create Account
          </Text>
          <Text className="font-body-light tracking-tight mb-8 text-base text-neutral-500">
            Join We Deliver Laundry
          </Text>

          <View className="gap-4">
            <View className="rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
              <TextInput
                className="font-body text-lg text-detergent-700"
                placeholder="Full Name"
                placeholderTextColor="#B4B5B6"
                autoCapitalize="words"
                autoComplete="name"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

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
                autoComplete="new-password"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <View className="rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
              <TextInput
                className="font-body text-lg text-detergent-700"
                placeholder="Confirm Password"
                placeholderTextColor="#B4B5B6"
                secureTextEntry
                autoComplete="new-password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
            </View>

            {password.length > 0 && password.length < 8 && (
              <Text className="font-body-light text-sm text-destructive-100">
                Password must be at least 8 characters
              </Text>
            )}

            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text className="font-body-light text-sm text-destructive-100">
                Passwords don't match
              </Text>
            )}
          </View>

          <Pressable
            className={`mt-8 mb-4 w-full rounded-btn py-4 ${isValid && !loading ? "bg-detergent-400 active:bg-detergent-500" : "bg-neutral-300"}`}
            onPress={handleSignup}
            disabled={!isValid || loading}
          >
            <Text
              className={`font-heading-medium tracking-cta text-center text-xl uppercase ${isValid && !loading ? "text-white" : "text-neutral-400"}`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </Pressable>

          <Pressable
            className="mb-8"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="font-body-light tracking-tight text-center text-base text-detergent-400">
              Already have an account?{" "}
              <Text className="font-body-medium">Sign In</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
