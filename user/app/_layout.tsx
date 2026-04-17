import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setReady(true);
    };
    load();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="customer" />
        <Stack.Screen name="booking" />
        <Stack.Screen name="wisata/[id]" />
      </Stack>
    </GestureHandlerRootView>
  );
}
