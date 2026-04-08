import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Wisata = {
  id: number;
  nama: string;
  lokasi: string;
  hargaTiket?: number;
};

export default function AdminWisata() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNama, setNewNama] = useState('');
  const [newLokasi, setNewLokasi] = useState('');

  const fetchWisata = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://10.0.2.2:3000/wisata', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWisata(data);
    } catch {
      setWisata([]);
    } finally {
      setLoading(false);
    }
  };

  const createWisata = async () => {
    if (!newNama || !newLokasi) return;
    
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch('http://10.0.2.2:3000/wisata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: newNama,
          lokasi: newLokasi,
          deskripsi: 'Deskripsi wisata',
          alamat: 'Jl. Contoh',
          jamBuka: '08:00-17:00',
          hargaTiket: 25000,
        }),
      });
      setNewNama('');
      setNewLokasi('');
      fetchWisata();
      Alert.alert('Sukses', 'Wisata ditambahkan');
    } catch {
      Alert.alert('Error', 'Gagal menambah wisata');
    }
  };

  const deleteWisata = async (id: number) => {
    Alert.alert(
      'Hapus Wisata',
      'Yakin hapus wisata ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchWisata();
            } catch {
              Alert.alert('Error', 'Gagal hapus');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchWisata();
  }, []);

  const renderWisata = ({ item }: { item: Wisata }) => (
    <View style={styles.card}>
      <Text style={styles.nama}>{item.nama}</Text>
      <Text style={styles.lokasi}>{item.lokasi}</Text>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteWisata(item.id)}
      >
        <Text style={styles.deleteText}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌊 Kelola Wisata</Text>
      
      {/* Tambah Wisata */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nama Wisata"
          value={newNama}
          onChangeText={setNewNama}
        />
        <TextInput
          style={styles.input}
          placeholder="Lokasi"
          value={newLokasi}
          onChangeText={setNewLokasi}
        />
        <TouchableOpacity style={styles.addBtn} onPress={createWisata}>
          <Text style={styles.addText}>+ Tambah Wisata</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wisata}
        renderItem={renderWisata}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  form: { marginBottom: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
  },
  addBtn: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addText: { color: 'white', fontWeight: '700', fontSize: 16 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  nama: { fontSize: 18, fontWeight: '700' },
  lokasi: { fontSize: 16, color: '#666' },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: { color: 'white', fontWeight: '600' },
});