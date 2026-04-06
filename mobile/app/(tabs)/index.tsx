import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type WisataItem = {
  id: number;
  nama: string;
  lokasi: string;
  rataRataRating?: number;
  totalReview?: number;
  hargaTiket?: number;
  galeri?: { url: string }[];
};

export default function HomeScreen() {
  const [wisata, setWisata] = useState<WisataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchWisata = useCallback(async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/wisata');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setWisata(data);
      console.log('Wisata loaded:', data.length);
    } catch (error) {
      console.error('Fetch error:', error);
      setWisata([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWisata();
  }, [fetchWisata]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWisata().finally(() => setRefreshing(false));
  }, [fetchWisata]);

  const renderWisata = ({ item }: { item: WisataItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
        console.log('Klik item:', item.id);
        router.push(`/wisata/${item.id}`);
      }}
    >
      <Image
        source={{
          uri: item.galeri?.[0]
            ? `http://10.0.2.2:3000${item.galeri[0].url}`
            : 'https://via.placeholder.com/300x200/007AFF/FFFFFF?text=WISATA',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.nama} numberOfLines={1}>
          {item.nama}
        </Text>
        <Text style={styles.lokasi} numberOfLines={1}>
          📍 {item.lokasi}
        </Text>
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}> {item.rataRataRating ?? 0}</Text>
            <Text style={styles.reviewCount}> ({item.totalReview ?? 0})</Text>
          </View>
          {typeof item.hargaTiket === 'number' && (
            <Text style={styles.harga}>
              Rp {item.hargaTiket.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Memuat wisata...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌊 CPMApp</Text>
        <Text style={styles.subtitle}>Wisata Lampung ({wisata.length})</Text>
      </View>

      <FlatList
        data={wisata}
        renderItem={renderWisata}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  image: { width: '100%', height: 180 },
  content: { padding: 16 },
  nama: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  lokasi: { fontSize: 15, color: '#666', marginBottom: 12 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 16, fontWeight: '600', color: '#FFD700', marginLeft: 4 },
  reviewCount: { fontSize: 14, color: '#666', marginLeft: 4 },
  harga: { fontSize: 16, color: '#28a745', fontWeight: '700' },
  loading: { marginTop: 16, fontSize: 16, color: '#666' },
});
