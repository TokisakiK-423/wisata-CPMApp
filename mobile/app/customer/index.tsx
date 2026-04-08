import React from 'react';
import {
  SafeAreaView, Text, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomerHome() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'role', 'user']);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👋 Customer Home</Text>
        <Text style={styles.subtitle}>Temukan wisata impianmu!</Text>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.replace('/customer/tabs')}
      >
        <Text style={styles.buttonText}>🌊 Lihat Wisata</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/customer/tabs/booking')}
      >
        <Text style={styles.buttonText}>📋 Booking Saya</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/customer/tabs/review')}
      >
        <Text style={styles.buttonText}>⭐ Review Saya</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  logout: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});