import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Home from "./index";

// ADMIN
import AdminLayout from "./admin/_layout";
import AdminHome from "./admin/index";
import WisataAdmin from "./admin/tabs/wisata";
import BookingAdmin from "./admin/tabs/booking";
import ReviewAdmin from "./admin/tabs/review";

// CUSTOMER
import CustomerLayout from "./customer/_layout";
import CustomerHome from "./customer/index";
import WisataCustomer from "./customer/tabs/index";
import BookingCustomer from "./customer/tabs/booking";
import ReviewCustomer from "./customer/tabs/review";

// DETAIL
import DetailWisata from "./wisata/[id]";

// 🔐 PROTECT ROUTE
function PrivateRoute({ children, role }: any) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (role && role !== userRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminLayout>
                <AdminHome />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/tabs/wisata"
          element={
            <PrivateRoute role="admin">
              <AdminLayout>
                <WisataAdmin />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/tabs/booking"
          element={
            <PrivateRoute role="admin">
              <AdminLayout>
                <BookingAdmin />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/tabs/review"
          element={
            <PrivateRoute role="admin">
              <AdminLayout>
                <ReviewAdmin />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* CUSTOMER */}
        <Route
          path="/customer"
          element={
            <PrivateRoute role="customer">
              <CustomerLayout>
                <CustomerHome />
              </CustomerLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/tabs"
          element={
            <PrivateRoute role="customer">
              <CustomerLayout>
                <WisataCustomer />
              </CustomerLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/tabs/booking"
          element={
            <PrivateRoute role="customer">
              <CustomerLayout>
                <BookingCustomer />
              </CustomerLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/tabs/review"
          element={
            <PrivateRoute role="customer">
              <CustomerLayout>
                <ReviewCustomer />
              </CustomerLayout>
            </PrivateRoute>
          }
        />

        {/* DETAIL */}
        <Route path="/wisata/:id" element={<DetailWisata />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;