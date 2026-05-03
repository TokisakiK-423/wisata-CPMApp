import { useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function WisataAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    lokasi: "",
    deskripsi: "",
    alamat: "",
    jamBuka: "",
    hargaTiket: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.post("/wisata", formData);
      alert("Berhasil tambah wisata");
      navigate("/admin");
    } catch {
      alert("Gagal");
    }
  };

  return (
    <div>
      <h2>Tambah Wisata</h2>

      <button onClick={() => navigate("/admin")}>Kembali</button>

      <form onSubmit={handleSubmit}>
        <input name="nama" placeholder="Nama" onChange={handleChange} />
        <input name="lokasi" placeholder="Lokasi" onChange={handleChange} />
        <input name="alamat" placeholder="Alamat" onChange={handleChange} />
        <input name="jamBuka" placeholder="Jam" onChange={handleChange} />
        <input name="hargaTiket" placeholder="Harga" onChange={handleChange} />

        <textarea name="deskripsi" onChange={handleChange} />

        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}