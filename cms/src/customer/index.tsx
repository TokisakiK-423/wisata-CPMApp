import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

type Galeri = {
  id: number;
  url: string;
};

type Wisata = {
  id: number;
  nama: string;
  lokasi: string;
  alamat: string;
  jamBuka: string;
  deskripsi: string;
  hargaTiket: number;
  status: boolean;
  galeri: Galeri[];
};

export default function CustomerHome() {
  const [data, setData] = useState<Wisata[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 🔥 Ambil data terbaru dari admin
      const res = await API.get("/wisata");

      // 🔥 Hanya tampilkan wisata aktif
      const aktif = res.data.filter(
        (w: Wisata) => w.status === true
      );

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
    fontWeight: "bold" as const,
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
    transition: "0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 25,
        background: "#f5f7fb",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 20,
          borderBottom: "1px solid #dbeafe",
          marginBottom: 30,
          flexWrap: "wrap",
          gap: 15,
        }}
      >
        {/* LOGO */}
        <h1
          style={{
            color: "#2563eb",
            margin: 0,
            fontWeight: "700",
            fontSize: 34,
          }}
        >
          CPMApp
        </h1>

        {/* MENU BUTTON */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
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
            style={{
              ...buttonStyle,
              background: "#1d4ed8",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* TITLE */}
      <h2
        style={{
          color: "#111827",
          marginBottom: 35,
          fontWeight: "700",
          fontSize: "32px",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        Daftar Wisata
      </h2>

      {/* DATA WISATA */}
      {data.map((w) => {
        const imageUrl =
          w.galeri?.length > 0
            ? `http://localhost:3000${w.galeri[0].url}`
            : null;

        return (
          <div
            key={w.id}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              padding: 22,
              marginBottom: 20,
              borderRadius: 18,
              color: "black",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* IMAGE */}
            {imageUrl && (
              <img
                src={imageUrl}
                width="240"
                style={{
                  borderRadius: 14,
                  marginBottom: 18,
                  objectFit: "cover",
                }}
              />
            )}

            {/* NAMA */}
            <h3
              style={{
                fontSize: "24px",
                marginBottom: "18px",
                color: "#111827",
              }}
            >
              {w.nama}
            </h3>

            {/* DETAIL */}
            <div style={{ marginBottom: "10px" }}>
              <strong>Lokasi:</strong> {w.lokasi}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <strong>Alamat:</strong> {w.alamat}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <strong>Jam Buka:</strong> {w.jamBuka}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <strong>Harga Tiket:</strong> Rp {w.hargaTiket}
            </div>

            {/* DESKRIPSI */}
            <div
              style={{
                marginTop: "14px",
                marginBottom: "18px",
                lineHeight: "1.7",
                color: "#374151",
              }}
            >
              <strong>Deskripsi:</strong>
              <br />
              {w.deskripsi}
            </div>

            {/* BUTTON */}
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
