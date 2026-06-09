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
    id: number;
    nama: string;
  };
};

type Wisata = {
  id: number;
  nama: string;
};

export default function CustomerReview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wisataList, setWisataList] = useState<Wisata[]>([]);

  // 🔥 FORM REVIEW
  const [wisataId, setWisataId] = useState<number>(0);
  const [rating, setRating] = useState<number>(5);
  const [komentar, setKomentar] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchReview();
    fetchWisata();
  }, []);

  // 🔥 AMBIL REVIEW
  const fetchReview = async () => {
    try {
      const res = await API.get("/review");

      setReviews(res.data);
    } catch (err) {
      console.log(err);
      alert("Gagal mengambil review");
    }
  };

  // 🔥 AMBIL DATA WISATA
  const fetchWisata = async () => {
    try {
      const res = await API.get("/wisata");

      setWisataList(res.data);

      // otomatis pilih wisata pertama
      if (res.data.length > 0) {
        setWisataId(res.data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 SUBMIT REVIEW
  const submitReview = async () => {
    try {
      await API.post("/review", {
        wisataId,
        rating,
        komentar,
      });

      alert("Review berhasil dikirim");

      // reset form
      setKomentar("");
      setRating(5);

      // refresh review
      fetchReview();
    } catch (err) {
      console.log(err);
      alert("Gagal kirim review");
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

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
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
          Review Wisata
        </h2>

        <button
          onClick={() => navigate("/customer")}
          style={buttonStyle}
        >
          Kembali
        </button>
      </div>

      {/* FORM REVIEW */}
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 25,
          marginBottom: 30,
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h3
          style={{
            marginBottom: 20,
            color: "#111827",
          }}
        >
          Tulis Review
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* PILIH WISATA */}
          <select
            value={wisataId}
            onChange={(e) =>
              setWisataId(Number(e.target.value))
            }
            style={inputStyle}
          >
            {wisataList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.nama}
              </option>
            ))}
          </select>

          {/* RATING */}
          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
            style={inputStyle}
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          {/* KOMENTAR */}
          <textarea
            placeholder="Tulis komentar..."
            value={komentar}
            onChange={(e) =>
              setKomentar(e.target.value)
            }
            style={{
              ...inputStyle,
              minHeight: 120,
              resize: "none",
            }}
          />

          <button
            onClick={submitReview}
            style={buttonStyle}
          >
            Kirim Review
          </button>
        </div>
      </div>

      {/* LIST REVIEW */}
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
              color: "#6b7280",
            }}
          >
            {new Date(r.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
