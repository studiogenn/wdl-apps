import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#1227BE",
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: "#F7F5E6" },
        headerTitleStyle: {
          fontFamily: "ZillaSlab-Medium",
          color: "#050B39",
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="address" options={{ title: "Pickup Address" }} />
      <Stack.Screen name="date" options={{ title: "Select Date" }} />
      <Stack.Screen name="slot" options={{ title: "Select Time" }} />
      <Stack.Screen name="services" options={{ title: "Services" }} />
      <Stack.Screen name="preferences" options={{ title: "Preferences" }} />
      <Stack.Screen name="confirm" options={{ title: "Confirm Order" }} />
    </Stack>
  );
}
