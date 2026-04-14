import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* This points to the (tabs) folder */}
        <Stack.Screen name="(tabs)" />
        {/* This handles the Detail page outside the tab bar */}
        <Stack.Screen name="post/[id]" options={{ headerShown: true, title: 'Details' }} />
      </Stack>
    </SafeAreaProvider>
  );
}