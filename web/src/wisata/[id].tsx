import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";

export default function DetailWisata() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/wisata/" + id).then(res => setData(res.data));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.nama}</h2>
      <p>{data.deskripsi}</p>
      <p>Lokasi: {data.lokasi}</p>
    </div>
  );
}