import { useState } from "react";
import api from "./services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/customer";
      }
    } catch {
      alert("Login gagal");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="username" onChange={e => setUsername(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}