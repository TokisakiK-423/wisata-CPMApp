import { useEffect, useState } from "react";
import api from "../../services/api";

export default function WisataAdmin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/wisata").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Data Wisata</h2>

      {data.map(w => (
        <div key={w.id}>
          {w.nama} - {w.lokasi}
        </div>
      ))}
    </div>
  );
}