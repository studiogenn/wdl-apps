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
import { useAuthStore } from "@/lib/stores/auth";
import { apiRequest } from "@/lib/api/client";

export default function RegisterScreen() {
  const user = useAuthStore((s) => s.user);
  const setCleancloudCustomerId = useAuthStore((s) => s.setCleancloudCustomerId);
  const [form, setForm] = useState({
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const isValid = form.phone.replace(/\D/g, "").length >= 10 && form.address.length > 0;

  const handleRegister = async () => {
    if (!isValid || loading) return;
    setLoading(true);

    const result = await apiRequest<{ customerID: number }>(
      "/api/mobile/auth/register",
      {
        method: "POST",
        body: {
          name: user?.name ?? "",
          email: user?.email ?? "",
          phone: form.phone,
          address: form.address,
        },
      }
    );

    if (!result.success) {
      setLoading(false);
      Alert.alert("Registration Failed", result.error ?? "Could not complete registration");
      return;
    }

    if (result.data?.customerID) {
      setCleancloudCustomerId(result.data.customerID);
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
        <ScrollView
          className="flex-1 px-8 pt-12"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-heading tracking-headline mb-2 text-3xl uppercase text-detergent-700">
            Complete Your Profile
          </Text>
          <Text className="font-body-light tracking-tight mb-8 text-base text-neutral-500">
            We need a few details to get your laundry started
          </Text>

          <View className="gap-4">
            <View>
              <Text className="font-body-medium tracking-cta text-subtext-xs mb-2 uppercase text-neutral-500">
                Phone Number
              </Text>
              <View className="flex-row items-center rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
                <Text className="font-body-medium mr-3 text-lg text-detergent-700">
                  +1
                </Text>
                <TextInput
                  className="font-body flex-1 text-lg text-detergent-700"
                  placeholder="(555) 555-5555"
                  placeholderTextColor="#B4B5B6"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  value={form.phone}
                  onChangeText={(phone) => setForm({ ...form, phone })}
                  editable={!loading}
                />
              </View>
            </View>

            <View>
              <Text className="font-body-medium tracking-cta text-subtext-xs mb-2 uppercase text-neutral-500">
                Pickup Address
              </Text>
              <View className="rounded-card border-2 border-neutral-300 bg-neutral-100 px-5 py-4">
                <TextInput
                  className="font-body text-lg text-detergent-700"
                  placeholder="123 Main St, Teaneck, NJ 07666"
                  placeholderTextColor="#B4B5B6"
                  autoComplete="street-address"
                  value={form.address}
                  onChangeText={(address) => setForm({ ...form, address })}
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          <Pressable
            className={`mt-8 w-full rounded-btn py-4 ${isValid && !loading ? "bg-detergent-400 active:bg-detergent-500" : "bg-neutral-300"}`}
            onPress={handleRegister}
            disabled={!isValid || loading}
          >
            <Text
              className={`font-heading-medium tracking-cta text-center text-xl uppercase ${isValid && !loading ? "text-white" : "text-neutral-400"}`}
            >
              {loading ? "Setting Up..." : "Complete Setup"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
