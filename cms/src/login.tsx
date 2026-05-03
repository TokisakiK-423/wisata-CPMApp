import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setToken } from "./lib/api";

export default function Login({ setRole }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("KIRIM:", { username, password });

      const res = await API.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      console.log("HASIL:", res.data);

      const { token, role } = res.data;


      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setRole(role);
      setToken(token);
      

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/customer");
      }
    } catch (err: any) {
      console.log("ERROR FULL:", err);

      if (err.response) {
        console.log("ERROR DATA:", err.response.data);
        alert(err.response.data.message || "Login gagal");
      } else {
        alert("Server tidak bisa diakses (cek backend nyala atau tidak)");
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}