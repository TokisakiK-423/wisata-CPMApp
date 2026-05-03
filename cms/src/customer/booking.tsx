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
    <div>
      <h2>Booking Saya</h2>

      <button onClick={() => navigate("/customer")}>Kembali</button>

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