import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

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

  const fetchWisata = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch('http://10.0.2.2:3000/wisata', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setWisata(data);
    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const createWisata = async () => {
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
  };

  const deleteWisata = async (id: number) => {
    const token = await AsyncStorage.getItem('token');

    await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchWisata();
  };

  useEffect(() => {
    fetchWisata();
  }, []);

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

        {/* PICK IMAGE */}
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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.galeri?.[0]
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },

  form: { marginVertical: 10, gap: 8 },

  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  imageBtn: {
    backgroundColor: '#ddd',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },

  preview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
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
    marginVertical: 8,
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

  delete: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 6,
  },
});
