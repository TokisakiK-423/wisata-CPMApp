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
      const res = await API.get("/wisata");
      const aktif = res.data.filter((w: Wisata) => w.status === true);
      setData(aktif);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "#f5f7fb",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 15,
          borderBottom: "2px solid #e5e7eb",
          marginBottom: 20,
        }}
      >
        {/* LOGO */}
       <h1
          style={{
            color: "#2563eb",
            margin: 0,
            fontWeight: "bold",
            fontSize: 30,
          }}
        >
          CPMApp
        </h1>

        {/* MENU BUTTON */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/customer/booking")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
            }}
          >
            Lihat Booking Saya
          </button>

          <button
            onClick={() => navigate("/customer/review")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
            }}
          >
            Lihat Review
          </button>

          <button
            onClick={logout}
            style={{
              background: "#1e40af",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(30,64,175,0.3)",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* TITLE */}
      <h2
        style={{
          marginBottom: 20,
          color: "#111827",
        }}
      >
        Daftar Wisata
      </h2>

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
              padding: 15,
              marginBottom: 15,
              borderRadius: 15,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                width="200"
                style={{
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            )}

            <h3>{w.nama}</h3>
            <p>{w.lokasi}</p>
            <p>Rp {w.hargaTiket}</p>

            <button
              onClick={() => navigate(`/customer/wisata?id=${w.id}`)}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
                marginTop: 10,
              }}
            >
              Booking Sekarang
            </button>
          </div>
        );
      })}
    </div>
  );
}
