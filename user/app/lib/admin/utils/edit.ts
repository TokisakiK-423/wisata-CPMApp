import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '@/app/lib/api';

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const fetchWisataDetailAPI = async (id: any) => {
  try {
    const token = await getToken();

    const res = await fetch(apiUrl(`/wisata/${id}`), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return await res.json();
  } catch (e) {
    console.log('FETCH DETAIL ERROR:', e);
    return null;
  }
};

export const submitWisataAPI = async (
  form: any,
  image: any,
  id?: any
) => {
  try {
    const token = await getToken();

    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      formData.append(k, v as string);
    });

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
    }

    const isEdit = !!id;

    const url = isEdit
      ? apiUrl(`/wisata/${id}`)
      : apiUrl('/wisata');

    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal simpan data');
    }

    return data;
  } catch (e) {
    console.log('SUBMIT ERROR:', e);
    throw e; 
  }
};