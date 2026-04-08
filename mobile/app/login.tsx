import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username dan password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('LOGIN RESPONSE:', data);

      if (!res.ok) {
        throw new Error(data?.message || 'Login gagal');
      }

      // ✅ FIX: Ambil role dari API response
      const role = data.role; // admin/customer
      const user = data.user;

      await AsyncStorage.multiSet([
        ['token', data.access_token],
        ['role', role],
        ['user', JSON.stringify(user)],
      ]);

      const tokenCheck = await AsyncStorage.getItem('token');
      const roleCheck = await AsyncStorage.getItem('role');
      console.log('TOKEN:', tokenCheck ? 'OK' : 'NULL');
      console.log('ROLE:', roleCheck);

      router.replace(role === 'admin' ? '/admin' : '/customer');
    } catch (e: any) {
      Alert.alert('Login gagal', e.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌊 CPMApp</Text>
      <Text style={styles.subtitle}>Wisata Curup Putri Malu</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.demo}>
        👨‍💼 admin/admin | 👤 customer1/123
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  demo: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});