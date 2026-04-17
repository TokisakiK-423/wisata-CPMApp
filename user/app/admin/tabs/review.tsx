import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'http://10.0.2.2:3000';

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(`${BASE_URL}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const imageUrl =
      item.image && item.image !== '/uploads/undefined'
        ? `${BASE_URL}${item.image}`
        : null;

    return (
      <View style={styles.card}>
        <Text style={styles.wisata}>
          {item.wisata?.nama || '-'}
        </Text>

        <Text style={styles.rating}>
          {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
        </Text>

        <Text style={styles.nama}>{item.nama}</Text>

        <Text style={styles.komentar}>
          {item.komentar || '-'}
        </Text>

        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Review Customer</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Belum ada review</Text>
        }
      />
    </SafeAreaView>
  );
}

const PRIMARY = '#2563eb'; // biru modern
const BG = '#f1f5f9';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  wisata: {
    fontSize: 15,
    fontWeight: '600',
  },

  rating: {
    color: '#facc15',
    marginVertical: 4,
  },

  nama: {
    fontWeight: '500',
    marginTop: 2,
  },

  komentar: {
    color: '#475569',
    marginTop: 4,
  },

  image: {
    height: 140,
    borderRadius: 10,
    marginTop: 10,
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
  },
});
