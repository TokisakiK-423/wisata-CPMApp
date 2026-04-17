import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function CustomerReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [wisataList, setWisataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    wisataId: 0,
    rating: 5,
    komentar: '',
  });

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const [r1, r2] = await Promise.all([
        fetch('http://10.0.2.2:3000/review', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://10.0.2.2:3000/wisata'),
      ]);

      setReviews(await r1.json());
      setWisataList(await r2.json());
    } catch (e) {
      console.log(e);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= PICK IMAGE =================
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      setImage(res.assets[0]);
    }
  };

  // ================= SUBMIT =================
  const addReview = async () => {
    if (!form.wisataId) {
      Alert.alert('Error', 'Pilih wisata dulu');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();

      formData.append('wisataId', String(form.wisataId));
      formData.append('rating', String(form.rating));
      formData.append('komentar', form.komentar);

      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: 'review.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const res = await fetch('http://10.0.2.2:3000/review', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        Alert.alert('Error', result.message);
        return;
      }

      Alert.alert('Sukses', 'Review terkirim');

      setForm({ wisataId: 0, rating: 5, komentar: '' });
      setImage(null);

      fetchData();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Gagal kirim');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📝 Review Wisata</Text>

      {/* PILIH WISATA */}
      <FlatList
        horizontal
        data={wisataList}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.wisataBtn,
              form.wisataId === item.id && styles.active,
            ]}
            onPress={() => setForm({ ...form, wisataId: item.id })}
          >
            <Text style={{ color: form.wisataId === item.id ? '#fff' : '#000' }}>
              {item.nama}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* KOMENTAR */}
      <TextInput
        placeholder="Tulis komentar..."
        style={styles.input}
        value={form.komentar}
        onChangeText={(t) => setForm({ ...form, komentar: t })}
      />

      {/* RATING SIMPLE */}
      <View style={styles.ratingRow}>
        {[1,2,3,4,5].map((r) => (
          <TouchableOpacity key={r} onPress={() => setForm({ ...form, rating: r })}>
            <Text style={r <= form.rating ? styles.starActive : styles.star}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PICK IMAGE */}
      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text>Pilih Gambar</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      {/* SUBMIT */}
      <TouchableOpacity style={styles.btn} onPress={addReview}>
        <Text style={{ color: '#fff' }}>Kirim</Text>
      </TouchableOpacity>

      {/* LIST REVIEW */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.wisata?.nama}
            </Text>

            <Text style={styles.ratingText}>
              {'★'.repeat(item.rating)}
            </Text>

            <Text style={styles.name}>{item.nama}</Text>

            <Text style={styles.comment}>
              {item.komentar}
            </Text>

            {item.image && (
              <Image
                source={{ uri: `http://10.0.2.2:3000${item.image}` }}
                style={styles.reviewImage}
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  wisataBtn: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },

  active: {
    backgroundColor: '#000',
  },

  ratingRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  star: {
    fontSize: 24,
    color: '#ccc',
    marginRight: 5,
  },

  starActive: {
    fontSize: 24,
    color: '#FFD700',
    marginRight: 5,
  },

  imageBtn: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  preview: {
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  ratingText: {
    color: '#FFD700',
  },

  name: {
    fontWeight: '600',
  },

  comment: {
    color: '#555',
  },

  reviewImage: {
    height: 120,
    marginTop: 8,
    borderRadius: 10,
  },
});
