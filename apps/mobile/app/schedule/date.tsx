import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useDates } from "@/lib/api/hooks";
import { useScheduleStore } from "@/lib/stores/schedule";

function formatDate(timestamp: number): string {
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DateScreen() {
  const { routeID, selectedDate, setSelectedDate } = useScheduleStore();
  const { data: dates, isLoading, error } = useDates(routeID);

  return (
    <View className="flex-1 bg-seabreeze-300 px-6 pt-6">
      <Text className="font-heading tracking-headline mb-2 text-2xl uppercase text-detergent-700">
        Select a Date
      </Text>
      <Text className="font-body-light tracking-tight mb-6 text-sm text-neutral-500">
        Choose when we should pick up
      </Text>

      {isLoading && (
        <View className="mt-12 items-center">
          <ActivityIndicator size="large" color="#1227BE" />
          <Text className="font-body-light mt-4 text-neutral-500">
            Loading available dates...
          </Text>
        </View>
      )}

      {error && (
        <View className="mt-8 rounded-card bg-destructive-100/20 p-6">
          <Text className="font-body-medium text-destructive-200">
            {error.message}
          </Text>
        </View>
      )}

      {dates && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-3 pb-8">
            {dates.map((entry) => {
              const isSelected = selectedDate === entry.date;
              return (
                <Pressable
                  key={entry.date}
                  className={`rounded-card p-5 ${isSelected ? "border-2 border-detergent-400 bg-detergent-100" : "border-2 border-transparent bg-white"}`}
                  onPress={() => setSelectedDate(entry.date)}
                >
                  <Text
                    className={`font-heading-medium text-lg ${isSelected ? "text-detergent-400" : "text-detergent-700"}`}
                  >
                    {formatDate(entry.date)}
                  </Text>
                  {entry.remaining != null && (
                    <Text className="font-body-light tracking-tight mt-1 text-sm text-neutral-500">
                      {entry.remaining} spots remaining
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {selectedDate && (
        <View className="pb-8">
          <Pressable
            className="rounded-btn bg-detergent-400 py-4 active:bg-detergent-500"
            onPress={() => router.push("/schedule/slot")}
          >
            <Text className="font-heading-medium tracking-cta text-center text-lg uppercase text-white">
              Continue
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
