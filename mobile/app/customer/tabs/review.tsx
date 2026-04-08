import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Review = {
  id: number;
  wisata: { nama: string };
  nama: string;
  rating: number;
  komentar?: string;
};

export default function CustomerReview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ wisataId: 1, nama: '', rating: 5, komentar: '' });

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

  const addReview = async () => {
    if (!newReview.nama) {
      Alert.alert('Error', 'Nama wajib diisi');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await fetch('http://10.0.2.2:3000/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });
      setNewReview({ wisataId: 1, nama: '', rating: 5, komentar: '' });
      fetchReviews();
      Alert.alert('Sukses', 'Review ditambahkan');
    } catch {
      Alert.alert('Error', 'Gagal tambah review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.wisata}>{item.wisata.nama}</Text>
        <Text style={styles.rating}>{'★'.repeat(item.rating)}</Text>
      </View>
      <Text style={styles.nama}>{item.nama}</Text>
      {item.komentar && <Text style={styles.komentar}>{item.komentar}</Text>}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>⭐ Review Saya</Text>

      {/* Tambah Review Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nama Anda"
          value={newReview.nama}
          onChangeText={(text) => setNewReview({ ...newReview, nama: text })}
        />
        <Text style={styles.label}>Rating (1-5): {newReview.rating}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setNewReview({ ...newReview, rating: star })}
              style={[
                styles.starBtn,
                newReview.rating >= star && styles.starBtnActive,
              ]}
            >
              <Text style={styles.star}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Komentar (opsional)"
          value={newReview.komentar}
          onChangeText={(text) => setNewReview({ ...newReview, komentar: text })}
          multiline
        />
        <TouchableOpacity style={styles.addBtn} onPress={addReview}>
          <Text style={styles.addText}>+ Tambah Review</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Belum ada review</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  form: { marginBottom: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
    fontSize: 16,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  starBtnActive: {
    backgroundColor: '#007AFF',
  },
  star: {
    fontSize: 24,
    color: '#666',
  },
  addBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addText: { color: 'white', fontWeight: '700', fontSize: 16 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wisata: { fontSize: 16, fontWeight: '700' },
  rating: { fontSize: 20, color: '#FFD700' },
  nama: { fontSize: 16, color: '#666', marginBottom: 4 },
  komentar: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});