import { useState } from "react";
import API from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function WisataCustomer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const wisataId = searchParams.get("id");

  const [form, setForm] = useState({
    nama: "",
    noHp: "",
    jumlahTiket: 1,
  });

  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wisataId) {
      setIsSuccess(false);
      setNotif("Wisata tidak valid");
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 2000);
      return;
    }

    try {
      const check = await API.get(`/wisata/${wisataId}`);

      if (!check.data.status) {
        setIsSuccess(false);
        setNotif("Wisata tidak tersedia");
        setShowNotif(true);
        setTimeout(() => setShowNotif(false), 2000);
        return;
      }

      await API.post("/booking", {
        wisataId: Number(wisataId),
        nama: form.nama,
        noHp: form.noHp,
        jumlahTiket: Number(form.jumlahTiket),
      });

      setIsSuccess(true);
      setNotif("Booking berhasil dibuat");
      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
        navigate("/customer/booking");
      }, 2000);
    } catch (err) {
      setIsSuccess(false);
      setNotif(err.response?.data?.message || "Gagal melakukan booking");
      setShowNotif(true);

      setTimeout(() => setShowNotif(false), 3000);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
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
        <h1 style={styles.logo}>CPMApp</h1>
      </div>

      {/* TITLE */}
      <h2 style={styles.title}>Form Booking</h2>

      {/* FORM */}
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nama"
            value={form.nama}
            onChange={(e) =>
              setForm({ ...form, nama: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="No HP"
            value={form.noHp}
            onChange={(e) =>
              setForm({ ...form, noHp: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="number"
            value={form.jumlahTiket}
            onChange={(e) =>
              setForm({
                ...form,
                jumlahTiket: Number(e.target.value),
              })
            }
            style={inputStyle}
          />

          <div style={styles.buttonGroup}>
            <button type="submit" style={buttonStyle}>
              Booking
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer")}
              style={{
                ...buttonStyle,
                background: "#1e40af",
              }}
            >
              Kembali
            </button>
          </div>
        </form>
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
    padding: 25,
    borderRadius: 15,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    maxWidth: 450,
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
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
    color: "#111827",
    fontSize: 17,
    fontWeight: "600",
    margin: 0,
  },
};
