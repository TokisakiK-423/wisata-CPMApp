import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReviewCustomer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/review").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Review</h2>

      {data.map(r => (
        <div key={r.id}>
          {r.nama} - {r.komentar}
        </div>
      ))}
    </div>
  );
}