import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getSlots } from "@/lib/api/cleancloud";
import { useScheduleStore } from "@/lib/stores/schedule";

export default function SlotScreen() {
  const { routeID, selectedDate, selectedSlot, setAvailableSlots, setSelectedSlot, availableSlots } = useScheduleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routeID || !selectedDate) return;

    (async () => {
      const result = await getSlots(routeID, selectedDate);
      if (result.success && result.data) {
        setAvailableSlots(result.data.slots);
      } else {
        setError(result.error ?? "Failed to load time slots");
      }
      setLoading(false);
    })();
  }, [routeID, selectedDate]);

  return (
    <View className="flex-1 bg-seabreeze-300 px-6 pt-6">
      <Text
        className="font-heading tracking-headline mb-2 text-2xl uppercase text-detergent-700"
      >
        Select a Time
      </Text>
      <Text
        className="font-body-light tracking-tight mb-6 text-sm text-neutral-500"
      >
        Choose a pickup window
      </Text>

      {loading && (
        <View className="mt-12 items-center">
          <ActivityIndicator size="large" color="#1227BE" />
          <Text className="font-body-light mt-4 text-neutral-500">
            Loading time slots...
          </Text>
        </View>
      )}

      {error && (
        <View className="mt-8 rounded-card bg-destructive-100/20 p-6">
          <Text className="font-body-medium text-destructive-200">
            {error}
          </Text>
        </View>
      )}

      {!loading && !error && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap gap-3 pb-8">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <Pressable
                  key={slot}
                  className={`rounded-btn px-6 py-3 ${isSelected ? "bg-detergent-400" : "bg-white border-2 border-neutral-300"}`}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text
                    className={`font-body-medium text-base ${isSelected ? "text-white" : "text-detergent-700"}`}
                  >
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {selectedSlot && (
        <View className="pb-8">
          <Pressable
            className="rounded-btn bg-detergent-400 py-4 active:bg-detergent-500"
            onPress={() => router.push("/schedule/services")}
          >
            <Text
              className="font-heading-medium tracking-cta text-center text-lg uppercase text-white"
            >
              Continue
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
