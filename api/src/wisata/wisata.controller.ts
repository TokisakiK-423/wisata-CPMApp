import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';

type Wisata = {
  id: number;
  nama: string;
  lokasi: string;
  hargaTiket?: number;
  galeri?: { url: string }[];
};

export default function AdminWisata() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    nama: '',
    lokasi: '',
    deskripsi: '',
    alamat: '',
    jamBuka: '',
    hargaTiket: '',
  });

  // ✅ FETCH FIX TOTAL
  const fetchWisata = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/wisata', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text(); // debug aman
      const data = text ? JSON.parse(text) : [];

      console.log('WISATA API:', data);

      if (!res.ok) {
        throw new Error(data?.message || 'Gagal fetch');
      }

      setWisata(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.log('ERROR FETCH:', err.message);
      Alert.alert('Error', err.message);
      setWisata([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REFRESH SAAT BALIK SCREEN
  useFocusEffect(
    useCallback(() => {
      fetchWisata();
    }, [])
  );

  // ✅ IMAGE PICK
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // ✅ CREATE FIX TOTAL
  const createWisata = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const res = await fetch('http://10.0.2.2:3000/wisata', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log('CREATE:', data);

      if (!res.ok) {
        throw new Error(data?.message || 'Gagal tambah');
      }

      Alert.alert('Sukses', 'Wisata berhasil ditambahkan');

      setForm({
        nama: '',
        lokasi: '',
        deskripsi: '',
        alamat: '',
        jamBuka: '',
        hargaTiket: '',
      });

      setImage(null);

      fetchWisata();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const deleteWisata = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');

      await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchWisata();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kelola Wisata</Text>

      {/* FORM */}
      <View style={styles.form}>
        {Object.keys(form).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={key}
            value={(form as any)[key]}
            onChangeText={(text) =>
              setForm({ ...form, [key]: text })
            }
          />
        ))}

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text>Pilih Gambar</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.preview} />
        )}

        <TouchableOpacity style={styles.btn} onPress={createWisata}>
          <Text style={styles.btnText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={wisata}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Data kosong
          </Text>
        }
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
            </View>

            <TouchableOpacity
              style={styles.delete}
              onPress={() => deleteWisata(item.id)}
            >
              <Text style={{ color: '#fff' }}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
