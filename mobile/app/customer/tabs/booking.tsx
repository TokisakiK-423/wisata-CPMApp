import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/app/lib/customer/colors";
import { styles } from "@/app/lib/customer/styles";
import {
  fetchMyBookings,
  deleteBooking,
  getStatusColor,
  formatStatus,
} from "@/app/lib/customer/utils/booking";

export default function CustomerBooking() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const loadData = async () => {
    setLoading(true);
    const data = await fetchMyBookings();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchMyBookings();
    setBookings(data);
    setRefreshing(false);
  };

  // DELETE
  const handleDelete = (id: number) => {
    Alert.alert("Hapus Booking", "Yakin ingin menghapus booking ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBooking(id);
            loadData();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => {
    const isNonaktif = item.wisata?.status === false;

    return (
      <View style={styles.bookingCard}>
        {/* JUDUL SAJA */}
        <Text style={styles.bookingWisata}>
          {item.wisata?.nama || "Wisata tidak ditemukan"}
        </Text>

        {isNonaktif && (
          <Text style={{ color: "red", fontWeight: "bold" }}>⚠️ Nonaktif</Text>
        )}

        <Text style={styles.bookingNama}>{item.nama}</Text>

        <Text style={styles.bookingDetail}>
          📞 {item.noHp} • 🎫 {item.jumlahTiket}
        </Text>

        {/* STATUS + DELETE SEJAJAR */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          {/* STATUS */}
          <View
            style={[
              styles.bookingStatus,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.bookingStatusText}>
              {formatStatus(item.status)}
            </Text>
          </View>

          {/* DELETE ICON */}
          {item.status === "pending" && (
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={{
                backgroundColor: "#ef4444",
                padding: 6,
                borderRadius: 20,
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color="#fff" />
        <Text style={styles.loadingText}>Memuat booking...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={[styles.container, { paddingTop: insets.top + 60 }]}
    >
      <Text style={styles.bookingTitle}>📋 Booking Saya</Text>
      <Text style={styles.bookingSubtitle}>{bookings.length} data</Text>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada booking</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}
