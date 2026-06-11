import { useState } from "react";
import API from "./lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [notif, setNotif] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const [form, setForm] = useState({
    username: "",
    password: "",
    nama: "",
  });

  const submit = async () => {
    try {
      const res = await API.post("/auth/register", form);
  
      console.log("REGISTER SUCCESS:", res.data);
  
      setIsSuccess(true);
      setNotif("Registrasi berhasil");
      setShowNotif(true);
  
      setTimeout(() => {
        setShowNotif(false);
        nav("/login");
      }, 2000);
  
    } catch (err: any) {
      console.log("REGISTER ERROR:", err.response?.data);
  
      setIsSuccess(false);
  
      setNotif(
        err.response?.data?.message ||
        "Registrasi gagal"
      );
  
      setShowNotif(true);
  
      setTimeout(() => {
        setShowNotif(false);
      }, 3000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      {showNotif && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              textAlign: "center",
              minWidth: "320px",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                marginBottom: "15px",
              }}
            >
              <div
  style={{
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: isSuccess ? "#22c55e" : "#ef4444",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 20px",
    fontSize: "45px",
    fontWeight: "bold",
  }}
>
  {isSuccess ? "✓" : "✕"}
</div>
            </div>

            <p
              style={{
                color: isSuccess ? "#16a34a" : "#dc2626",
                fontSize: "17px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              {notif}
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          width: 350,
          background: "white",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 25,
            color: "#2563eb",
          }}
        >
          Register CPMApp
        </h2>

        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) =>
            setForm({
              ...form,
              nama: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={submit}
          style={{
            width: "100%",
            padding: 12,
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          Register
        </button>

        <button
          onClick={() => nav("/login")}
          style={{
            width: "100%",
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
