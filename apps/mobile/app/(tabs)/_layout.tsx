import { Tabs } from "expo-router";
import { Platform, Text } from "react-native";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      className={`font-body-medium text-subtext-xs tracking-cta uppercase ${focused ? "text-detergent-400" : "text-neutral-400"}`}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1227BE",
        tabBarInactiveTintColor: "#B4B5B6",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FEFEFC",
          borderTopColor: "#D9DADA",
          borderTopWidth: 0.5,
          ...(Platform.OS === "ios" && { height: 88 }),
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Schedule" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Orders" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Account" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
