import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

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

export default function CustomerHome() {
  const [data, setData] = useState<Wisata[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/wisata");
      const aktif = res.data.filter((w: Wisata) => w.status === true);
      setData(aktif);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Daftar Wisata</h1>

      <button onClick={() => navigate("/customer/booking")}>
        Lihat Booking Saya
      </button>

      <hr />

      {data.map((w) => {
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

            <h3>{w.nama}</h3>
            <p>{w.lokasi}</p>
            <p>Rp {w.hargaTiket}</p>

            <button
              onClick={() => navigate(`/customer/wisata?id=${w.id}`)}
            >
              Booking Sekarang
            </button>
          </div>
        );
      })}
    </div>
  );
}