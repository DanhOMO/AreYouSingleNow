import { Stack } from 'expo-router';

export default function ChatStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tin nhắn' }} />
      
      <Stack.Screen 
        name="[matchId]" 
        options={{ title: 'Chi tiết' }} 
      />
    </Stack>
  );
}