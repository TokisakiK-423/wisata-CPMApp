import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.0.2.2:3000";

export const fetchReviewData = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const [r1, r2] = await Promise.all([
      fetch(`${BASE_URL}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/wisata`),
    ]);

    const reviews = await r1.json();
    const wisata = await r2.json();

    return {
      reviews: Array.isArray(reviews) ? reviews : [],
      wisata: Array.isArray(wisata) ? wisata : [],
    };
  } catch {
    return { reviews: [], wisata: [] };
  }
};

export const submitReview = async (form: any, image: any) => {
  const token = await AsyncStorage.getItem("token");

  const formData = new FormData();
  formData.append("wisataId", String(form.wisataId));
  formData.append("rating", String(form.rating));
  formData.append("komentar", form.komentar);

  if (image) {
    formData.append("image", {
      uri: image.uri,
      name: "review.jpg",
      type: "image/jpeg",
    } as any);
  }

  const res = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
};

export const deleteReview = async (id: number) => {
  const token = await AsyncStorage.getItem("token");

  await fetch(`${BASE_URL}/review/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};