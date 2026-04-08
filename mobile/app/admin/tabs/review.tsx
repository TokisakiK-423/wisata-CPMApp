import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Review = {
  id: number;
  wisata: { nama: string };
  nama: string;
  rating: number;
  komentar?: string;
  createdAt: string;
};

export default function AdminReview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/review', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: number) => {
    Alert.alert(
      'Hapus Review',
      'Yakin hapus review ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setDeleting(id);
            try {
              const token = await AsyncStorage.getItem('token');
              await fetch(`http://10.0.2.2:3000/review/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchReviews();
              Alert.alert('Sukses', 'Review dihapus');
            } catch {
              Alert.alert('Error', 'Gagal hapus review');
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.wisata}>{item.wisata.nama}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Text key={i}>⭐</Text>
          ))}
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>

      <Text style={styles.nama}>{item.nama}</Text>
      {item.komentar && (
        <Text style={styles.komentar}>{item.komentar}</Text>
      )}
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>

      <TouchableOpacity
        style={[
          styles.deleteBtn,
          deleting === item.id && styles.deletingBtn,
        ]}
        onPress={() => deleteReview(item.id)}
        disabled={deleting === item.id}
      >
        <Text style={styles.deleteText}>
          {deleting === item.id ? '⏳ Menghapus...' : '🗑️ Hapus Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loading}>Memuat review...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>⭐ Kelola Review ({reviews.length})</Text>
      
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wisata: { fontSize: 16, fontWeight: '700' },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: { fontSize: 16, fontWeight: '600', marginLeft: 4 },
  nama: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  komentar: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
    lineHeight: 22,
  },
  date: { fontSize: 14, color: '#999' },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deletingBtn: {
    backgroundColor: '#6c757d',
  },
  deleteText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  loading: { marginTop: 16, fontSize: 16, color: '#666' },
});