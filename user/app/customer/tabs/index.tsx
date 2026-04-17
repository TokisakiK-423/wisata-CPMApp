import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles, COLORS } from "@/app/lib/customer/styles";
import { fetchWisata, getRating } from "@/app/lib/customer/utils";

export default function CustomerHomeScreen() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const loadData = async () => {
    setLoading(true);
    const data = await fetchWisata();
    setWisata(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchWisata();
    setWisata(data);
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => {
    const { avg, total } = getRating(item.reviews);

    return (
      <TouchableOpacity
        style={styles.cardHorizontal}
        onPress={() => router.push(`/wisata/${item.id}`)}
      >
        <Image
          source={{
            uri: item.galeri?.[0]?.url
              ? `http://10.0.2.2:3000${item.galeri[0].url}`
              : "https://via.placeholder.com/300x200",
          }}
          style={styles.imageHorizontal}
        />

        <View style={styles.contentHorizontal}>
          <View style={styles.topRow}>
            <Text style={styles.namaHorizontal} numberOfLines={2}>
              Wisata: {item.nama}
            </Text>
          </View>

          <Text style={styles.desc} numberOfLines={1}>
            📍 {item.lokasi}
          </Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text>{Number(avg).toFixed(1)}</Text>
            <Text style={{ color: "#666" }}>({total})</Text>
          </View>

          <Text style={styles.price}>
            Rp {Number(item.hargaTiket).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={[styles.container, { paddingTop: insets.top + 60 }]}
    >
      <FlatList
        data={wisata}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Wisata Bisa Dikunjungi</Text>
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </LinearGradient>
  );
}
