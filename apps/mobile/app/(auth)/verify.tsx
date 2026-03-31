import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from "react";

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleSubmit = async (fullCode: string) => {
    if (loading) return;
    setLoading(true);

    try {
      // TODO: wire Firebase confirm when using dev build
      // await phoneConfirmation.confirm(fullCode);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Invalid Code", "Please check the code and try again.");
      setCode(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const next = [...code];
    next[index] = text;
    setCode(next);

    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    const fullCode = next.join("");
    if (fullCode.length === CODE_LENGTH && next.every((c) => c !== "")) {
      handleSubmit(fullCode);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-seabreeze-300">
      <View className="flex-1 px-8 pt-12">
        <Pressable onPress={() => router.back()} className="mb-8">
          <Text className="text-lg text-detergent-400">Back</Text>
        </Pressable>

        <Text className="mb-2 text-3xl font-heading-bold text-detergent-700">
          Enter verification code
        </Text>
        <Text className="mb-8 text-base text-neutral-500">
          We sent a 6-digit code to {phone}
        </Text>

        <View className="mb-8 flex-row justify-between">
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputs.current[i] = ref;
              }}
              className="h-16 w-12 rounded-sm border-2 border-neutral-300 text-center text-2xl font-heading-bold text-detergent-700 focus:border-detergent-400"
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              autoFocus={i === 0}
              editable={!loading}
            />
          ))}
        </View>

        {loading && (
          <Text className="text-center text-base text-neutral-500">
            Verifying...
          </Text>
        )}

        {!loading && (
          <Pressable className="active:opacity-80">
            <Text className="text-center text-base text-detergent-400">
              Didn't receive a code? Resend
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
