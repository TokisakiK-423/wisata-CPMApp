import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

type Booking = {
  id: number;
  nama: string;
  status: string;
  noHp: string;
  jumlahTiket: number;
  wisata: { nama: string };
  customer: { nama: string };
};

export default function BookingAdmin() {
  const [data, setData] = useState<Booking[]>([]);
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

  const updateStatus = async (id: number, status: string) => {
    try {
      await API.patch(`/booking/${id}`, { status });
      fetchData();
    } catch {
      alert("Gagal update status");
    }
  };

  const deleteBooking = async (id: number) => {
    const confirmDelete = confirm("Yakin hapus booking?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/booking/${id}`);
      fetchData();
    } catch {
      alert("Gagal hapus booking");
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
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: 25,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 35,
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            margin: 0,
          }}
        >
          Data Booking
        </h2>

        <button
          onClick={() => navigate("/admin")}
          style={buttonStyle}
        >
          Kembali
        </button>
      </div>

      {data.length === 0 && (
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          Belum ada data booking
        </p>
      )}

      {data.map((b) => (
        <div
          key={b.id}
          style={{
            background: "white",
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              marginBottom: 14,
              color: "#111827",
              fontSize: "22px",
            }}
          >
            {b.nama}
          </h3>

          <div style={{ marginBottom: 8 }}>
            <strong>No HP:</strong> {b.noHp}
          </div>

          <div style={{ marginBottom: 8 }}>
            <strong>Jumlah Tiket:</strong>{" "}
            {b.jumlahTiket} tiket
          </div>

          <div style={{ marginBottom: 8 }}>
            <strong>Wisata:</strong>{" "}
            {b.wisata?.nama}
          </div>

          <div style={{ marginBottom: 8 }}>
            <strong>Customer:</strong>{" "}
            {b.customer?.nama}
          </div>

          <div
            style={{
              marginBottom: 18,
            }}
          >
            <strong>Status:</strong> {b.status}
          </div>

          {/* BUTTON */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => updateStatus(b.id, "pending")}
              style={buttonStyle}
            >
              Pending
            </button>

            <button
              onClick={() => updateStatus(b.id, "confirmed")}
              style={buttonStyle}
            >
              Confirm
            </button>

            <button
              onClick={() => updateStatus(b.id, "cancelled")}
              style={buttonStyle}
            >
              Cancel
            </button>

            <button
              onClick={() => deleteBooking(b.id)}
              style={{
                ...buttonStyle,
                background: "#1d4ed8",
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
