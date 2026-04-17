import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { styles, COLORS } from "@/app/lib/wisata/style";
import { fetchWisataDetail } from "@/app/lib/wisata/utils/wisata";

export default function WisataDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // HITUNG RATING
  const getRating = (reviews?: any[]) => {
    if (!reviews || reviews.length === 0) {
      return { avg: 0, total: 0 };
    }

    const total = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total;

    return { avg, total };
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const res = await fetchWisataDetail(id as string);
      setData(res);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Data tidak ditemukan</Text>
      </View>
    );
  }

  const { avg, total } = getRating(data?.reviews);

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Detail Wisata
          </Text>
        </View>

        {/* IMAGE */}
        <Image
          source={{
            uri: data.galeri?.[0]?.url
              ? `http://10.0.2.2:3000${data.galeri[0].url}`
              : "https://via.placeholder.com/400",
          }}
          style={styles.image}
        />

        {/*  CARD UTAMA (GABUNG INFO + DESKRIPSI) */}
        <View style={styles.card}>
          <Text style={styles.nama}>{data.nama}</Text>

          {/* INFO */}
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{data.lokasi}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="home-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{data.alamat}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{data.jamBuka}</Text>
          </View>

          {/* PRICE + RATING */}
          <View style={styles.bottomRow}>
            <Text style={styles.price}>
              Rp {Number(data.hargaTiket || 0).toLocaleString()}
            </Text>

            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{Number(avg).toFixed(1)}</Text>
              <Text style={styles.review}>({total})</Text>
            </View>
          </View>

          {/*  GARIS PEMISAH HALUS */}
          <View
            style={{
              height: 1,
              backgroundColor: "#eee",
              marginVertical: 15,
            }}
          />

          {/* DESKRIPSI */}
          <Text style={styles.descTitle}>Deskripsi</Text>
          <Text style={styles.desc}>{data.deskripsi}</Text>
        </View>
      </ScrollView>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => router.push(`/booking?id=${data.id}`)}
      >
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.bookText}>Pesan Tiket</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
