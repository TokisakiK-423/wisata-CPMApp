import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

export default function CustomerHome() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/wisata");

      // hanya wisata aktif
      const aktif = res.data.filter((w) => w.status === true);
      setData(aktif);
    } catch (err) {
      console.log(err);
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
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>CPMApp</h1>

        <div style={styles.menu}>
          <button
            onClick={() => navigate("/customer/booking")}
            style={buttonStyle}
          >
            Lihat Booking Saya
          </button>

          <button
            onClick={() => navigate("/customer/review")}
            style={buttonStyle}
          >
            Lihat Review
          </button>

          <button
            onClick={logout}
            style={{ ...buttonStyle, background: "#1d4ed8" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* TITLE */}
      <h2 style={styles.title}>Daftar Wisata</h2>

      {/* LIST WISATA */}
      {data.map((w) => {
        const imageUrl = w.galeri?.length
          ? `http://localhost:3000${w.galeri[0].url}`
          : null;

        return (
          <div key={w.id} style={styles.card}>
            {/* IMAGE */}
            {imageUrl && (
              <img
                src={imageUrl}
                width="240"
                style={styles.image}
                alt={w.nama}
              />
            )}

            <h3 style={styles.nama}>{w.nama}</h3>

            <div style={styles.text}><b>Lokasi:</b> {w.lokasi}</div>
            <div style={styles.text}><b>Alamat:</b> {w.alamat}</div>
            <div style={styles.text}><b>Jam Buka:</b> {w.jamBuka}</div>
            <div style={styles.text}><b>Harga Tiket:</b> Rp {w.hargaTiket}</div>

            <div style={styles.desc}>
              <b>Deskripsi:</b>
              <br />
              {w.deskripsi}
            </div>

            <button
              onClick={() => navigate(`/customer/wisata?id=${w.id}`)}
              style={buttonStyle}
            >
              Booking Sekarang
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    minHeight: "100vh",
    padding: 25,
    background: "#f5f7fb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    borderBottom: "1px solid #dbeafe",
    marginBottom: 30,
    flexWrap: "wrap",
    gap: 15,
  },

  logo: {
    color: "#2563eb",
    margin: 0,
    fontWeight: "700",
    fontSize: 34,
  },

  menu: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  title: {
    color: "#111827",
    marginBottom: 35,
    fontWeight: "700",
    fontSize: 32,
    textAlign: "center",
  },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    padding: 22,
    marginBottom: 20,
    borderRadius: 18,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  image: {
    borderRadius: 14,
    marginBottom: 18,
    objectFit: "cover",
  },

  nama: {
    fontSize: 24,
    marginBottom: 18,
    color: "#111827",
  },

  text: {
    marginBottom: 10,
    color: "#374151",
  },

  desc: {
    marginTop: 14,
    marginBottom: 18,
    lineHeight: 1.7,
    color: "#374151",
  },
};
