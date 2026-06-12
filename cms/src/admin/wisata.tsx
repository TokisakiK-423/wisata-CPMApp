import { useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

type FormState = {
  nama: string;
  lokasi: string;
  deskripsi: string;
  alamat: string;
  jamBuka: string;
  hargaTiket: string;
};

export default function WisataAdmin() {
  const navigate = useNavigate();

  // STATE
  const [form, setForm] = useState<FormState>({
    nama: "",
    lokasi: "",
    deskripsi: "",
    alamat: "",
    jamBuka: "",
    hargaTiket: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  // STYLE
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

  // HANDLER
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== "") formData.append(key, value);
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.post("/wisata", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSuccess(true);
      setNotif("Data wisata berhasil ditambahkan");
      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
        navigate("/admin");
      }, 2000);
    } catch (err: any) {
      setIsSuccess(false);
      setNotif(err.response?.data?.message || "Gagal menambahkan data wisata");
      setShowNotif(true);

      setTimeout(() => setShowNotif(false), 3000);
    }
  };

  return (
    <div style={containerStyle}>
      {/* NOTIF */}
      {showNotif && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              textAlign: "center",
              minWidth: "320px",
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "15px" }}>
              {isSuccess ? "✅" : "❌"}
            </div>

            <p
              style={{
                color: isSuccess ? "#16a34a" : "#dc2626",
                fontSize: "17px",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {notif}
            </p>
          </div>
        </div>
      )}

      <h2>Tambah Wisata</h2>
      <hr />

      <form onSubmit={handleSubmit}>
        {[
          { name: "nama", label: "Nama Wisata", placeholder: "Masukkan nama wisata" },
          { name: "lokasi", label: "Lokasi", placeholder: "Masukkan lokasi" },
          { name: "alamat", label: "Alamat", placeholder: "Masukkan alamat" },
          { name: "jamBuka", label: "Jam Buka", placeholder: "08:00 - 17:00" },
          { name: "hargaTiket", label: "Harga Tiket", placeholder: "Masukkan harga tiket" },
        ].map((field) => (
          <div key={field.name}>
            <label style={labelStyle}>{field.label}</label>
            <input
              name={field.name}
              placeholder={field.placeholder}
              value={(form as any)[field.name]}
              onChange={handleChange}
              style={inputStyle}
            />
            <br />
            <br />
          </div>
        ))}

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
          <br />
          <br />
        </div>

        <div>
          <label style={labelStyle}>Upload Gambar</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            style={{ marginTop: "10px" }}
          />
        </div>

        <hr />

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button type="submit" style={buttonStyle}>
            Simpan
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
