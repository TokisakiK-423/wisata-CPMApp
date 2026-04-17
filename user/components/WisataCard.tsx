import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Wisata } from '../lib/api';

interface Props {
  item: Wisata;
}

export default function WisataCard({ item }: Props) {
  const router = useRouter();
  const firstImage = item.galeri?.[0]?.url;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/wisata/${item.id}`)}
    >
      {firstImage ? (
        <Image
          source={{ uri: `http://10.0.2.2:3000${firstImage}` }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.nama} numberOfLines={1}>
          {item.nama}
        </Text>
        <Text style={styles.lokasi} numberOfLines={1}>
          📍 {item.lokasi}
        </Text>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rataRataRating ?? 0}</Text>
            <Text style={styles.reviewCount}>
              ({item.totalReview ?? 0})
            </Text>
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
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  nama: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  lokasi: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  harga: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00ff84',
  },
});