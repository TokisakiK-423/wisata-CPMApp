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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles, COLORS } from "@/app/lib/admin/styles";

export default function AdminWisata() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://10.0.2.2:3000/wisata", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const remove = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    Alert.alert("Konfirmasi", "Hapus data?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          const res = await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const r = await res.json();
          if (!res.ok) return Alert.alert("Error", r.message);

          fetchData();
        },
      },
    ]);
  };

  const toggle = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(`http://10.0.2.2:3000/wisata/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchData();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={[styles.container, { paddingTop: insets.top + 60 }]}
    >
      <Text style={styles.title}>Data Wisata</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const open = openId === item.id;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setOpenId(open ? null : item.id)}
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

                <Text>📊 Booking: {item._count?.bookings ?? 0}</Text>

                {open && (
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
                      {
                        backgroundColor: item.status
                          ? COLORS.warning
                          : COLORS.success,
                      },
                    ]}
                    onPress={() => toggle(item.id)}
                  >
                    <Text style={styles.btnText}>
                      {item.status ? "Nonaktifkan" : "Aktifkan"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => remove(item.id)}
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
