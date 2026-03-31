import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { getRoute } from "@/lib/api/cleancloud";
import { useScheduleStore } from "@/lib/stores/schedule";

export default function AddressScreen() {
  const [address, setAddress] = useState(useScheduleStore.getState().address);
  const [loading, setLoading] = useState(false);
  const store = useScheduleStore();

  const handleContinue = async () => {
    if (!address.trim()) return;
    setLoading(true);

    const result = await getRoute({ address: address.trim() });

    if (!result.success || !result.data) {
      Alert.alert("Not in Service Area", result.error ?? "We couldn't find a route for this address. Please try a different address.");
      setLoading(false);
      return;
    }

    store.setAddress(address.trim());
    store.setRouteID(result.data.routeID);
    setLoading(false);
    router.push("/schedule/date");
  };

  return (
    <View className="flex-1 bg-seabreeze-300 px-6 pt-6">
      <Text
        className="font-heading tracking-headline mb-2 text-2xl uppercase text-detergent-700"
      >
        Pickup Address
      </Text>
      <Text
        className="font-body-light tracking-tight mb-6 text-sm text-neutral-500"
      >
        Enter where we should pick up your laundry
      </Text>

      <TextInput
        className="font-body rounded-card border-2 border-neutral-300 bg-white px-5 py-4 text-base text-detergent-700"
        placeholder="123 Main St, Teaneck, NJ 07666"
        placeholderTextColor="#B4B5B6"
        value={address}
        onChangeText={setAddress}
        autoFocus
        editable={!loading}
      />

      <Pressable
        className={`mt-6 flex-row items-center justify-center rounded-btn py-4 ${address.trim() && !loading ? "bg-detergent-400 active:bg-detergent-500" : "bg-neutral-300"}`}
        onPress={handleContinue}
        disabled={!address.trim() || loading}
      >
        {loading && <ActivityIndicator color="#FFFFFF" className="mr-2" />}
        <Text
          className={`font-heading-medium tracking-cta text-center text-lg uppercase ${address.trim() && !loading ? "text-white" : "text-neutral-400"}`}
        >
          {loading ? "Checking..." : "Continue"}
        </Text>
      </Pressable>
    </View>
  );
}
