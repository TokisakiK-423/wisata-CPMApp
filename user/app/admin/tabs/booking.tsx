import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function AdminBooking() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/booking', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('ADMIN BOOKING:', data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log('ERROR FETCH:', e);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await fetch(`http://10.0.2.2:3000/booking/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      fetchBookings();
    } catch (e) {
      console.log('UPDATE ERROR:', e);
    }
  };

  const deleteBooking = async (id: number) => {
    Alert.alert('Hapus', 'Yakin hapus booking ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');

            await fetch(`http://10.0.2.2:3000/booking/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            fetchBookings();
          } catch (e) {
            console.log('DELETE ERROR:', e);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Semua Booking</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nama}</Text>

            <Text>📍 Wisata: {item.wisata?.nama || '-'}</Text>
            <Text>📞 No HP: {item.noHp}</Text>
            <Text>🎫 Tiket: {item.jumlahTiket}</Text>
            <Text>👤 Customer: {item.customer?.username || '-'}</Text>

            <Text style={styles.status}>
              Status: {item.status}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: 'green' }]}
                onPress={() => updateStatus(item.id, 'approved')}
              >
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: 'orange' }]}
                onPress={() => updateStatus(item.id, 'pending')}
              >
                <Text style={styles.btnText}>Pending</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: 'red' }]}
                onPress={() => deleteBooking(item.id)}
              >
                <Text style={styles.btnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  btn: {
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
  },
});
