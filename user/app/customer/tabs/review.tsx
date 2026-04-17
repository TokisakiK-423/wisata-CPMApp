import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomerReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [wisataList, setWisataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    wisataId: 0,
    nama: '',
    rating: 5,
    komentar: '',
  });
const [rating, setRating] = useState(5);
const [komentar, setKomentar] = useState('');

const submitReview = async () => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch('http://10.0.2.2:3000/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      wisataId: id,
      rating,
      komentar,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    Alert.alert('Error', result.message);
    return;
  }

  Alert.alert('Sukses', 'Review berhasil dikirim');

  setKomentar('');
  fetchDetail(); // 🔥 reload biar langsung muncul
};
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
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addReview = async () => {
    if (!form.nama || !form.wisataId) {
      Alert.alert('Error', 'Lengkapi data');
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
        body: JSON.stringify(form),
      });

      setForm({ wisataId: 0, nama: '', rating: 5, komentar: '' });
      fetchData();
    } catch {
      Alert.alert('Error', 'Gagal tambah');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Review</Text>

      {/* pilih wisata */}
      <FlatList
        horizontal
        data={wisataList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.wisataBtn,
              form.wisataId === item.id && styles.active,
            ]}
            onPress={() => setForm({ ...form, wisataId: item.id })}
          >
            <Text>{item.nama}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        placeholder="Nama"
        style={styles.input}
        value={form.nama}
        onChangeText={(t) => setForm({ ...form, nama: t })}
      />

      <TextInput
        placeholder="Komentar"
        style={styles.input}
        value={form.komentar}
        onChangeText={(t) => setForm({ ...form, komentar: t })}
      />

      <TouchableOpacity style={styles.btn} onPress={addReview}>
        <Text style={{ color: '#fff' }}>Tambah</Text>
      </TouchableOpacity>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.wisata?.nama}</Text>
            <Text>{'★'.repeat(item.rating)}</Text>
            <Text>{item.nama}</Text>
            <Text>{item.komentar}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    marginVertical: 5,
  },
  wisataBtn: {
    padding: 10,
    borderWidth: 1,
    marginRight: 5,
  },
  active: {
    backgroundColor: '#ddd',
  },
});
