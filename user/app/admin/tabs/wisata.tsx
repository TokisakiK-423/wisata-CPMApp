import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WisataAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch('http://10.0.2.2:3000/wisata', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Gagal ambil data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const deleteWisata = async (id: number) => {
    const token = await AsyncStorage.getItem('token');

    Alert.alert('Konfirmasi', 'Yakin mau hapus?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: async () => {
          await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          fetchData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                setExpandedId(isExpanded ? null : item.id)
              }
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

                {isExpanded && (
                  <View style={styles.detail}>
                    <Text>📍 {item.alamat}</Text>
                    <Text>🕒 {item.jamBuka}</Text>
                    <Text>📝 {item.deskripsi}</Text>
                  </View>
                )}

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      router.push(`/admin/tabs/edit?id=${item.id}`)
                    }
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
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/admin/tabs/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f3e5f5',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  nama: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detail: {
    marginTop: 8,
    backgroundColor: '#fce4ec',
    padding: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editBtn: {
    backgroundColor: '#8e24aa',
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  deleteBtn: {
    backgroundColor: '#e53935',
    padding: 6,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#d81b60',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
  },
});
