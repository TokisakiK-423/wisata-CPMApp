import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminWisata() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWisata = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/wisata', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWisata(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchWisata(); }, []));

  const deleteWisata = async (id: number) => {
    const token = await AsyncStorage.getItem('token');

    Alert.alert('Konfirmasi', 'Hapus data ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: async () => {
          await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchWisata();
        }
      }
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <LinearGradient colors={['#7b2ff7', '#f107a3']} style={styles.container}>
      <Text style={styles.title}>Data Wisata</Text>

      <FlatList
        data={wisata}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.galeri?.[0]?.url
                  ? `http://10.0.2.2:3000${item.galeri[0].url}`
                  : 'https://via.placeholder.com/150',
              }}
              style={styles.cardImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.nama}>{item.nama}</Text>
              <Text>{item.lokasi}</Text>
              <Text>Rp {item.hargaTiket}</Text>

              {/* 🔥 ACTION BUTTON */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push(`/admin/tabs/edit?id=${item.id}`)}
                >
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteWisata(item.id)}
                >
                  <Text style={styles.btnText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/admin/tabs/edit')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
