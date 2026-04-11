import { useEffect, useState } from "react";
import api from "../../services/api";

export default function BookingAdmin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/booking").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Semua Booking</h2>

      {data.map(b => (
        <div key={b.id}>
          {b.nama} - {b.wisata?.nama}
        </div>
      ))}
    </div>
  );
}