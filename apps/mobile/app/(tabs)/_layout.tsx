import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { colors } from "@wdl/tokens";
import {
  HomeIcon,
  CalendarIcon,
  OrdersIcon,
  AccountIcon,
} from "@/components/icons/TabIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.detergent[400],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarLabelStyle: {
          fontFamily: "DMSans-Medium",
          fontSize: 10,
          letterSpacing: 0.6,
          textTransform: "uppercase",
        },
        tabBarStyle: {
          backgroundColor: colors.seabreeze[100],
          borderTopColor: colors.neutral[300],
          borderTopWidth: 0.5,
          ...(Platform.OS === "ios" && { height: 88 }),
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => <CalendarIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => <OrdersIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <AccountIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
