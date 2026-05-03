import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/auth";

type Galeri = {
  id: number;
  url: string;
};

type Wisata = {
  id: number;
  nama: string;
  lokasi: string;
  hargaTiket: number;
  status: boolean;
  galeri: Galeri[];
};

export default function AdminHome() {
  const [wisata, setWisata] = useState<Wisata[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/wisata");
      setWisata(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 TOGGLE STATUS
  const toggleStatus = async (id: number) => {
    try {
      await API.patch(`/wisata/${id}/status`);
      fetchData();
    } catch {
      alert("Gagal update status");
    }
  };

  // 🔥 DELETE
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin hapus wisata?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/wisata/${id}`);
      alert("Berhasil dihapus");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal hapus");
    }
  };

  return (
    <div>
      <h2>Dashboard Admin</h2>

      <button onClick={() => navigate("/admin/wisata")}>
        + Tambah Wisata
      </button>

      <button onClick={() => navigate("/admin/booking")}>
        Data Booking
      </button>

      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Data Wisata</h3>

      {wisata.map((w) => {
        const imageUrl =
          w.galeri?.length > 0
            ? `http://localhost:3000${w.galeri[0].url}`
            : null;

        return (
          <div
            key={w.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
            }}
          >
            {imageUrl && <img src={imageUrl} width="200" />}

            <h4>{w.nama}</h4>
            <p>{w.lokasi}</p>
            <p>Rp {w.hargaTiket}</p>
            <p>Status: {w.status ? "Aktif" : "Nonaktif"}</p>

            {/* 🔥 BUTTON */}
            <button onClick={() => toggleStatus(w.id)}>
              {w.status ? "Nonaktifkan" : "Aktifkan"}
            </button>

            <button
              onClick={() => navigate(`/admin/edit?id=${w.id}`)}
              style={{ marginLeft: 5 }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(w.id)}
              style={{ marginLeft: 5, color: "red" }}
            >
              Hapus
            </button>
          </div>
        );
      })}
    </div>
  );
}