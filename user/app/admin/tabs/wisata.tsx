import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Wisata = {
  id: number;
  nama: string;
  lokasi: string;
  deskripsi: string;
  alamat: string;
  jamBuka: string;
  hargaTiket?: number;
};

export default function AdminWisata() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);

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
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/wisata', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWisata(Array.isArray(data) ? data : []);
    } catch {
      setWisata([]);
    } finally {
      setLoading(false);
    }
  };

  const createWisata = async () => {
    if (!form.nama || !form.lokasi) {
      Alert.alert('Error', 'Nama & lokasi wajib');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await fetch('http://10.0.2.2:3000/wisata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          hargaTiket: Number(form.hargaTiket) || 0,
        }),
      });

      setForm({
        nama: '',
        lokasi: '',
        deskripsi: '',
        alamat: '',
        jamBuka: '',
        hargaTiket: '',
      });

      fetchWisata();
    } catch {
      Alert.alert('Error', 'Gagal tambah');
    }
  };

  const deleteWisata = async (id: number) => {
    Alert.alert('Hapus', 'Yakin?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');

          await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          fetchWisata();
        },
      },
    ]);
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
            <View>
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
  btn: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: { color: '#fff' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    marginVertical: 5,
  },
  nama: { fontWeight: 'bold' },
  delete: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 6,
  },
});
