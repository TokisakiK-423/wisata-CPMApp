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

export default function ReviewAdmin() {
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
      alert("Gagal mengambil data review");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin hapus review?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/review/${id}`);
      alert("Review berhasil dihapus");
      fetchReview();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal hapus review");
    }
  };

  return (
    <div>
      <h2>Data Review</h2>

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
          <h4>{r.wisata?.nama}</h4>

          <p>
            <b>User:</b> {r.user?.username}
          </p>

          <p>
            <b>Rating:</b> ⭐ {r.rating}
          </p>

          <p>
            <b>Komentar:</b> {r.komentar}
          </p>

          <p>
            <small>
              {new Date(r.createdAt).toLocaleString()}
            </small>
          </p>

          <button
            onClick={() => handleDelete(r.id)}
            style={{ color: "red" }}
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}