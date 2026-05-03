import { useState } from "react";
import API from "./lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    nama: "",
  });

  const submit = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Register berhasil");
      nav("/login");
    } catch {
      alert("Register gagal");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>

      <input
        placeholder="nama"
        onChange={(e) =>
          setForm({ ...form, nama: e.target.value })
        }
      />

      <br /><br />

      <input
        placeholder="username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <br /><br />

      <button onClick={submit}>Register</button>
    </div>
  );
}