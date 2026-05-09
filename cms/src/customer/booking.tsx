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
      fetchData(); // refresh
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
          marginBottom: 10,
        }}
      >
        CPMApp
      </h1>

      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        alt="Waterfall"
        style={{
          width: 220,
          height: 90,
          objectFit: "cover",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      />
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
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
    marginBottom: 15,
  }}
>
  Kembali
</button>

      <hr />

      {data.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <b>{b.nama}</b>
          <br />
          {b.wisata?.nama}
          <br />
          {b.jumlahTiket} tiket
          <br />

          Status:{" "}
          <span
            style={{
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

          {/* 🔥 TOMBOL HAPUS HANYA JIKA PENDING */}
          {b.status === "pending" && (
            <button
              onClick={() => handleDelete(b.id)}
              style={{
                marginTop: 5,
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Hapus
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
