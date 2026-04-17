import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';

export default function AdminWisata() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<any>(null);
  const [showForm, setShowForm] = useState(true); // 🔥 toggle form

  const [form, setForm] = useState({
    nama: '',
    lokasi: '',
    deskripsi: '',
    alamat: '',
    jamBuka: '',
    hargaTiket: '',
  });

  const fetchWisata = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/wisata', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWisata(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setWisata([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWisata();
    }, [])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

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

      await fetch('http://10.0.2.2:3000/wisata', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      Alert.alert('Sukses', 'Wisata ditambahkan');

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
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER + TOGGLE */}
      <TouchableOpacity onPress={() => setShowForm(!showForm)}>
        <Text style={styles.title}>
          {showForm ? '▼ Kelola Wisata' : '▶ Kelola Wisata'}
        </Text>
      </TouchableOpacity>

      {/* FORM (SCROLLABLE + COLLAPSIBLE) */}
      {showForm && (
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      )}

      {/* LIST */}
      <FlatList
        data={wisata}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
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
          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  form: {
    maxHeight: 300, // 🔥 batasi tinggi biar bisa scroll
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  imageBtn: {
    backgroundColor: '#ddd',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },

  preview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },

  btnText: { color: '#fff' },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 12,
    gap: 10,
    alignItems: 'center',
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  nama: { fontWeight: 'bold', fontSize: 16 },
});
