import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:3000';

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const fetchReviewsAPI = async () => {
  try {
    const token = await getToken();

    const res = await fetch(`${BASE_URL}/review`, {
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