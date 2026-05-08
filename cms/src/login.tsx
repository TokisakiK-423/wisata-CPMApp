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
          "url(https://ik.imagekit.io/tvlk/blog/2024/12/shutterstock_2474928225.jpg)",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: 30,
          borderRadius: 15,
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          width: 300,
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <h2
          style={{
            marginBottom: 20,
            textAlign: "center",
            color: "white",
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
  borderRadius: 5,
  border: "1px solid #ccc",
  background: "white",
  color: "black",
  outline: "none",
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
            borderRadius: 5,
            border: "1px solid #ccc",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            outline: "none",
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
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
