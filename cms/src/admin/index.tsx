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
  alamat: string;
  jamBuka: string;
  deskripsi: string;
  hargaTiket: number;
  status: boolean;
  galeri: Galeri[];
};

export default function AdminHome() {
  const [wisata, setWisata] = useState<Wisata[]>([]);

  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const showMessage = (message: string, success = true, time = 2500) => {
    setNotif(message);
    setIsSuccess(success);
    setShowNotif(true);

    setTimeout(() => setShowNotif(false), time);
  };

  // TOGGLE STATUS
  const toggleStatus = async (id: number) => {
    try {
      const res = await API.patch(`/wisata/${id}/status`);

      showMessage(
        res.data.status
          ? "Wisata berhasil diaktifkan"
          : "Wisata berhasil dinonaktifkan"
      );

      fetchData();
    } catch {
      showMessage("Gagal mengubah status wisata", false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await API.delete(`/wisata/${selectedId}`);

      setShowDeleteModal(false);
      showMessage("Data wisata berhasil dihapus", true);
      fetchData();
    } catch (err: any) {
      setShowDeleteModal(false);

      const msg =
        err.response?.data?.message ||
        "Data wisata tidak dapat dihapus karena masih memiliki booking";

      showMessage(msg, false, 3000);
    }
  };

  const buttonStyle = {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold" as const,
    boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
  };

  return (
    <div style={styles.page}>
      {/* NOTIF */}
      {showNotif && (
        <div style={styles.overlay}>
          <div style={styles.notifBox}>
            <div style={{ fontSize: 60 }}>{isSuccess ? "✅" : "❌"}</div>
            <p style={{ fontWeight: 600 }}>{notif}</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>CPMApp</h1>

        <div style={styles.menu}>
          <button onClick={() => navigate("/admin/wisata")} style={buttonStyle}>
            + Tambah Wisata
          </button>

          <button onClick={() => navigate("/admin/booking")} style={buttonStyle}>
            Data Booking
          </button>

          <button onClick={() => navigate("/admin/review")} style={buttonStyle}>
            Data Review
          </button>

          <button
            onClick={logout}
            style={{ ...buttonStyle, background: "#1d4ed8" }}
          >
            Logout
          </button>
        </div>
      </div>

      <h2 style={styles.title}>Dashboard Admin</h2>
      <h3 style={styles.subtitle}>Data Wisata</h3>

      {/* LIST */}
      {wisata.map((w) => {
        const imageUrl =
          w.galeri?.length > 0
            ? `http://localhost:3000${w.galeri[0].url}`
            : null;

        return (
          <div key={w.id} style={styles.card}>
            {imageUrl && (
              <img src={imageUrl} width={240} style={styles.image} />
            )}

            <h4 style={styles.name}>{w.nama}</h4>

            <p><b>Lokasi:</b> {w.lokasi}</p>
            <p><b>Alamat:</b> {w.alamat}</p>
            <p><b>Jam Buka:</b> {w.jamBuka}</p>
            <p><b>Harga:</b> Rp {w.hargaTiket}</p>
            <p><b>Status:</b> {w.status ? "Aktif" : "Nonaktif"}</p>

            <p style={{ color: "#374151" }}>
              <b>Deskripsi:</b> <br />
              {w.deskripsi}
            </p>

            <div style={styles.actions}>
              <button onClick={() => toggleStatus(w.id)} style={buttonStyle}>
                {w.status ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <button
                onClick={() => navigate(`/admin/edit?id=${w.id}`)}
                style={buttonStyle}
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setSelectedId(w.id);
                  setShowDeleteModal(true);
                }}
                style={{ ...buttonStyle, background: "#dc2626" }}
              >
                Hapus
              </button>
            </div>
          </div>
        );
      })}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Hapus Wisata?</h3>
            <p>Data tidak bisa dikembalikan.</p>

            <div style={styles.modalActions}>
              <button onClick={() => setShowDeleteModal(false)}>
                Batal
              </button>

              <button onClick={handleDelete} style={{ background: "#dc2626", color: "#fff" }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: 25,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 30,
  },

  logo: {
    color: "#2563eb",
    fontSize: 34,
    fontWeight: 700,
  },

  menu: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: 700,
  },

  subtitle: {
    fontSize: 28,
    marginBottom: 20,
  },

  card: {
    background: "#fff",
    padding: 22,
    marginBottom: 20,
    borderRadius: 18,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  image: {
    borderRadius: 14,
    marginBottom: 18,
  },

  name: {
    fontSize: 24,
    marginBottom: 15,
  },

  actions: {
    display: "flex",
    gap: 12,
    marginTop: 15,
    flexWrap: "wrap",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  notifBox: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: 20,
    textAlign: "center",
  },

  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    width: 400,
    textAlign: "center",
  },

  modalActions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginTop: 15,
  },
};
