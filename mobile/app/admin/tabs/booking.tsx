import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Booking = {
  id: number;
  wisata: { nama: string };
  nama: string;
  noHp: string;
  jumlahTiket: number;
  status: string;
  createdAt: string;
};

export default function AdminBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/booking', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`http://10.0.2.2:3000/booking/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
      Alert.alert('Sukses', `Status diubah ke ${newStatus}`);
    } catch {
      Alert.alert('Error', 'Gagal update status');
    } finally {
      setUpdating(null);
    }
  };

  const deleteBooking = async (id: number) => {
    Alert.alert(
      'Hapus Booking',
      'Yakin hapus booking ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await fetch(`http://10.0.2.2:3000/booking/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchBookings();
            } catch {
              Alert.alert('Error', 'Gagal hapus');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.wisata}>{item.wisata.nama}</Text>
        <Text style={styles.nama}>{item.nama}</Text>
        <Text style={styles.detail}>📞 {item.noHp} | 🎫 {item.jumlahTiket} tiket</Text>
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.status === 'pending' && styles.pendingBtn,
            updating === item.id && styles.updatingBtn,
          ]}
          onPress={() => updateStatus(item.id, 'confirmed')}
          disabled={updating === item.id}
        >
          <Text style={styles.statusText}>
            {updating === item.id ? '⏳' : '✅'} Confirm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.status === 'cancelled' && styles.cancelledBtn,
            updating === item.id && styles.updatingBtn,
          ]}
          onPress={() => updateStatus(item.id, 'cancelled')}
          disabled={updating === item.id}
        >
          <Text style={styles.statusText}>
            {updating === item.id ? '⏳' : '❌'} Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteBooking(item.id)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={[
        styles.statusBadge,
        { backgroundColor: item.status === 'confirmed' ? '#28a745' : 
                          item.status === 'cancelled' ? '#dc3545' : '#ffc107' }
      ]}>
        <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loading}>Memuat booking...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📋 Kelola Booking ({bookings.length})</Text>
      
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  info: { flex: 1 },
  wisata: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  nama: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  detail: { fontSize: 14, color: '#666', marginBottom: 2 },
  date: { fontSize: 14, color: '#999' },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  statusBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  pendingBtn: { backgroundColor: '#ffc107' },
  cancelledBtn: { backgroundColor: '#dc3545' },
  updatingBtn: { backgroundColor: '#6c757d' },
  statusText: { color: 'white', fontWeight: '600', fontSize: 14 },
  deleteBtn: {
    padding: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  deleteText: { color: 'white', fontSize: 16, fontWeight: '700' },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  loading: { marginTop: 16, fontSize: 16, color: '#666' },
});