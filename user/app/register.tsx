import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { styles, COLORS } from "@/app/lib/auth/style";
import { registerUser } from "@/app/lib/auth/utils/auth";

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirm) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Password tidak sama");
      return;
    }

    setLoading(true);

    try {
      await registerUser(username, password);

      Alert.alert("Sukses", "Akun berhasil dibuat", [
        {
          text: "Login",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (e: any) {
      Alert.alert("Register gagal", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <Text style={styles.title}>📝 Register</Text>
      <Text style={styles.subtitle}>
        Buat akun baru untuk mulai
      </Text>

      <View style={styles.formBox}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Konfirmasi Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        {/* 🔥 KEMBALI KE LOGIN */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.secondaryText}>
            Sudah punya akun? Login
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}