import { useEffect, useState } from "react";
import API from "../lib/api";

type Review = {
  id: number;
  rating: number;
  komentar: string;
  createdAt: string;

  user: {
    username: string;
  };

  wisata: {
    nama: string;
  };
};

export default function CustomerReview() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const res = await API.get("/review");
      setReviews(res.data);
    } catch (err) {
      console.log(err);
      alert("Gagal mengambil review");
    }
  };

  return (
    <div>
      <h2>Review Wisata</h2>

      <hr />

      {reviews.length === 0 && <p>Belum ada review</p>}

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h3>{r.wisata?.nama}</h3>

          <p>
            <b>User:</b> {r.user?.username}
          </p>

          <p>
            <b>Rating:</b> ⭐ {r.rating}
          </p>

          <p>
            <b>Komentar:</b> {r.komentar}
          </p>

          <small>
            {new Date(r.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}