import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function BookingScreen() {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id: wisataId } = useLocalSearchParams();

  const bookWisata = async () => {
    if (!nama || !noHp || !jumlah) {
      Alert.alert('Error', 'Lengkapi semua field');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wisataId: parseInt(wisataId || '1'),
          nama,
          noHp,
          jumlahTiket: parseInt(jumlah),
        }),
      });

      const data = await response.json();
      Alert.alert('✅ Booking Berhasil!', `ID Booking: ${data.id || 'Sukses'}`);
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('❌ Error', 'Gagal booking. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>📅 Booking Tiket</Text>
        <Text style={styles.subtitle}>Wisata ID: {wisataId || 1}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Ionicons name="person" size={24} color="#007AFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={nama}
              onChangeText={setNama}
              placeholder="Nama Lengkap"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="call" size={24} color="#007AFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={noHp}
              onChangeText={setNoHp}
              placeholder="No. HP (08xxxxxxxxx)"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="ticket" size={24} color="#007AFF" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={jumlah}
              onChangeText={setJumlah}
              placeholder="Jumlah Tiket"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={bookWisata}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '⏳ Processing...' : '🚀 Booking Sekarang'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { flexGrow: 1, padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#1a1a1a' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#666' },
  form: { flex: 1 },
  inputGroup: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 16, 
    marginBottom: 20, 
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  icon: { marginRight: 12, alignSelf: 'center' },
  input: { 
    flex: 1, 
    paddingVertical: 16, 
    fontSize: 16,
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 20, 
    borderRadius: 16, 
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});