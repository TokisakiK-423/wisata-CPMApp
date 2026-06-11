import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./login";
import Register from "./register";

// ADMIN
import AdminLayout from "./admin/_layout";
import AdminHome from "./admin/index";
import WisataAdmin from "./admin/wisata";
import BookingAdmin from "./admin/booking";
import EditWisata from "./admin/edit";
import ReviewAdmin from "./admin/review";

// CUSTOMER
import CustomerLayout from "./customer/_layout";
import CustomerHome from "./customer/index";
import WisataCustomer from "./customer/wisata";
import BookingCustomer from "./customer/booking";
import CustomerReview from "./customer/review";

// AUTH
import { getToken, getRole } from "./lib/auth";
import { setToken } from "./lib/api";

export default function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = getRole();
    const token = getToken();

    setRole(storedRole);
    setToken(token);

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= AUTH ================= */}
        <Route
          path="/"
          element={
            role ? (
              <Navigate to={`/${role}`} />
            ) : (
              <Login setRole={setRole} />
            )
          }
        />

        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="wisata" element={<WisataAdmin />} />
          <Route path="booking" element={<BookingAdmin />} />
          <Route path="review" element={<ReviewAdmin />} />
          <Route path="edit" element={<EditWisata />} />
        </Route>

        {/* ================= CUSTOMER ================= */}
        <Route
          path="/customer"
          element={
            role === "customer" ? (
              <CustomerLayout />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="wisata" element={<WisataCustomer />} />
          <Route path="booking" element={<BookingCustomer />} />
          <Route path="review" element={<CustomerReview />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
