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
  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== "") {
        formData.append(key, value);
      }
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.post("/wisata", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

      setNotif(
        err.response?.data?.message ||
        "Gagal menambahkan data wisata"
      );

      setShowNotif(true);

      setTimeout(() => {
        setShowNotif(false);
      }, 3000);
    }
  };

  
    return (
      <div>
        {showNotif && (
          <div>
            <div>
              <div>
                {isSuccess ? "✅" : "❌"}
              </div>
              <p>{notif}</p>
            </div>
          </div>
        )}
    
        <h2>Tambah Wisata</h2>
    
        <form onSubmit={handleSubmit}>
          <input
            name="nama"
            placeholder="Nama Wisata"
            onChange={handleChange}
          />
    
          <input
            name="lokasi"
            placeholder="Lokasi"
            onChange={handleChange}
          />
    
          <input
            name="alamat"
            placeholder="Alamat"
            onChange={handleChange}
          />
    
          <input
            name="jamBuka"
            placeholder="Jam Buka"
            onChange={handleChange}
          />
    
          <input
            name="hargaTiket"
            placeholder="Harga Tiket"
            onChange={handleChange}
          />
    
          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            onChange={handleChange}
          />
    
          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files?.[0] || null)
            }
          />
    
          <button type="submit">
            Simpan
          </button>
    
          <button
            type="button"
            onClick={() => navigate("/admin")}
          >
            Kembali
          </button>
        </form>
      </div>
    );
}

