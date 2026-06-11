import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setToken } from "./lib/api";

export default function Login({ setRole }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
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

      navigate(role === "admin" ? "/admin" : "/customer");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Login gagal");
      } else {
        alert("Server tidak bisa diakses");
      }
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={styles.title}>CPMApp</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.btnLogin}>
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={styles.btnRegister}
        >
          Register
        </button>
      </form>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
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
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: 35,
    borderRadius: 18,
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    width: 330,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.3)",
  },

  title: {
    marginBottom: 25,
    color: "#2563eb",
    fontSize: 38,
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  input: {
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
  },

  btnLogin: {
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
    marginBottom: 10,
  },

  btnRegister: {
    width: "100%",
    padding: 12,
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
};
