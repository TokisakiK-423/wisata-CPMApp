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

export default function AdminHome() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/wisata");
      setWisata(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 TOGGLE STATUS
  const toggleStatus = async (id: number) => {
    try {
      await API.patch(`/wisata/${id}/status`);
      fetchData();
    } catch {
      alert("Gagal update status");
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin hapus wisata?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/wisata/${id}`);
      alert("Berhasil dihapus");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal hapus");
    }
  };

  return (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      overflowY: "auto",

      padding: 20,
      boxSizing: "border-box",

      backgroundImage:
        "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",

      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
      {/* HEADER */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottom: "2px solid rgba(255,255,255,0.3)",
    marginBottom: 20,
  }}
>
  {/* LOGO */}
  <h1
    style={{
      color: "#60a5fa",
      margin: 0,
      fontWeight: "bold",
      fontSize: 32,
      textShadow: "0 2px 5px rgba(0,0,0,0.5)",
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
      onClick={() => navigate("/admin/wisata")}
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
      + Tambah Wisata
    </button>

    <button
      onClick={() => navigate("/admin/booking")}
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
      Data Booking
    </button>

    <button
      onClick={() => navigate("/admin/review")}
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
      Data Review
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
    color: "white",
    marginBottom: 20,
    textShadow: "0 2px 5px rgba(0,0,0,0.5)",
  }}
>
  Dashboard Admin
</h2>
        <button
          onClick={() => navigate("/admin/wisata")}
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
          + Tambah Wisata
        </button>

        <button
          onClick={() => navigate("/admin/booking")}
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
          Data Booking
        </button>

        <button
          onClick={() => navigate("/admin/review")}
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
          Data Review
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

      <hr />

      <h3
        style={{
          color: "white",
          textShadow: "0 2px 5px rgba(0,0,0,0.5)",
        }}
      >
        Data Wisata
      </h3>

      {wisata.map((w) => {
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
  color: "black",
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

            <h4>{w.nama}</h4>
            <p>{w.lokasi}</p>
            <p>Rp {w.hargaTiket}</p>
            <p>Status: {w.status ? "Aktif" : "Nonaktif"}</p>

            {/* 🔥 BUTTON */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => toggleStatus(w.id)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
                }}
              >
                {w.status ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <button
                onClick={() => navigate(`/admin/edit?id=${w.id}`)}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(w.id)}
                style={{
                  background: "#1d4ed8",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(29,78,216,0.3)",
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
