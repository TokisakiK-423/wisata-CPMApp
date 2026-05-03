import { useEffect, useState } from "react";
import API from "../lib/api";
import { useNavigate } from "react-router-dom";

type Booking = {
  id: number;
  nama: string;
  status: string;
  noHp: string;
  jumlahTiket: number;
  wisata: { nama: string };
  customer: { nama: string };
};

export default function BookingAdmin() {
  const [data, setData] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/booking");
    setData(res.data);
  };

  const updateStatus = async (id: number, status: string) => {
    await API.patch(`/booking/${id}`, { status });
    fetchData();
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Yakin hapus?")) return;
    await API.delete(`/booking/${id}`);
    fetchData();
  };

  return (
    <div>
      <h2>Data Booking</h2>

      <button onClick={() => navigate("/admin")}>Kembali</button>

      {data.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <b>{b.nama}</b>
          <div>{b.noHp}</div>
          <div>{b.jumlahTiket} tiket</div>
          <div>Wisata: {b.wisata?.nama}</div>
          <div>Customer: {b.customer?.nama}</div>
          <div>Status: {b.status}</div>

          <button onClick={() => updateStatus(b.id, "pending")}>
            Pending
          </button>
          <button onClick={() => updateStatus(b.id, "confirmed")}>
            Confirm
          </button>
          <button onClick={() => updateStatus(b.id, "cancelled")}>
            Cancel
          </button>

          <button onClick={() => deleteBooking(b.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}