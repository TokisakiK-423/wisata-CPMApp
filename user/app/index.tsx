import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Index() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      console.log('🔍 INDEX: Checking auth...');
      
      const [token, role, userStr] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('role'),
        AsyncStorage.getItem('user'),
      ]);

      console.log('🔑 INDEX:', { 
        token: !!token, 
        role, 
        user: userStr ? JSON.parse(userStr) : null 
      });

      if (!mounted) return;

      if (!token) {
        console.log('➡️ No token → login');
        setTarget('/login');
      } else if (role === 'admin') {
  console.log('➡️ Admin token → /admin/tabs');
  setTarget('/admin/tabs');
      } else if (role === 'customer') {
        console.log('➡️ Customer token → /customer');
        setTarget('/customer/tabs');
      } else {
        console.log('❌ Invalid role → clear & login');
        await AsyncStorage.multiRemove(['token', 'role', 'user']);
        setTarget('/login');
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (!target) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return <Redirect href={target as any} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loading: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
