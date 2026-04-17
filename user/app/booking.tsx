import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { styles, COLORS } from "@/app/lib/wisata/style";

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const u = JSON.parse(user);
        setNama(u.username || "");
      }
    };
    loadUser();
  }, []);

  const tambah = () => {
    setJumlah((prev) => prev + 1);
  };

  const kurang = () => {
    if (jumlah > 1) {
      setJumlah((prev) => prev - 1);
    }
  };

  const submit = async () => {
    if (!nama || !noHp || !jumlah) {
      Alert.alert("Error", "Lengkapi data");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "Harus login dulu");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://10.0.2.2:3000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wisataId: Number(id),
          nama,
          noHp,
          jumlahTiket: jumlah,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      Alert.alert("Sukses", "Booking berhasil", [
        {
          text: "Lihat Booking",
          onPress: () => router.replace("/customer/tabs/booking"),
        },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={{ flex: 1, padding: 20 }}
    >
      <Text style={{ color: "#fff", fontSize: 22, marginBottom: 20 }}>
        Form Booking
      </Text>

      {/* NAMA */}
      <TextInput
        placeholder="Nama"
        value={nama}
        onChangeText={setNama}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      />

      {/* NO HP */}
      <TextInput
        placeholder="No HP"
        value={noHp}
        onChangeText={setNoHp}
        keyboardType="phone-pad"
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      {/* JUMLAH TIKET BUTTON */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <Text style={{ marginBottom: 10, fontWeight: "600" }}>
          Jumlah Tiket
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* KURANG */}
          <TouchableOpacity
            onPress={kurang}
            style={{
              backgroundColor: "#eee",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Ionicons name="remove" size={20} />
          </TouchableOpacity>

          {/* ANGKA */}
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {jumlah}
          </Text>

          {/* TAMBAH */}
          <TouchableOpacity
            onPress={tambah}
            style={{
              backgroundColor: "#eee",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Ionicons name="add" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        onPress={submit}
        style={{
          backgroundColor: "#0ae79a",
          padding: 15,
          borderRadius: 12,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            Booking Sekarang
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}