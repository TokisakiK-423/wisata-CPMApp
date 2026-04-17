import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "@/app/lib/admin/styles";
import {
  fetchWisataDetailAPI,
  submitWisataAPI,
} from "@/app/lib/admin/utils/edit";

export default function EditWisata() {
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    nama: "",
    lokasi: "",
    deskripsi: "",
    alamat: "",
    jamBuka: "",
    hargaTiket: "",
  });

  const insets = useSafeAreaInsets();
  const isEdit = !!id;

  const fetchDetail = async () => {
    if (!id) return;

    const data = await fetchWisataDetailAPI(id);

    if (!data) return;

    setForm({
      nama: data.nama || "",
      lokasi: data.lokasi || "",
      deskripsi: data.deskripsi || "",
      alamat: data.alamat || "",
      jamBuka: data.jamBuka || "",
      hargaTiket: String(data.hargaTiket || ""),
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({});
    if (!result.canceled) setImage(result.assets[0]);
  };

  const submit = async () => {
    try {
      await submitWisataAPI(form, image, id);

      Alert.alert("Sukses", isEdit ? "Data diupdate" : "Data ditambah");

      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <LinearGradient
      colors={["#7b2ff7", "#f107a3"]}
      style={[styles.editContainer, { paddingTop: insets.top + 70 }]}
    >
      <Text style={styles.editTitle}>{isEdit ? "Edit" : "Tambah"} Wisata</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(form).map((key) => (
          <TextInput
            key={key}
            style={styles.editInput}
            placeholder={key}
            value={(form as any)[key]}
            onChangeText={(text) => setForm({ ...form, [key]: text })}
          />
        ))}

        <TouchableOpacity style={styles.editBtn1} onPress={pickImage}>
          <Text style={{ color: "#fff" }}>Pilih Gambar</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.editPreview} />
        )}

        <TouchableOpacity style={styles.editSubmit} onPress={submit}>
          <Text style={{ color: "#fff" }}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
