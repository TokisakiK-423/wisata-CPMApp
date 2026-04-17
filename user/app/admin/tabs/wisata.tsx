import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminWisata() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const insets = useSafeAreaInsets();

  const fetchWisata = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://10.0.2.2:3000/wisata", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWisata(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWisata();
    }, [])
  );

  const deleteWisata = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    Alert.alert("Konfirmasi", "Hapus data ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          const res = await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const result = await res.json();

          if (!res.ok) {
            Alert.alert("Gagal", result.message);
            return;
          }

          Alert.alert("Sukses", "Data berhasil dihapus");
          fetchWisata();
        },
      },
    ]);
  };

  const toggleStatus = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`http://10.0.2.2:3000/wisata/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    fetchWisata();
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <LinearGradient
      colors={["#7b2ff7", "#f107a3"]}
      style={[styles.container, { paddingTop: insets.top + 60 }]}
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
                    onPress={() => toggleStatus(item.id)}
                  >
                    <Text style={styles.btnText}>
                      {item.status ? "Nonaktifkan" : "Aktifkan"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteWisata(item.id)}
                  >
                    <Text style={styles.btnText}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },

  nama: {
    fontWeight: "bold",
    fontSize: 16,
  },

  detail: {
    marginTop: 6,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 6,
  },

  statusBtn: {
    padding: 6,
    borderRadius: 6,
  },

  btnText: {
    color: "#fff",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  fabText: {
    color: "#fff",
    fontSize: 30,
  },
});
