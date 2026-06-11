import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function BookingAdmin() {
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
      const res = await API.get("/booking");
      setData(res.data);
    } catch (err) {
      console.log(err);
      alert("Gagal mengambil data booking");
    }
  };

  const showMessage = (message, success = true, time = 2000) => {
    setIsSuccess(success);
    setNotif(message);
    setShowNotif(true);

    setTimeout(() => {
      setShowNotif(false);
    }, time);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/booking/${id}`, { status });

      const messageMap = {
        PENDING: "Booking berhasil diubah menjadi Pending",
        CONFIRM: "Booking berhasil dikonfirmasi",
        CANCEL: "Booking berhasil dibatalkan",
      };

      showMessage(messageMap[status] || "Status berhasil diubah", true);
      fetchData();
    } catch (err) {
      console.log(err);
      showMessage("Gagal mengubah status booking", false);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await API.delete(`/booking/${id}`);

      showMessage("Booking berhasil dihapus", true);
      fetchData();
    } catch (err) {
      console.log(err);
      showMessage("Gagal menghapus booking", false);
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
        <h2 style={styles.title}>Data Booking</h2>

        <button
          onClick={() => navigate("/admin")}
          style={buttonStyle}
        >
          Kembali
        </button>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <p style={styles.empty}>
          Belum ada data booking
        </p>
      )}

      {/* LIST */}
      {data.map((b) => (
        <div key={b.id} style={styles.card}>
          <h3 style={styles.name}>{b.nama}</h3>

          <div style={styles.text}>
            <b>No HP:</b> {b.noHp}
          </div>

          <div style={styles.text}>
            <b>Jumlah Tiket:</b> {b.jumlahTiket}
          </div>

          <div style={styles.text}>
            <b>Wisata:</b> {b.wisata?.nama}
          </div>

          <div style={styles.text}>
            <b>Customer:</b> {b.customer?.nama}
          </div>

          <div style={styles.text}>
            <b>Status:</b> {b.status}
          </div>

          {/* ACTION BUTTONS */}
          <div style={styles.buttonGroup}>
            <button
              onClick={() => updateStatus(b.id, "PENDING")}
              style={{ ...buttonStyle, background: "#f59e0b" }}
            >
              Pending
            </button>

            <button
              onClick={() => updateStatus(b.id, "CONFIRM")}
              style={{ ...buttonStyle, background: "#16a34a" }}
            >
              Confirm
            </button>

            <button
              onClick={() => updateStatus(b.id, "CANCEL")}
              style={{ ...buttonStyle, background: "#dc2626" }}
            >
              Cancel
            </button>

            <button
              onClick={() => deleteBooking(b.id)}
              style={{ ...buttonStyle, background: "#1d4ed8" }}
            >
              Hapus
            </button>
          </div>
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
    marginBottom: 35,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    margin: 0,
    color: "#111827",
  },

  card: {
    background: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  name: {
    marginBottom: 14,
    fontSize: 22,
    color: "#111827",
  },

  text: {
    marginBottom: 8,
    color: "#374151",
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 10,
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

  empty: {
    color: "#6b7280",
    fontSize: 16,
  },
};
