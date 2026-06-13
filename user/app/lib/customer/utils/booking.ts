import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiUrl } from "@/app/lib/api";

// 🔥 FETCH BOOKING
export const fetchMyBookings = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) return [];

    const res = await fetch(apiUrl("/booking/my"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// 🔥 DELETE BOOKING
export const deleteBooking = async (id: number) => {
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(apiUrl(`/booking/${id}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal hapus booking");
  }

  return true;
};

// 🔥 STATUS COLOR
export const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "#22c55e";
    case "pending":
      return "#facc15";
    default:
      return "#9ca3af";
  }
};

// 🔥 FORMAT STATUS
export const formatStatus = (status: string) => {
  switch (status) {
    case "approved":
      return "DISETUJUI";
    case "pending":
      return "MENUNGGU";
    default:
      return status.toUpperCase();
  }
};