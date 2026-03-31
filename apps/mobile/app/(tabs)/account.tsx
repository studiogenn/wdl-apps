import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuItem = {
  readonly label: string;
  readonly route?: string;
  readonly destructive?: boolean;
};

const MENU_SECTIONS: readonly { readonly title: string; readonly items: readonly MenuItem[] }[] = [
  {
    title: "Account",
    items: [
      { label: "Personal Information", route: "/account/profile" },
      { label: "Laundry Preferences", route: "/account/preferences" },
      { label: "Payment Methods", route: "/payment/methods" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Message Support", route: "/account/support" },
      { label: "Refer a Friend", route: "/account/referral" },
    ],
  },
  {
    title: "",
    items: [{ label: "Sign Out", destructive: true }],
  },
];

export default function AccountTab() {
  const handlePress = (item: MenuItem) => {
    if (item.destructive) {
      router.replace("/(auth)/welcome");
      return;
    }
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-2">
          <Text
            className="font-body-medium tracking-cta text-subtext-xs uppercase text-detergent-400"
          >
            Settings
          </Text>
          <Text
            className="font-heading tracking-headline mt-1 text-3xl uppercase text-detergent-700"
          >
            Account
          </Text>
        </View>

        {/* User card */}
        <View className="mx-6 mt-6 rounded-card bg-detergent-700 p-8">
          <Text
            className="font-heading text-2xl text-white"
          >
            Customer
          </Text>
          <Text
            className="font-body-light mt-1 text-sm text-neutral-400"
          >
            +1 (555) 555-5555
          </Text>
        </View>

        {MENU_SECTIONS.map((section, si) => (
          <View key={si} className="mt-6">
            {section.title ? (
              <Text
                className="font-body-medium tracking-cta text-subtext-xs mb-2 px-6 uppercase text-neutral-500"
              >
                {section.title}
              </Text>
            ) : null}
            <View className="mx-6 overflow-hidden rounded-card bg-white">
              {section.items.map((item, ii) => (
                <Pressable
                  key={item.label}
                  className={`flex-row items-center justify-between px-6 py-5 active:bg-seabreeze-200 ${ii > 0 ? "border-t border-neutral-200" : ""}`}
                  onPress={() => handlePress(item)}
                >
                  <Text
                    className={`font-body text-base ${item.destructive ? "text-destructive-200" : "text-detergent-700"}`}
                  >
                    {item.label}
                  </Text>
                  {!item.destructive && (
                    <Text
                      className="font-body-light text-lg text-neutral-300"
                    >
                      ›
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View className="pb-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
