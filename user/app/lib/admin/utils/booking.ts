import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiUrl } from '@/app/lib/api';

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const fetchBookingsAPI = async () => {
  try {
    const token = await getToken();

    const res = await fetch(apiUrl('/booking'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (e) {
    console.log('FETCH ERROR:', e);
    return [];
  }
};

export const updateBookingStatusAPI = async (id: number, status: string) => {
  try {
    const token = await getToken();

    await fetch(apiUrl(`/booking/${id}`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  } catch (e) {
    console.log('UPDATE ERROR:', e);
  }
};

export const deleteBookingAPI = (id: number, callback: () => void) => {
  Alert.alert('Hapus', 'Yakin hapus booking ini?', [
    { text: 'Batal' },
    {
      text: 'Hapus',
      onPress: async () => {
        try {
          const token = await getToken();

          await fetch(apiUrl(`/booking/${id}`), {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          callback();
        } catch (e) {
          console.log('DELETE ERROR:', e);
        }
      },
    },
  ]);
};