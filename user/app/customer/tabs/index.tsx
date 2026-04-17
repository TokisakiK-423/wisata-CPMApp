import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  ActivityIndicator, RefreshControl, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type WisataItem = {
  id: number;
  nama: string;
  lokasi: string;
  hargaTiket?: number;
  status: boolean;
  galeri?: { url: string }[];
  reviews?: { rating: number }[];
};

export default function CustomerHomeScreen() {
  const [wisata, setWisata] = useState<WisataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchWisata = useCallback(async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/wisata');
      const data = await res.json();

      // 🔥 FILTER hanya aktif
      const filtered = Array.isArray(data)
        ? data.filter((w) => w.status === true)
        : [];

      setWisata(filtered);
    } catch {
      setWisata([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWisata();
  }, []);

  const getRating = (reviews?: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return { avg: 0, total: 0 };
    const total = reviews.length;
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    return { avg, total };
  };

  const renderWisata = ({ item }: { item: WisataItem }) => {
    const { avg, total } = getRating(item.reviews);

    const imageUrl =
      item.galeri && item.galeri.length > 0
        ? `http://10.0.2.2:3000${item.galeri[0].url}`
        : 'https://via.placeholder.com/300x200';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/wisata/${item.id}`)}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.nama}>{item.nama}</Text>
          <Text style={styles.lokasi}>📍 {item.lokasi}</Text>

          <View style={styles.footer}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}> {avg.toFixed(1)}</Text>
              <Text style={styles.reviewCount}> ({total})</Text>
            </View>

            {item.hargaTiket && (
              <Text style={styles.harga}>
                Rp {item.hargaTiket.toLocaleString()}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wisata}
        renderItem={renderWisata}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchWisata} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  card: {
    backgroundColor: 'white',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: { height: 180 },
  content: { padding: 12 },
  nama: { fontSize: 18, fontWeight: 'bold' },
  lokasi: { color: '#666' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingContainer: { flexDirection: 'row' },
  rating: { color: '#FFD700' },
  reviewCount: { color: '#666' },
  harga: { color: 'green', fontWeight: 'bold' },
});
