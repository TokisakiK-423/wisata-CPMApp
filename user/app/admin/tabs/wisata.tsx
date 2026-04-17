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
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
      console.log('ERROR FETCH:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchWisata();
  }, []));

  const deleteWisata = async (id: number) => {
  const token = await AsyncStorage.getItem('token');

  Alert.alert('Konfirmasi', 'Hapus data ini?', [
    { text: 'Batal' },
    {
      text: 'Hapus',
      onPress: async () => {
        const res = await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (!res.ok) {
          Alert.alert('Gagal', result.message);
          return;
        }

        Alert.alert('Sukses', 'Data berhasil dihapus');
        fetchWisata();
      },
    },
  ]);
};

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    renderItem={({ item }) => (
  <TouchableOpacity
    style={[
      styles.card,
      { opacity: item.status ? 1 : 0.5 } // 🔥 kalau nonaktif jadi redup
    ]}
  >
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

      {/* 🔥 jumlah booking */}
      <Text style={{ color: '#666', marginTop: 4 }}>
        📦 {item._count?.bookings || 0} booking
      </Text>

      {/* 🔥 status */}
      <Text style={{
        color: item.status ? 'green' : 'red',
        fontWeight: 'bold'
      }}>
        {item.status ? 'AKTIF' : 'NONAKTIF'}
      </Text>

      {/* 🔥 tombol */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/admin/tabs/edit?id=${item.id}`)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        {item.status ? (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => deleteWisata(item.id)}
          >
            <Text style={styles.btnText}>Nonaktifkan</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ backgroundColor: 'green', padding: 6, borderRadius: 6 }}
            onPress={() => activateWisata(item.id)}
          >
            <Text style={styles.btnText}>Aktifkan</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </TouchableOpacity>
)}
          );
        }}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

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

  nama: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  detail: {
    marginTop: 6,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
  },

  row: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },

  editBtn: {
    backgroundColor: '#7b2ff7',
    padding: 6,
    borderRadius: 6,
  },

  deleteBtn: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 6,
  },

  btnText: {
    color: '#fff',
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
