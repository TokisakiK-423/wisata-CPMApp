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
      const res = await API.post("/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

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
      if (err.response) {
        alert(err.response.data.message || "Login gagal");
      } else {
        alert("Server tidak bisa diakses");
      }
    }
  };

  return (
    <div
  style={{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backgroundImage:
      "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: 300,
          textAlign: "center",
        }}
      >
        <h2
  style={{
    marginBottom: 20,
    textAlign: "center",
    color: "#2563eb",
  }}
>
  CPMApp
</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
