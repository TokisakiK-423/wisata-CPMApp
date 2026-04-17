import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "@/app/lib/admin/styles";
import {
  getWisata,
  deleteWisata as deleteWisataApi,
  toggleWisataStatus,
} from "@/app/lib/admin/utils/wisata";

export default function AdminWisata() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const insets = useSafeAreaInsets();

  //  FETCH DATA
  const fetchWisata = async () => {
    try {
      setLoading(true);
      const data = await getWisata();
      setWisata(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWisata();
    }, []),
  );

  //  DELETE (FIX)
  const handleDelete = (id: number) => {
    Alert.alert("Konfirmasi", "Hapus data ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          try {
            await deleteWisataApi(id);

            Alert.alert("Sukses", "Data berhasil dihapus");
            fetchWisata();
          } catch (e: any) {
            Alert.alert("Gagal", e.message);
          }
        },
      },
    ]);
  };

  // TOGGLE STATUS
  const handleToggle = async (id: number, current: boolean) => {
    await toggleWisataStatus(id, current);
    fetchWisata();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <LinearGradient
      colors={["#7b2ff7", "#f107a3"]}
      style={[styles.container, { paddingTop: insets.top + 70 }]}
    >
      <Text style={styles.title}>Data Wisata</Text>

      <FlatList
        data={wisata}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <Image
                source={{
                  uri: item.galeri?.[0]?.url
                    ? `http://10.0.2.2:3000${item.galeri[0].url}`
                    : "https://via.placeholder.com/150",
                }}
                style={styles.cardImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.nama}>{item.nama}</Text>
                <Text>{item.lokasi}</Text>
                <Text>Rp {item.hargaTiket}</Text>

                <Text style={{ color: item.status ? "green" : "red" }}>
                  {item.status ? "AKTIF" : "NONAKTIF"}
                </Text>

                <Text>📊 Booking: {item._count?.bookings ?? 0} orang</Text>

                {isExpanded && (
                  <View style={styles.detail}>
                    <Text>📍 {item.alamat}</Text>
                    <Text>🕒 {item.jamBuka}</Text>
                    <Text>📝 {item.deskripsi}</Text>
                  </View>
                )}

                <View style={styles.row}>
                  <TouchableOpacity
                    style={[
                      styles.statusBtn,
                      { backgroundColor: item.status ? "orange" : "green" },
                    ]}
                    onPress={() => handleToggle(item.id, item.status)}
                  >
                    <Text style={styles.btnText}>
                      {item.status ? "Nonaktifkan" : "Aktifkan"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => router.push(`/admin/edit?id=${item.id}`)}
                  >
                    <Text style={styles.btnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.btnText}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/edit")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
