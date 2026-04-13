import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '@/app/lib/admin/styles';
import {
  fetchReviewsAPI,
  renderStars,
} from '@/app/lib/admin/utils/review';

export default function AdminReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchReviewsAPI();
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <LinearGradient
      colors={['#7b2ff7', '#f107a3']}
      style={[styles.reviewContainer, { paddingTop: insets.top + 70 }]}
    >
      <Text style={styles.reviewTitle}>📊 Review Customer</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#fff' }}>
            Belum ada review
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewWisata}>
              {item.wisata?.nama || '-'}
            </Text>

            <Text style={styles.reviewRating}>
              {renderStars(item.rating)}
            </Text>

            <Text style={styles.reviewNama}>
              {item.nama}
            </Text>

            <Text style={styles.reviewKomentar}>
              {item.komentar || '-'}
            </Text>

            {item.image && item.image !== '/uploads/undefined' && (
              <Image
                source={{
                  uri: `http://10.0.2.2:3000${item.image}`,
                }}
                style={styles.reviewImage}
              />
            )}
          </View>
        )}
      />
    </LinearGradient>
  );
}
