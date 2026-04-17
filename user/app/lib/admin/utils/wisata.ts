import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.2.2:3000";

const getHeaders = async (isJson = false) => {
  const token = await AsyncStorage.getItem("token");

  return {
    ...(isJson && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };
};

//  GET ALL
export const getWisata = async () => {
  const res = await fetch(`${BASE_URL}/wisata`, {
    headers: await getHeaders(),
  });

  return res.json();
};

// DELETE
export const deleteWisata = async (id: number) => {
  const res = await fetch(`${BASE_URL}/wisata/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Gagal hapus data");
  }

  return data;
};

// STATUS
export const toggleWisataStatus = async (id: number, current: boolean) => {
  const res = await fetch(`${BASE_URL}/wisata/${id}/status`, {
    method: "PATCH",
    headers: await getHeaders(true),
    body: JSON.stringify({ status: !current }),
  });

  return res.json();
};