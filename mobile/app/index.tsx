import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';

export default function HomeScreen() {
  const [wisata, setWisata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/wisata')
      .then(res => res.json())
      .then(data => {
        setWisata(data);
        console.log('Wisata loaded:', data.length);
      })
      .catch(err => console.error('API Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const renderWisata = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.galeri?.[0] 
              ? `http://10.0.2.2:3000${item.galeri[0].url}`
              : 'https://via.placeholder.com/300x200/007AFF/FFFFFF?text=Wisata',
          }}
          style={styles.image}
          defaultSource={{ uri: 'https://via.placeholder.com/300x200/E0E0E0/FFFFFF?text=No+Image' }}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.nama} numberOfLines={1}>
          {item.nama}
        </Text>
        <Text style={styles.lokasi} numberOfLines={1}>
          📍 {item.lokasi}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.rating}>
            ⭐ {item.rataRataRating || 0} ({item.totalReview || 0})
          </Text>
          {item.hargaTiket && (
            <Text style={styles.harga}>Rp {item.hargaTiket.toLocaleString()}</Text>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Memuat wisata...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌊 CPMApp</Text>
        <Text style={styles.subtitle}>Wisata Lampung ({wisata.length})</Text>
      </View>
      
      <FlatList
        data={wisata}
        renderItem={renderWisata}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    padding: 20, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e5e5' 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  list: { padding: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: { height: 180 },
  image: { width: '100%', height: '100%' },
  info: { padding: 16 },
  nama: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  lokasi: { fontSize: 15, color: '#666', marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { fontSize: 16, color: '#FFD700', fontWeight: '600' },
  harga: { fontSize: 16, color: '#28a745', fontWeight: '700' },
  loading: { marginTop: 16, fontSize: 16, color: '#666' },
});