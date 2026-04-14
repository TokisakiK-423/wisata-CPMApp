import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles, COLORS } from "@/app/lib/customer/styles";
import {
  deleteReview,
  fetchReviewData,
  submitReview,
} from "@/app/lib/customer/utils/review";

export default function CustomerReview() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [wisataList, setWisataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<number | null>(null);

  const [image, setImage] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);

  const [form, setForm] = useState({
    wisataId: 0,
    rating: 5,
    komentar: "",
  });

  const insets = useSafeAreaInsets();

  //  LOAD USER + DATA
  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id ? Number(id) : null);

      await loadData();
    };

    init();
  }, []);

  //  FETCH
  const loadData = async () => {
    setLoading(true);
    const { reviews, wisata } = await fetchReviewData();
    setReviews(reviews);
    setWisataList(wisata);
    setLoading(false);
  };

  //  IMAGE PICKER
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!res.canceled) setImage(res.assets[0]);
  };

  //  SUBMIT
  const handleSubmit = async () => {
    if (!form.wisataId) {
      Alert.alert("Error", "Pilih wisata dulu");
      return;
    }

    const ok = await submitReview(form, image);

    if (!ok) {
      Alert.alert("Error", "Gagal kirim");
      return;
    }

    Alert.alert("Sukses", "Review dikirim");

    setForm({ wisataId: 0, rating: 5, komentar: "" });
    setImage(null);

    loadData();
  };

  //  DELETE
  const handleDelete = (id: number) => {
    Alert.alert("Hapus", "Yakin hapus review?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          await deleteReview(id);
          loadData();
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.secondary]}
      style={[styles.reviewContainer, { paddingTop: insets.top + 60 }]}
    >
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.reviewContent}
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>📝 Review Wisata</Text>

              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  collapsed ? styles.toggleOpen : styles.toggleClose,
                ]}
                onPress={() => setCollapsed(!collapsed)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    collapsed ? styles.toggleTextOpen : styles.toggleTextClose,
                  ]}
                >
                  {collapsed ? "Buka" : "Tutup"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORM */}
            {!collapsed && (
              <View style={styles.formBox}>
                <FlatList
                  horizontal
                  data={wisataList}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.wisataCard,
                        form.wisataId === item.id && styles.wisataActive,
                      ]}
                      onPress={() => setForm({ ...form, wisataId: item.id })}
                    >
                      <Image
                        source={{
                          uri: item.galeri?.[0]?.url
                            ? `http://10.0.2.2:3000${item.galeri[0].url}`
                            : "https://via.placeholder.com/150",
                        }}
                        style={styles.wisataImage}
                      />
                      <Text style={styles.wisataName} numberOfLines={2}>
                        {item.nama}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                <TextInput
                  placeholder="Tulis komentar..."
                  style={styles.input}
                  value={form.komentar}
                  onChangeText={(t) => setForm({ ...form, komentar: t })}
                />

                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setForm({ ...form, rating: r })}
                    >
                      <Text
                        style={
                          r <= form.rating ? styles.starActive : styles.star
                        }
                      >
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                  <Text>Pilih Gambar</Text>
                </TouchableOpacity>

                {image && (
                  <Image source={{ uri: image.uri }} style={styles.preview} />
                )}

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                >
                  <Text style={{ color: "#fff" }}>Kirim</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitleCard}>
              {item.wisata?.nama}
            </Text>

            <Text style={styles.ratingText}>
              {"★".repeat(item.rating)}
            </Text>

            <Text style={styles.reviewName}>{item.nama}</Text>

            <Text style={styles.reviewComment}>
              {item.komentar}
            </Text>

            {item.image && (
              <Image
                source={{
                  uri: `http://10.0.2.2:3000${item.image}`,
                }}
                style={styles.reviewImage}
              />
            )}

            {/*  HANYA MILIK SENDIRI */}
            {userId === item.customerId && (
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: "#fff" }}>Hapus</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </LinearGradient>
  );
}
