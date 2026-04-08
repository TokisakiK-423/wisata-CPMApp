import React from 'react';
import {
  SafeAreaView, Text, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminHome() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'role', 'user']);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Admin Dashboard</Text>
        <Text style={styles.subtitle}>Kelola Wisata Curup Putri Malu</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/tabs')}>
        <Text style={styles.buttonText}>🌊 Kelola Wisata + Galeri</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/tabs/booking')}>
        <Text style={styles.buttonText}>📋 Kelola Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/admin/tabs/review')}>
        <Text style={styles.buttonText}>⭐ Kelola Review</Text>
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
    backgroundColor: '#fff5f5',
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
    backgroundColor: '#FF3B30',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  logout: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});