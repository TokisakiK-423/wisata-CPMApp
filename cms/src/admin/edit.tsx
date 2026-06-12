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

  const [image, setImage] = useState(null);

  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showMessage = (message, success = true, time = 2000) => {
    setIsSuccess(success);
    setNotif(message);
    setShowNotif(true);

    setTimeout(() => setShowNotif(false), time);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) {
        formData.append("image", image);
      }

      await API.patch(`/wisata/${id}`, formData);

      showMessage("Data wisata berhasil diperbarui", true);
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      console.log(err);
      showMessage("Gagal memperbarui data wisata", false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/wisata/${id}`);

      setShowDeleteModal(false);
      showMessage("Data wisata berhasil dihapus", true);

      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.log(err);

      setShowDeleteModal(false);

      const msg = err.response?.data?.message;
      const finalMsg =
        msg?.toLowerCase().includes("booking")
          ? "Wisata tidak dapat dihapus karena masih memiliki booking"
          : "Data wisata gagal dihapus";

      showMessage(finalMsg, false, 3000);
    }
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    marginTop: "6px",
    boxSizing: "border-box",
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

  return (
    <div style={containerStyle}>
      <h2>Edit Wisata</h2>

      {/* NOTIF */}
      {showNotif && (
        <div style={styles.overlay}>
          <div style={styles.notifBox}>
            <div style={styles.icon}>
              {isSuccess ? "✅" : "❌"}
            </div>
            <p style={styles.notifText}>{notif}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <label style={labelStyle}>Nama Wisata</label>
        <input name="nama" value={form.nama} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Lokasi</label>
        <input name="lokasi" value={form.lokasi} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Alamat</label>
        <input name="alamat" value={form.alamat} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Jam Buka</label>
        <input name="jamBuka" value={form.jamBuka} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Harga Tiket</label>
        <input name="hargaTiket" value={form.hargaTiket} onChange={handleChange} style={inputStyle} />

        <label style={labelStyle}>Deskripsi</label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          rows={5}
          style={inputStyle}
        />

        <label style={labelStyle}>Upload Gambar</label>
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button type="submit" style={buttonStyle}>
            Update
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{ ...buttonStyle, backgroundColor: "#dc2626" }}
          >
            Hapus
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div style={styles.overlay}>
          <div style={styles.modalBox}>
            <h3>Hapus Wisata?</h3>
            <p>Data tidak dapat dikembalikan.</p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button onClick={handleDelete} style={{ background: "#dc2626", color: "#fff" }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  notifBox: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: 20,
    textAlign: "center",
  },

  icon: {
    fontSize: 60,
    marginBottom: 10,
  },

  notifText: {
    fontWeight: 600,
  },

  modalBox: {
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    textAlign: "center",
    width: 400,
  },
};
