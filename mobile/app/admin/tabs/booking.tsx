import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/app/lib/admin/styles';
import {
  fetchBookingsAPI,
  updateBookingStatusAPI,
  deleteBookingAPI,
} from '@/app/lib/admin/utils/booking';

export default function AdminBooking() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchBookingsAPI();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <LinearGradient
      colors={['#7b2ff7', '#f107a3']}
      style={[styles.bookingContainer, { paddingTop: insets.top + 70 }]}
    >
      <Text style={styles.bookingTitle}>Semua Booking</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <Text style={styles.bookingName}>{item.nama}</Text>

            <Text>📍 {item.wisata?.nama || '-'}</Text>
            <Text>📞 {item.noHp}</Text>
            <Text>🎫 {item.jumlahTiket}</Text>
            <Text>👤 {item.customer?.username || '-'}</Text>

            <Text style={styles.bookingStatus}>
              Status: {item.status}
            </Text>

            <View style={styles.bookingActions}>
              {/* 🔥 GABUNG APPROVE + PENDING */}
              <TouchableOpacity
                style={[
                  styles.bookingBtn,
                  {
                    backgroundColor:
                      item.status === 'pending' ? 'green' : 'orange',
                  },
                ]}
                onPress={() => {
                  const newStatus =
                    item.status === 'pending' ? 'approved' : 'pending';

                  updateBookingStatusAPI(item.id, newStatus);
                  fetchData();
                }}
              >
                <Text style={styles.bookingBtnText}>
                  {item.status === 'pending' ? 'Approve' : 'Pending'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bookingBtn, { backgroundColor: 'red' }]}
                onPress={() =>
                  deleteBookingAPI(item.id, fetchData)
                }
              >
                <Text style={styles.bookingBtnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}
