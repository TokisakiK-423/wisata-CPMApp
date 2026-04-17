import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';

export default function AdminWisata() {
  const [wisata, setWisata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<any>(null);
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [editId, setEditId] = useState<number | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchWisata(); }, []));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const submitWisata = async () => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => formData.append(k, v as string));

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const url = editId
      ? `http://10.0.2.2:3000/wisata/${editId}`
      : `http://10.0.2.2:3000/wisata`;

    const method = editId ? 'PATCH' : 'POST';

    await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    Alert.alert('Sukses', editId ? 'Data diupdate' : 'Data ditambah');

    setForm({
      nama: '',
      lokasi: '',
      deskripsi: '',
      alamat: '',
      jamBuka: '',
      hargaTiket: '',
    });
    setImage(null);
    setEditId(null);
    setMode('list');
    fetchWisata();
  };

  const deleteWisata = async (id: number) => {
    const token = await AsyncStorage.getItem('token');

    await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchWisata();
  };

  const startEdit = (item: any) => {
    setForm({
      nama: item.nama,
      lokasi: item.lokasi,
      deskripsi: item.deskripsi,
      alamat: item.alamat,
      jamBuka: item.jamBuka,
      hargaTiket: String(item.hargaTiket),
    });
    setEditId(item.id);
    setMode('create');
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  // ================= FORM =================
  if (mode === 'create') {
    return (
      <LinearGradient colors={['#7b2ff7', '#f107a3']} style={styles.container}>
        <Text style={styles.title}>{editId ? 'Edit' : 'Tambah'} Wisata</Text>

        <ScrollView>
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

          {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

          <TouchableOpacity style={styles.btn} onPress={submitWisata}>
            <Text style={styles.btnText}>
              {editId ? 'Update' : 'Simpan'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: 'gray' }]}
            onPress={() => setMode('list')}
          >
            <Text style={styles.btnText}>Kembali</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  // ================= LIST =================
  return (
    <LinearGradient colors={['#7b2ff7', '#f107a3']} style={styles.container}>
      <Text style={styles.title}>Data Wisata</Text>

      <FlatList
        data={wisata}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteWisata(item.id)}
              >
                <Text style={{ color: '#fff' }}>Hapus</Text>
              </TouchableOpacity>
            )}
          >
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

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => startEdit(item)}
                >
                  <Text style={{ color: '#fff' }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Swipeable>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setMode('create')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  imageBtn: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  preview: {
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  btn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  btnText: { color: '#fff' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },

  nama: { fontWeight: 'bold', fontSize: 16 },

  editBtn: {
    backgroundColor: '#7b2ff7',
    padding: 6,
    borderRadius: 6,
    marginTop: 5,
    alignSelf: 'flex-start',
  },

  deleteBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 10,
    borderRadius: 10,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fabText: {
    color: '#fff',
    fontSize: 30,
  },
});
