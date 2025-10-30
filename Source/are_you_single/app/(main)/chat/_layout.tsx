// Tệp: app/(main)/chat/_layout.tsx
import { Stack } from 'expo-router';

export default function ChatStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="[matchId]" />
    </Stack>
  );
}