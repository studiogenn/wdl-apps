import { useFonts } from "expo-font";
import {
  ZillaSlab_400Regular,
  ZillaSlab_500Medium,
  ZillaSlab_700Bold,
} from "@expo-google-fonts/zilla-slab";
import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "@/global.css";

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ZillaSlab: ZillaSlab_400Regular,
    "ZillaSlab-Medium": ZillaSlab_500Medium,
    "ZillaSlab-Bold": ZillaSlab_700Bold,
    DMSans: DMSans_400Regular,
    "DMSans-Light": DMSans_300Light,
    "DMSans-Medium": DMSans_500Medium,
    "DMSans-Bold": DMSans_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen
            name="schedule"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="order/[id]" />
          <Stack.Screen name="tracking/[token]" />
          <Stack.Screen name="payment/methods" />
          <Stack.Screen name="payment/add" />
          <Stack.Screen name="account/profile" />
          <Stack.Screen name="account/preferences" />
          <Stack.Screen name="account/referral" />
          <Stack.Screen name="account/support" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
