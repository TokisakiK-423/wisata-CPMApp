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

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s",
    boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    marginTop: "6px",
    boxSizing: "border-box" as const,
    backgroundColor: "#f9fafb",
  };

  const labelStyle = {
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "16px",
    backgroundColor: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

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
    <div style={containerStyle}>
      <h2>Edit Wisata</h2>

      <hr />

      <form onSubmit={handleUpdate}>
        <div>
          <label style={labelStyle}>Nama Wisata</label>
          <input
            name="nama"
            placeholder="Masukkan nama wisata"
            value={form.nama}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <br />

        <div>
          <label style={labelStyle}>Lokasi</label>
          <input
            name="lokasi"
            placeholder="Masukkan lokasi"
            value={form.lokasi}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <br />

        <div>
          <label style={labelStyle}>Alamat</label>
          <input
            name="alamat"
            placeholder="Masukkan alamat"
            value={form.alamat}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <br />

        <div>
          <label style={labelStyle}>Jam Buka</label>
          <input
            name="jamBuka"
            placeholder="Contoh: 08:00 - 17:00"
            value={form.jamBuka}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <br />

        <div>
          <label style={labelStyle}>Harga Tiket</label>
          <input
            name="hargaTiket"
            placeholder="Masukkan harga tiket"
            value={form.hargaTiket}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <br />

        <div>
          <label style={labelStyle}>Deskripsi</label>
          <textarea
            name="deskripsi"
            placeholder="Masukkan deskripsi wisata"
            value={form.deskripsi}
            onChange={handleChange}
            rows={5}
            style={inputStyle}
          />
        </div>

        <br />

        <div>
          <label style={labelStyle}>Upload Gambar</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            style={{ marginTop: "10px" }}
          />
        </div>

        <hr />

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <button type="submit" style={buttonStyle}>
            Update
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={buttonStyle}
          >
            Hapus Wisata
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            style={buttonStyle}
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
