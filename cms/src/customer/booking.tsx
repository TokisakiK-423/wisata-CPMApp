import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

type Booking = {
  id: number;
  nama: string;
  jumlahTiket: number;
  status: string;
  wisata: { nama: string };
};

export default function BookingCustomer() {
  const [data, setData] = useState<Booking[]>([]);
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

  // 🔥 DELETE BOOKING
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus booking ini?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/booking/${id}`);
      alert("Booking berhasil dihapus");
      fetchData();
    } catch (err) {
      console.log(err);
      alert("Gagal menghapus booking");
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
          paddingBottom: 15,
          borderBottom: "2px solid #e5e7eb",
          marginBottom: 20,
        }}
      >
        {/* LOGO */}
        <div>
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
        </div>
      </div>

      {/* TITLE */}
      <h2
        style={{
          marginBottom: 20,
          color: "#111827",
        }}
      >
        Booking Saya
      </h2>

      {data.map((b) => (
        <div
          key={b.id}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            padding: 15,
            marginBottom: 15,
            borderRadius: 15,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <b style={{ fontSize: 18 }}>{b.nama}</b>

          <br />
          <br />

          <span style={{ color: "#374151" }}>
            {b.wisata?.nama}
          </span>

          <br />
          <br />

          <span style={{ color: "#374151" }}>
            {b.jumlahTiket} tiket
          </span>

          <br />
          <br />

          Status:{" "}
          <span
            style={{
              fontWeight: "bold",
              color:
                b.status === "approved"
                  ? "green"
                  : b.status === "rejected"
                  ? "red"
                  : "orange",
            }}
          >
            {b.status}
          </span>

          <br />

          {/* 🔥 TOMBOL HAPUS */}
          {b.status === "pending" && (
            <button
              onClick={() => handleDelete(b.id)}
              style={{
                marginTop: 15,
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
              Hapus
            </button>
          )}
        </div>
      ))}

      {/* BUTTON KEMBALI */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/customer")}
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
          Kembali
        </button>
      </div>
    </div>
  );
}
