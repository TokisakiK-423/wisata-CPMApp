import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>APLIKASI WISATA</h1>
      <p>Silakan login atau register</p>

      <Link to="/login">
        <button>Login</button>
      </Link>

      <Link to="/register" style={{ marginLeft: 10 }}>
        <button>Register</button>
      </Link>
    </div>
  );
}