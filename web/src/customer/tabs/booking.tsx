import { useEffect, useState } from "react";
import api from "../../services/api";

export default function BookingCustomer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/booking/my").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Booking Saya</h2>

      {data.map(b => (
        <div key={b.id}>
          {b.nama} - {b.wisata?.nama}
        </div>
      ))}
    </div>
  );
}