import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function BookingCustomer() {
  const [data, setData] = useState([]);
  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/booking/my");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/booking/${id}`);

      setIsSuccess(true);
      setNotif("Booking berhasil dihapus");
      setShowNotif(true);

      fetchData();

      setTimeout(() => {
        setShowNotif(false);
      }, 2000);
    } catch (err) {
      setIsSuccess(false);
      setNotif(err.response?.data?.message || "Gagal menghapus booking");
      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
      }, 3000);
    }
  };

  return (
    <div style={styles.page}>
      {/* NOTIFIKASI */}
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
        <h1 style={styles.logo}>CPMApp</h1>
      </div>

      {/* TITLE */}
      <h2 style={styles.title}>Booking Saya</h2>

      {/* LIST BOOKING */}
      {data.map((b) => (
        <div key={b.id} style={styles.card}>
          <b style={styles.name}>{b.nama}</b>

          <div style={styles.text}>{b.wisata?.nama}</div>
          <div style={styles.text}>{b.jumlahTiket} tiket</div>

          <div>
            Status:{" "}
            <span style={getStatusStyle(b.status)}>
              {b.status}
            </span>
          </div>

          {b.status === "pending" && (
            <button
              onClick={() => handleDelete(b.id)}
              style={styles.deleteBtn}
            >
              Hapus
            </button>
          )}
        </div>
      ))}

      {/* BACK BUTTON */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/customer")}
          style={styles.backBtn}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background: "#f5f7fb",
  },

  header: {
    paddingBottom: 15,
    borderBottom: "2px solid #e5e7eb",
    marginBottom: 20,
  },

  logo: {
    color: "#2563eb",
    margin: 0,
    fontWeight: "bold",
    fontSize: 30,
  },

  title: {
    marginBottom: 20,
    color: "#111827",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },

  name: {
    fontSize: 18,
  },

  text: {
    color: "#374151",
    marginBottom: 8,
  },

  deleteBtn: {
    marginTop: 15,
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
  },

  backBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
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
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    textAlign: "center",
    minWidth: "320px",
  },

  icon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  notifText: {
    fontSize: "17px",
    fontWeight: "600",
    margin: 0,
    color: "#111827",
  },
};

/* ================= STATUS STYLE ================= */
const getStatusStyle = (status) => ({
  fontWeight: "bold",
  color:
    status === "approved"
      ? "green"
      : status === "rejected"
      ? "red"
      : "orange",
});
