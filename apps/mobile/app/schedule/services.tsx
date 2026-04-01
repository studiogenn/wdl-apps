import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useProducts } from "@/lib/api/hooks";
import { useScheduleStore } from "@/lib/stores/schedule";

export default function ServicesScreen() {
  const { selectedProducts, toggleProduct } = useScheduleStore();
  const { data: products, isLoading, error } = useProducts();

  const isSelected = (id: number) =>
    selectedProducts.some((p) => p.productID === id);
  const hasSelection = selectedProducts.length > 0;

  return (
    <View className="flex-1 bg-seabreeze-300 px-6 pt-6">
      <Text className="font-heading tracking-headline mb-2 text-2xl uppercase text-detergent-700">
        Services
      </Text>
      <Text className="font-body-light tracking-tight mb-6 text-sm text-neutral-500">
        Select the services you need
      </Text>

      {isLoading && (
        <View className="mt-12 items-center">
          <ActivityIndicator size="large" color="#1227BE" />
          <Text className="font-body-light mt-4 text-neutral-500">
            Loading services...
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

      {products && (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="gap-3 pb-8">
            {products.map((product) => {
              const selected = isSelected(product.productID);
              return (
                <Pressable
                  key={product.productID}
                  className={`rounded-card p-5 ${selected ? "border-2 border-detergent-400 bg-detergent-100" : "border-2 border-transparent bg-white"}`}
                  onPress={() => toggleProduct(product.productID)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text
                        className={`font-heading-medium text-lg ${selected ? "text-detergent-400" : "text-detergent-700"}`}
                      >
                        {product.name}
                      </Text>
                    </View>
                    <Text className="font-body-medium text-lg text-detergent-700">
                      ${product.price.toFixed(2)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {hasSelection && (
        <View className="pb-8">
          <Pressable
            className="rounded-btn bg-detergent-400 py-4 active:bg-detergent-500"
            onPress={() => router.push("/schedule/preferences")}
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
