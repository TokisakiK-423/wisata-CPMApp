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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        backgroundImage:
          "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb)",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: 35,
          borderRadius: 18,
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          width: 330,
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h2
          style={{
            marginBottom: 25,
            textAlign: "center",
            color: "#2563eb",
            fontSize: 38,
            fontWeight: "bold",
            letterSpacing: "1px",
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
            padding: 12,
            marginBottom: 18,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "rgba(255,255,255,0.95)",
            color: "black",
            outline: "none",
            fontSize: 15,
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 22,
            borderRadius: 10,
            border: "1px solid #d1d5db",
            background: "rgba(255,255,255,0.95)",
            color: "black",
            outline: "none",
            fontSize: 15,
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
            transition: "0.2s",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
