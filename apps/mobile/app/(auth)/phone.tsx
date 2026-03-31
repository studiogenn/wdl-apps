import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return;
    setLoading(true);
    try {
      router.push({
        pathname: "/(auth)/verify",
        params: { phone: `+1${digits}` },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const isValid = phone.replace(/\D/g, "").length >= 10;

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
            Your Phone Number
          </Text>
          <Text className="font-body-light tracking-tight mb-8 text-base text-neutral-500">
            We'll send you a verification code via SMS
          </Text>

          <View className="mb-6 flex-row items-center rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
            <Text className="font-body-medium mr-3 text-lg text-detergent-700">
              +1
            </Text>
            <TextInput
              className="font-body flex-1 text-lg text-detergent-700"
              placeholder="(555) 555-5555"
              placeholderTextColor="#B4B5B6"
              keyboardType="phone-pad"
              autoFocus
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
            />
          </View>

          <Pressable
            className={`w-full rounded-btn py-4 ${isValid && !loading ? "bg-detergent-400 active:bg-detergent-500" : "bg-neutral-300"}`}
            onPress={handleContinue}
            disabled={!isValid || loading}
          >
            <Text
              className={`font-heading-medium tracking-cta text-center text-xl uppercase ${isValid && !loading ? "text-white" : "text-neutral-400"}`}
            >
              {loading ? "Sending..." : "Continue"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
