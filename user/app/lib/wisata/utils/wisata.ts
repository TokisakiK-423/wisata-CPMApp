import { apiUrl } from '@/app/lib/api';

export const fetchWisataDetail = async (id: string | number) => {
  try {
    const res = await fetch(apiUrl(`/wisata/${id}`));
    if (!res.ok) throw new Error("Gagal ambil data");

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("FETCH DETAIL ERROR:", err);
    return null;
  }
};