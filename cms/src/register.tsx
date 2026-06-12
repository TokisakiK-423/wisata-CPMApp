import { useState } from "react";
import API from "./lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    nama: "",
  });

  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const submit = async () => {
    try {
      const res = await API.post("/auth/register", form);
      console.log("REGISTER SUCCESS:", res.data);

      setIsSuccess(true);
      setNotif("Registrasi berhasil");
      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
        nav("/login");
      }, 2000);
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);

      setIsSuccess(false);
      setNotif(err.response?.data?.message || "Registrasi gagal");
      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={styles.page}>
      {/* NOTIFIKASI */}
      {showNotif && (
        <div style={styles.overlay}>
          <div style={styles.notifBox}>
            <div
              style={{
                ...styles.iconCircle,
                background: isSuccess ? "#22c55e" : "#ef4444",
              }}
            >
              {isSuccess ? "✓" : "✕"}
            </div>

            <p
              style={{
                ...styles.notifText,
                color: isSuccess ? "#16a34a" : "#dc2626",
              }}
            >
              {notif}
            </p>
          </div>
        </div>
      )}

      {/* FORM */}
      <div style={styles.card}>
        <h2 style={styles.title}>Register CPMApp</h2>

        <input
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={submit} style={styles.btnSuccess}>
          Register
        </button>

        <button onClick={() => nav("/login")} style={styles.btnPrimary}>
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
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

  iconCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 20px",
    fontSize: "45px",
    fontWeight: "bold",
  },

  notifText: {
    fontSize: "17px",
    fontWeight: "600",
    margin: 0,
  },

  card: {
    width: 350,
    background: "white",
    padding: 30,
    borderRadius: 15,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: 25,
    color: "#2563eb",
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },

  btnSuccess: {
    width: "100%",
    padding: 12,
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 10,
  },

  btnPrimary: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
  },
};
