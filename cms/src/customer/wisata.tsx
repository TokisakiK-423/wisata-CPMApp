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
    <div>
      <h2>Form Booking</h2>

      <button onClick={() => navigate("/customer")}>Kembali</button>

      <hr />

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
        <br />

        <input
          placeholder="No HP"
          value={form.noHp}
          onChange={(e) => setForm({ ...form, noHp: e.target.value })}
        />
        <br />

        <input
          type="number"
          value={form.jumlahTiket}
          onChange={(e) =>
            setForm({ ...form, jumlahTiket: Number(e.target.value) })
          }
        />
        <br />

        <button type="submit">Booking</button>
      </form>
    </div>
  );
}