import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type WisataDetail = {
  id: number;
  nama: string;
  lokasi: string;
  deskripsi: string;
  alamat: string;
  jamBuka: string;
  rataRataRating?: number;
  totalReview?: number;
  hargaTiket?: number;
  galeri?: { url: string }[];
  telepon?: string;
};

export default function WisataDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [data, setData] = useState<WisataDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`http://10.0.2.2:3000/wisata/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Wisata tidak ditemukan');
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat detail wisata');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.error}>{error || 'Data tidak ditemukan'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonHeader}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.nama}>{data.nama}</Text>
        </View>

        <Image
          source={{
            uri: data.galeri?.[0]?.url
              ? `http://10.0.2.2:3000${data.galeri[0].url}`
              : 'https://via.placeholder.com/600x400?text=No+Image',
          }}
          style={styles.heroImage}
        />

        <View style={styles.ratingSection}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{data.rataRataRating ?? 0}</Text>
            <Text style={styles.reviewCount}> ({data.totalReview ?? 0} ulasan)</Text>
          </View>
          {typeof data.hargaTiket === 'number' && (
            <View style={styles.hargaContainer}>
              <Text style={styles.harga}>
                Rp {data.hargaTiket.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <Text style={styles.infoLabel}>Lokasi:</Text>
            <Text style={styles.infoValue}>{data.lokasi}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.infoLabel}>Jam Buka:</Text>
            <Text style={styles.infoValue}>{data.jamBuka}</Text>
          </View>

          {data.telepon && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#007AFF" />
              <Text style={styles.infoLabel}>Telepon:</Text>
              <Text style={styles.infoValue}>{data.telepon}</Text>
            </View>
          )}
        </View>

        <View style={styles.descContainer}>
          <Text style={styles.descTitle}>Deskripsi</Text>
          <Text style={styles.desc}>{data.deskripsi}</Text>
        </View>

        {data.galeri && data.galeri.length > 1 && (
          <View style={styles.galleryContainer}>
            <Text style={styles.galleryTitle}>Galeri</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.galeri.slice(1).map((foto, index) => (
                <Image
                  key={index}
                  source={{ uri: `http://10.0.2.2:3000${foto.url}` }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push(`/booking?id=${data.id}`)}
      >
        <Ionicons name="calendar-outline" size={20} color="white" />
        <Text style={styles.bookButtonText}>Pesan Tiket</Text>
      </TouchableOpacity>
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
    padding: 20,
  },
  scrollView: { flex: 1 },
  header: {
    minHeight: 120,
    backgroundColor: '#007AFF',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  backButtonHeader: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  nama: { fontSize: 24, fontWeight: 'bold', color: 'white', marginTop: 8 },
  heroImage: { width: '100%', height: 280 },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    elevation: 4,
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 20, fontWeight: 'bold', color: '#FFD700', marginLeft: 8 },
  reviewCount: { fontSize: 14, color: '#666', marginLeft: 4 },
  hargaContainer: { justifyContent: 'center' },
  harga: { fontSize: 20, color: '#28a745', fontWeight: 'bold' },
  infoContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
    flex: 0.3,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 0.7,
    marginLeft: 4,
  },
  descContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  descTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  desc: { fontSize: 16, color: '#666', lineHeight: 24 },
  galleryContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  galleryTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
  error: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});