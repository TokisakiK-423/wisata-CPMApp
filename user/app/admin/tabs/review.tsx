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

  const fetchReviews = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/review', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📊 Review Customer</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Belum ada review
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Nama Wisata */}
            <Text style={styles.wisata}>
              {item.wisata?.nama || '-'}
            </Text>

            {/* Rating */}
            <Text style={styles.rating}>
              {renderStars(item.rating)}
            </Text>

            {/* Nama Customer */}
            <Text style={styles.nama}>
              {item.nama}
            </Text>

            {/* Komentar */}
            <Text style={styles.komentar}>
              {item.komentar || '-'}
            </Text>

            {/* Gambar (jika ada) */}
            {item.image && item.image !== '/uploads/undefined' && (
              <Image
                source={{
                  uri: `http://10.0.2.2:3000${item.image}`,
                }}
                style={styles.image}
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  wisata: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  rating: {
    color: '#FFD700',
    marginVertical: 4,
  },

  nama: {
    fontWeight: '600',
  },

  komentar: {
    color: '#555',
    marginTop: 4,
  },

  image: {
    height: 140,
    marginTop: 10,
    borderRadius: 10,
  },
});
