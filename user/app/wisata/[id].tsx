import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailWisata() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:3000/wisata/${id}`);
      const json = await res.json();

      console.log('DETAIL:', json);

      if (!json) throw new Error('Data kosong');

      setData(json);
    } catch (e) {
      console.log('ERROR DETAIL:', e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      await fetch('http://10.0.2.2:3000/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wisataId: data.id,
          nama: 'Customer',
          noHp: '08123456789',
          jumlahTiket: 1,
        }),
      });

      alert('Booking berhasil');
    } catch {
      alert('Booking gagal');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  if (!data) {
    return (
      <SafeAreaView>
        <Text>Gagal memuat data wisata</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        {data.nama}
      </Text>

      <Text>{data.lokasi}</Text>
      <Text>{data.deskripsi}</Text>

      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          padding: 12,
          marginTop: 20,
        }}
        onPress={handleBooking}
      >
        <Text style={{ color: '#fff' }}>Booking</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
