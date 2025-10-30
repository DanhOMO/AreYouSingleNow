import { View, Text } from "react-native";
export default function Loading() {
  return (
    <View className="flex min-h-screen items-center justify-center bg-white">
      <View className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-[#FF6B9A]"></View>
    </View>
  );
}