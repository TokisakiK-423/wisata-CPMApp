import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>SELAMAT DATANG DI APLIKASI WISATA</h1>

      <p>Silakan login atau register terlebih dahulu</p>

      <div style={{ marginTop: 20 }}>
        <Link to="/login">
          <button style={{ marginRight: 10 }}>Login</button>
        </Link>

        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}