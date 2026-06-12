import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function CustomerReview() {
  const [reviews, setReviews] = useState([]);
  const [wisataList, setWisataList] = useState([]);

  const [wisataId, setWisataId] = useState(0);
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");

  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReview();
    fetchWisata();
  }, []);

  const fetchReview = async () => {
    try {
      const res = await API.get("/review");
      setReviews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWisata = async () => {
    try {
      const res = await API.get("/wisata");
      setWisataList(res.data);

      if (res.data.length > 0) {
        setWisataId(res.data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async () => {
    try {
      await API.post("/review", {
        wisataId,
        rating,
        komentar,
      });

      setIsSuccess(true);
      setNotif("Review berhasil ditambahkan");
      setShowNotif(true);

      setKomentar("");
      setRating(5);

      fetchReview();

      setTimeout(() => setShowNotif(false), 2000);
    } catch (err) {
      setIsSuccess(false);
      setNotif(err.response?.data?.message || "Gagal menambahkan review");
      setShowNotif(true);

      setTimeout(() => setShowNotif(false), 3000);
    }
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={styles.page}>
      {/* NOTIF */}
      {showNotif && (
        <div style={styles.overlay}>
          <div style={styles.notifBox}>
            <div style={styles.icon}>
              {isSuccess ? "✅" : "❌"}
            </div>
            <p style={styles.notifText}>{notif}</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Review Wisata</h2>

        <button
          onClick={() => navigate("/customer")}
          style={buttonStyle}
        >
          Kembali
        </button>
      </div>

      {/* FORM */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Tulis Review</h3>

        <div style={styles.form}>
          <select
            value={wisataId}
            onChange={(e) => setWisataId(Number(e.target.value))}
            style={inputStyle}
          >
            {wisataList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.nama}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={inputStyle}
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <textarea
            placeholder="Tulis komentar..."
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            style={{ ...inputStyle, minHeight: 120, resize: "none" }}
          />

          <button onClick={submitReview} style={buttonStyle}>
            Kirim Review
          </button>
        </div>
      </div>

      {/* LIST REVIEW */}
      {reviews.length === 0 && (
        <p style={styles.empty}>Belum ada review</p>
      )}

      {reviews.map((r) => (
        <div key={r.id} style={styles.reviewCard}>
          <h3 style={styles.wisataName}>{r.wisata?.nama}</h3>

          <div style={styles.text}>
            <b>User:</b> {r.user?.username}
          </div>

          <div style={styles.text}>
            <b>Rating:</b> ⭐ {r.rating}
          </div>

          <div style={styles.comment}>
            <b>Komentar:</b>
            <br />
            {r.komentar}
          </div>

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
    fontWeight: "700",
    margin: 0,
    color: "#111827",
  },

  card: {
    background: "white",
    borderRadius: 18,
    padding: 25,
    marginBottom: 30,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    marginBottom: 20,
    color: "#111827",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  reviewCard: {
    background: "white",
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  wisataName: {
    marginBottom: 15,
    color: "#111827",
  },

  text: {
    marginBottom: 10,
    color: "#374151",
  },

  comment: {
    marginBottom: 15,
    lineHeight: 1.7,
    color: "#374151",
  },

  date: {
    color: "#6b7280",
  },

  empty: {
    color: "#6b7280",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.15)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  notifBox: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: 20,
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    textAlign: "center",
    minWidth: 320,
  },

  icon: {
    fontSize: 60,
    marginBottom: 15,
  },

  notifText: {
    fontSize: 17,
    fontWeight: "600",
    margin: 0,
  },
};
