import { useEffect, useState } from "react";
import api from "../../services/api";

export default function WisataCustomer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/wisata").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Wisata</h2>

      {data.map(w => (
        <div key={w.id}>
          <a href={`/wisata/${w.id}`}>
            {w.nama}
          </a>
        </div>
      ))}
    </div>
  );
}