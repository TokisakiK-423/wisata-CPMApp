import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditWisata() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    nama: '',
    lokasi: '',
    alamat: '',
    hargaTiket: '',
    jamBuka: '',
    deskripsi: '',
  });

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(
      `http://10.0.2.2:3000/wisata/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const json = await res.json();

    setForm({
      nama: json.nama || '',
      lokasi: json.lokasi || '',
      alamat: json.alamat || '',
      hargaTiket: String(json.hargaTiket || ''),
      jamBuka: json.jamBuka || '',
      deskripsi: json.deskripsi || '',
    });
  };

  const submit = async () => {
    const token = await AsyncStorage.getItem('token');

    await fetch(`http://10.0.2.2:3000/wisata/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    Alert.alert('Sukses', 'Data berhasil diupdate');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Wisata</Text>

      {Object.keys(form).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key}
          value={(form as any)[key]}
          onChangeText={(val) =>
            setForm({ ...form, [key]: val })
          }
        />
      ))}

      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3e5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#8e24aa',
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
});
