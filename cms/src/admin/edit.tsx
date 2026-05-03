import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function EditWisata() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState({
    nama: "",
    lokasi: "",
    deskripsi: "",
    alamat: "",
    jamBuka: "",
    hargaTiket: "",
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await API.get(`/wisata/${id}`);
      const w = res.data;

      setForm({
        nama: w.nama || "",
        lokasi: w.lokasi || "",
        deskripsi: w.deskripsi || "",
        alamat: w.alamat || "",
        jamBuka: w.jamBuka || "",
        hargaTiket: String(w.hargaTiket || ""),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATE
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.patch(`/wisata/${id}`, formData);
      alert("Berhasil update");
      navigate("/admin");
    } catch {
      alert("Gagal update");
    }
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin hapus wisata ini?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/wisata/${id}`);
      alert("Berhasil dihapus");
      navigate("/admin");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal hapus");
    }
  };

  return (
    <div>
      <h2>Edit Wisata</h2>

      <button onClick={() => navigate("/admin")}>Kembali</button>

      <hr />

      <form onSubmit={handleUpdate}>
        <input
          name="nama"
          placeholder="Nama"
          value={form.nama}
          onChange={handleChange}
        />
        <br />

        <input
          name="lokasi"
          placeholder="Lokasi"
          value={form.lokasi}
          onChange={handleChange}
        />
        <br />

        <input
          name="alamat"
          placeholder="Alamat"
          value={form.alamat}
          onChange={handleChange}
        />
        <br />

        <input
          name="jamBuka"
          placeholder="Jam"
          value={form.jamBuka}
          onChange={handleChange}
        />
        <br />

        <input
          name="hargaTiket"
          placeholder="Harga"
          value={form.hargaTiket}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
        />
        <br />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <br />

        <button type="submit">Update</button>
      </form>

      <hr />

      {/* 🔥 DELETE */}
      <button
        onClick={handleDelete}
        style={{ backgroundColor: "red", color: "white" }}
      >
        Hapus Wisata
      </button>
    </div>
  );
}