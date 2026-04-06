import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthStorage = {
  setToken: async (token: string) => {
    await AsyncStorage.setItem('token', token);
  },
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },
  removeToken: async () => {
    await AsyncStorage.removeItem('token');
  },
};