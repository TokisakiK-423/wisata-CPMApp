import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./login";

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

// AUTH & API
import { getToken, getRole } from "./lib/auth";
import { setToken } from "./lib/api";

export default function App() {
  // ✅ 1. Inisialisasi state secara langsung (Lazy Initialization)
  // Ini menghindari render ulang tambahan dan menghilangkan pesan error ESLint
  const [role, setRole] = useState<string | null>(() => getRole());

  useEffect(() => {
    // ✅ 2. Token untuk API dikonfigurasi di sini
    const token = getToken();
    if (token) {
      setToken(token);
    }
  }, []);

  // ✅ 3. Tdak butuh state 'loading' lagi karena role sudah di-load 
  // secara sinkron dari localStorage saat awal startup.

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={
            role ? (
              <Navigate to={`/${role}`} replace />
            ) : (
              <Login setRole={setRole} />
            )
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            role === "admin" ? <AdminLayout /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="wisata" element={<WisataAdmin />} />
          <Route path="booking" element={<BookingAdmin />} />
          <Route path="review" element={<ReviewAdmin />} />
          <Route path="edit" element={<EditWisata />} />
        </Route>

        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            role === "customer" ? <CustomerLayout /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="wisata" element={<WisataCustomer />} />
          <Route path="booking" element={<BookingCustomer />} />
          <Route path="review" element={<CustomerReview />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}