import { Stack } from "expo-router";
import { colors } from "@wdl/tokens";

export default function ScheduleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.detergent[400],
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: colors.seabreeze[300] },
        headerTitleStyle: {
          fontFamily: "ZillaSlab-Medium",
          color: colors.detergent[700],
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
