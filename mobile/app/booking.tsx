import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,SafeAreaView,
  Alert, ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookingScreen() {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [loading, setLoading] = useState(false);
  const [wisataInfo, setWisataInfo] = useState<any>(null);
  const router = useRouter();
  const { id: wisataId } = useLocalSearchParams<{ id?: string }>();

  // Auto-fill nama dari user profile
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setNama(user.nama || '');
        }
      } catch {
        // Fallback manual input
      }
    };
    loadUser();
  }, []);

  // Load info wisata
  useEffect(() => {
    if (!wisataId) return;
    fetch(`http://10.0.2.2:3000/wisata/${wisataId}`)
      .then(res => res.json())
      .then(setWisataInfo)
      .catch(console.error);
  }, [wisataId]);

  const bookWisata = async () => {
    if (!nama || !noHp || !jumlah || jumlah === '0') {
      Alert.alert('Error', 'Lengkapi nama, no HP, dan jumlah tiket');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.0.2.2:3000/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          wisataId: parseInt(wisataId || '1', 10),
          nama,
          noHp,
          jumlahTiket: parseInt(jumlah, 10),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || 'Booking gagal');
      }

      Alert.alert(
        '✅ Booking Berhasil!',
        `ID: ${data.id}\nStatus: ${data.status || 'pending'}\nTiket: ${data.jumlahTiket}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('❌ Booking Gagal', error.message || 'Coba lagi');
    } finally {
      setLoading(false);
    }
  };

  const incrementJumlah = () => {
    setJumlah((prev) => (parseInt(prev) + 1).toString());
  };

  const decrementJumlah = () => {
    if (parseInt(jumlah) > 1) {
      setJumlah((prev) => (parseInt(prev) - 1).toString());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Wisata */}
        <View style={styles.header}>
          {wisataInfo?.galeri?.[0] ? (
            <Image
              source={{ uri: `http://10.0.2.2:3000${wisataInfo.galeri[0].url}` }}
              style={styles.headerImage}
            />
          ) : (
            <View style={[styles.headerImage, styles.placeholderImage]} />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.wisataNama}>{wisataInfo?.nama || 'Wisata'}</Text>
            <Text style={styles.wisataLokasi}>{wisataInfo?.lokasi}</Text>
            {wisataInfo?.hargaTiket && (
              <Text style={styles.harga}>
                Rp {wisataInfo.hargaTiket.toLocaleString()} / tiket
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.title}>📅 Booking Tiket</Text>
        <Text style={styles.subtitle}>Wisata ID: {wisataId || '1'}</Text>

        {/* Form */}
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
              placeholder="No. HP"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="ticket" size={24} color="#007AFF" style={styles.icon} />
            <View style={styles.jumlahContainer}>
              <TouchableOpacity style={styles.counterBtn} onPress={decrementJumlah}>
                <Ionicons name="remove" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TextInput
                style={styles.jumlahInput}
                value={jumlah}
                onChangeText={setJumlah}
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity style={styles.counterBtn} onPress={incrementJumlah}>
                <Ionicons name="add" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.jumlahLabel}>Tiket</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={bookWisata}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {wisataInfo?.hargaTiket 
                  ? `🚀 Booking (${parseInt(jumlah) * (wisataInfo.hargaTiket || 0)})` 
                  : '🚀 Booking Sekarang'
                }
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { flexGrow: 1, padding: 20 },
  header: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 4,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    padding: 20,
  },
  wisataNama: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  wisataLokasi: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  harga: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
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
    alignItems: 'center',
  },
  icon: { marginRight: 12 },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
  },
  jumlahContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumlahInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  jumlahLabel: {
    position: 'absolute',
    right: 16,
    top: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
