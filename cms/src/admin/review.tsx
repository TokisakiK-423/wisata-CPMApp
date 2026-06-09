import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const res = await API.get("/review");

      // 🔥 supaya data terbaru langsung tampil
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

      // 🔥 refresh otomatis
      fetchReview();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal hapus review");
    }
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold" as const,
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 25,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            margin: 0,
          }}
        >
          Data Review
        </h2>

        <button
          onClick={() => navigate("/admin")}
          style={buttonStyle}
        >
          Kembali
        </button>
      </div>

      {reviews.length === 0 && (
        <p style={{ color: "#6b7280" }}>
          Belum ada review
        </p>
      )}

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            background: "white",
            borderRadius: 18,
            padding: 22,
            marginBottom: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              marginBottom: 15,
              color: "#111827",
            }}
          >
            {r.wisata?.nama}
          </h3>

          <div style={{ marginBottom: 10 }}>
            <strong>User:</strong> {r.user?.username}
          </div>

          <div style={{ marginBottom: 10 }}>
            <strong>Rating:</strong> ⭐ {r.rating}
          </div>

          <div
            style={{
              marginBottom: 15,
              lineHeight: 1.7,
              color: "#374151",
            }}
          >
            <strong>Komentar:</strong>
            <br />
            {r.komentar}
          </div>

          <small
            style={{
              display: "block",
              marginBottom: 18,
              color: "#6b7280",
            }}
          >
            {new Date(r.createdAt).toLocaleString()}
          </small>

          <button
            onClick={() => handleDelete(r.id)}
            style={buttonStyle}
          >
            Hapus Review
          </button>
        </div>
      ))}
    </div>
  );
}
