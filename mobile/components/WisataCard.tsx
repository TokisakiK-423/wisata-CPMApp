import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Link } from 'react-native';
import { useRouter } from 'expo-router';
import { Wisata } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  item: Wisata;
}

export default function WisataCard({ item }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/wisata/${item.id}`)}>
      {item.galeri[0] ? (
        <Image
          source={{ uri: `http://10.0.2.2:3000${item.galeri[0].url}` }}
          style={styles.image}
          defaultSource={{ uri: 'https://via.placeholder.com/300x200/007AFF/FFFFFF?text=No+Image' }}
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
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
            <Text style={styles.rating}>⭐ {item.rataRataRating}</Text>
            <Text style={styles.reviewCount}>({item.totalReview})</Text>
          </View>
          {item.hargaTiket && (
            <Text style={styles.harga}>Rp {item.hargaTiket.toLocaleString()}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#007AFF',
  },
});