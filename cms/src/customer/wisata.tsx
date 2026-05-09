import { useState } from "react";
import API from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function WisataCustomer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const wisataId = searchParams.get("id");

  const [form, setForm] = useState({
    nama: "",
    noHp: "",
    jumlahTiket: 1,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!wisataId) {
      alert("Wisata tidak valid");
      return;
    }

    try {
      const check = await API.get(`/wisata/${wisataId}`);

      if (!check.data.status) {
        alert("Wisata tidak tersedia");
        return;
      }

     await API.post("/booking", {
        wisataId: Number(wisataId),
        nama: form.nama,
        noHp: form.noHp,
        jumlahTiket: Number(form.jumlahTiket),
      });

      alert("Booking berhasil");
      navigate("/customer/booking");
    } catch {
      alert("Gagal booking");
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

      {/* TITLE */}
      <h2
        style={{
          marginBottom: 20,
          color: "#111827",
        }}
      >
        Form Booking
      </h2>

      {/* FORM CARD */}
      <div
        style={{
          background: "white",
          padding: 25,
          borderRadius: 15,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: 450,
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />

          <input
            placeholder="No HP"
            value={form.noHp}
            onChange={(e) => setForm({ ...form, noHp: e.target.value })}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 15,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />

          <input
            type="number"
            value={form.jumlahTiket}
            onChange={(e) =>
              setForm({
                ...form,
                jumlahTiket: Number(e.target.value),
              })
            }
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 14,
            }}
          />

          {/* BUTTON */}
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              type="submit"
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
              Booking
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer")}
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
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
