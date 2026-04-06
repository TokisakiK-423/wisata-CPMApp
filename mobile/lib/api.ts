const API_BASE = 'http://10.0.2.2:3000'; // Android emulator

export interface Wisata {
  id: number;
  nama: string;
  deskripsi: string;
  lokasi: string;
  latitude?: number;
  longitude?: number;
  jamBuka?: string;
  hargaTiket?: number;
  totalReview: number;
  rataRataRating: number;
  galeri: Galeri[];
  reviews: Review[];
}

export interface Galeri {
  id: number;
  url: string;
  caption?: string;
}

export interface Review {
  id: number;
  nama: string;
  rating: number;
  komentar: string;
}

const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const token = await (await import('@react-native-async-storage/async-storage')).default.getItem('token');
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const api = {
  getWisata: () => apiFetch('/wisata'),
  getWisataById: (id: number) => apiFetch(`/wisata/${id}`),
  loginAdmin: (username: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
};