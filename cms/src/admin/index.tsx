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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        padding: 20,
        boxSizing: "border-box",

        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
     {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 15,
          borderBottom: "2px solid rgba(255,255,255,0.3)",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
  {/* LOGO */}
        <h1
          style={{
            color: "#60a5fa",
            margin: 0,
            fontWeight: "bold",
            fontSize: 32,
            textShadow: "0 2px 5px rgba(0,0,0,0.5)",
          }}
        >
          CPMApp
        </h1>

  {/* LOGO */}
        <h1
          style={{
            color: "#60a5fa",
            margin: 0,
            fontWeight: "bold",
            fontSize: 32,
            textShadow: "0 2px 5px rgba(0,0,0,0.5)",
          }}
        >
          CPMApp
        </h1>
