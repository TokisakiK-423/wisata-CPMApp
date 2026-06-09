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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        padding: 25,
        boxSizing: "border-box",
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
            onClick={() => navigate("/admin/wisata")}
            style={buttonStyle}
          >
            + Tambah Wisata
          </button>

          <button
            onClick={() => navigate("/admin/booking")}
            style={buttonStyle}
          >
            Data Booking
          </button>

          <button
            onClick={() => navigate("/admin/review")}
            style={buttonStyle}
          >
            Data Review
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
        Dashboard Admin
      </h2>

      {/* DATA */}
      <h3
        style={{
          color: "#111827",
          marginBottom: 25,
          fontWeight: "700",
          fontSize: "28px",
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
              padding: 22,
              marginBottom: 20,
              borderRadius: 18,
              color: "black",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            }}
          >
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

            <h4
              style={{
                fontSize: "24px",
                marginBottom: "18px",
                color: "#111827",
              }}
            >
              {w.nama}
            </h4>

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

            <div style={{ marginBottom: "10px" }}>
              <strong>Status:</strong>{" "}
              {w.status ? "Aktif" : "Nonaktif"}
            </div>

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
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 15,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => toggleStatus(w.id)}
                style={buttonStyle}
              >
                {w.status ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <button
                onClick={() => navigate(`/admin/edit?id=${w.id}`)}
                style={buttonStyle}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(w.id)}
                style={{
                  ...buttonStyle,
                  background: "#1d4ed8",
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
