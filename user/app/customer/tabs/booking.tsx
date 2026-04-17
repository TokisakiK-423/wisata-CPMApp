import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Booking = {
  id: number;
  wisata?: { nama: string };
  nama: string;
  noHp: string;
  jumlahTiket: number;
  status: string;
  createdAt: string;
};

export default function CustomerBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setBookings([]);
        return;
      }

      const res = await fetch('http://10.0.2.2:3000/booking/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log('MY BOOKING:', data);

      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log('FETCH ERROR:', e);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <Text style={styles.wisata}>
        {item.wisata?.nama || 'Wisata tidak ditemukan'}
      </Text>

      <Text style={styles.nama}>{item.nama}</Text>

      <Text style={styles.detail}>
        📞 {item.noHp} | 🎫 {item.jumlahTiket} tiket
      </Text>

      <View
        style={[
          styles.status,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {formatStatus(item.status)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Memuat booking...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📋 Booking Saya</Text>
      <Text style={styles.subtitle}>{bookings.length} booking</Text>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Belum ada booking</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return '#28a745'; // hijau
    case 'pending':
      return '#ffc107'; // kuning
    default:
      return '#6c757d'; // abu
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case 'approved':
      return 'DISETUJUI';
    case 'pending':
      return 'MENUNGGU';
    default:
      return status.toUpperCase();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  wisata: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  nama: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  loading: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
