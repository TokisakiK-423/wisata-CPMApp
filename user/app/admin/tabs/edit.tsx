import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditWisata() {
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    nama: '',
    lokasi: '',
    deskripsi: '',
    alamat: '',
    jamBuka: '',
    hargaTiket: '',
  });

  const isEdit = !!id;

  const fetchDetail = async () => {
    if (!id) return;

    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setForm({
      nama: data.nama,
      lokasi: data.lokasi,
      deskripsi: data.deskripsi,
      alamat: data.alamat,
      jamBuka: data.jamBuka,
      hargaTiket: String(data.hargaTiket),
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({});
    if (!result.canceled) setImage(result.assets[0]);
  };

  const submit = async () => {
  const token = await AsyncStorage.getItem('token');

  let body: any;
  let headers: any = { Authorization: `Bearer ${token}` };

  // 🔥 kalau edit → pakai JSON (lebih stabil)
  if (isEdit) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(form);
  } else {
    // kalau create → tetap FormData (karena upload gambar)
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) =>
      formData.append(k, v as string)
    );

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
    }

    body = formData;
  }

  const url = isEdit
    ? `http://10.0.2.2:3000/wisata/${id}`
    : `http://10.0.2.2:3000/wisata`;

  const method = isEdit ? 'PATCH' : 'POST';

  await fetch(url, {
    method,
    headers,
    body,
  });

  Alert.alert('Sukses', isEdit ? 'Data diupdate' : 'Data ditambah');

  router.back(); // balik → otomatis refetch
};

  return (
    <LinearGradient colors={['#7b2ff7', '#f107a3']} style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Edit' : 'Tambah'} Wisata
      </Text>

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

        <TouchableOpacity style={styles.btn} onPress={pickImage}>
          <Text>Pilih Gambar</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={{ color: '#fff' }}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

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

  btn: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  preview: {
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },

  submit: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
