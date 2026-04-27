import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext'; // Path to your AuthContext
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

// This is a sub-component so we can use the useAuth hook inside it
function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if the user is currently in the (tabs) group
    const inAuthGroup = segments[0] === '(tabs)';

    if (!token && inAuthGroup) {
      // Redirect to login if not authenticated and trying to access tabs
      router.replace('/login');
    } else if (token && segments[0] === 'login') {
      // Redirect to home if authenticated and trying to access login
      router.replace('/(tabs)');
    }
  }, [token, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: true, title: 'Details' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}