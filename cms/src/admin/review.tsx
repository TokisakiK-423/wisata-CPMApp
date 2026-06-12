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
      setReviews(res.data);
    } catch (err) {
      console.log(err);
      alert("Gagal mengambil data review");
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
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Data Review</h2>

        <button onClick={() => navigate("/admin")} style={buttonStyle}>
          Kembali
        </button>
      </div>

      {/* EMPTY STATE */}
      {reviews.length === 0 && (
        <p style={styles.empty}>Belum ada review</p>
      )}

      {/* LIST */}
      {reviews.map((r) => (
        <div key={r.id} style={styles.card}>
          <h3 style={styles.wisata}>{r.wisata?.nama}</h3>

          <p>
            <b>User:</b> {r.user?.username}
          </p>

          <p>
            <b>Rating:</b> ⭐ {r.rating}
          </p>

          <p style={styles.komentar}>
            <b>Komentar:</b>
            <br />
            {r.komentar}
          </p>

          <small style={styles.date}>
            {new Date(r.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: 25,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },

  empty: {
    color: "#6b7280",
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  wisata: {
    marginBottom: 15,
    color: "#111827",
  },

  komentar: {
    marginBottom: 15,
    lineHeight: 1.7,
    color: "#374151",
  },

  date: {
    color: "#6b7280",
  },
};
