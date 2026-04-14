import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://10.0.2.2:3000";

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Login gagal");
  }

  if (!data.token) {
    throw new Error("Token tidak diterima");
  }

  // 🔥 simpan token & role
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("role", data.role);

  // 🔥 decode token (AMAN)
  try {
    const decoded: any = jwtDecode(data.token);

    console.log("DECODED:", decoded);

    if (decoded?.id) {
      await AsyncStorage.setItem("userId", String(decoded.id));
    } else {
      console.log("❌ ID tidak ada di token");
    }
  } catch (err) {
    console.log("❌ Decode error:", err);
  }

  return data.role;
};

// 🔥 REGISTER
export const registerUser = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      role: "customer", // default
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Register gagal");
  }

  return data;
};
