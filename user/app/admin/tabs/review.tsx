import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/review', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: number) => {
    Alert.alert('Hapus', 'Yakin?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');

          await fetch(`http://10.0.2.2:3000/review/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          fetchReviews();
        },
      },
    ]);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Text key={i}>
        {i < rating ? '⭐' : '☆'}
      </Text>
    ));
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kelola Review</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nama}>
              {item.wisata?.nama}
            </Text>

            <View style={styles.starRow}>
              {renderStars(item.rating)}
            </View>

            <Text>{item.nama}</Text>
            <Text>{item.komentar}</Text>

            <TouchableOpacity
              style={styles.delete}
              onPress={() => deleteReview(item.id)}
            >
              <Text style={{ color: '#fff' }}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  card: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
  },
  nama: { fontWeight: 'bold' },
  starRow: { flexDirection: 'row', marginVertical: 5 },
  delete: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
});
