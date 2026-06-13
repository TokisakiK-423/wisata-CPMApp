import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '@/app/lib/api';

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const fetchReviewsAPI = async () => {
  try {
    const token = await getToken();

    const res = await fetch(apiUrl('/review'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (e) {
    console.log('FETCH REVIEW ERROR:', e);
    return [];
  }
};

export const renderStars = (rating: number) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};