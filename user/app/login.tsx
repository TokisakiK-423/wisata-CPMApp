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
import { loginUser } from "@/app/lib/auth/utils/auth";

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username & password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const role = await loginUser(username, password);

      // routing bersih
      if (role === "admin") {
        router.replace("/admin/tabs");
      } else {
        router.replace("/customer/tabs");
      }
    } catch (e: any) {
      Alert.alert("Login gagal", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={styles.container}
    >
      <Text style={styles.title}>🌊 CPMApp</Text>
      <Text style={styles.subtitle}>Wisata Curup Putri Malu</Text>

      <View style={styles.formBox}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.replace("/register")}
      >
        <Text style={styles.secondaryText}>Belum punya akun? register</Text>
      </TouchableOpacity>
      </View>
      
    </LinearGradient>
  );
}
