import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ================= ENV ROLES =================
const ROLE_IDS = {
  ADMIN: String(process.env.REACT_APP_ROLE_ADMIN).trim(),
  KITCHEN: String(process.env.REACT_APP_ROLE_KITCHEN).trim(),
  WAITER: String(process.env.REACT_APP_ROLE_WAITER).trim(),
};

// ================= LAZY =================
const Preloader = React.lazy(() => import("./components/layouts/Preloader"));
const LoginPage = React.lazy(() => import("./components/pages/LoginPage"));

const AdminDashboard = React.lazy(() => import("./components/pages/Dashboard"));
const User = React.lazy(() => import("./components/pages/User"));
const MenuItems = React.lazy(() => import("./components/pages/MenuItems"));
const MenuCategory = React.lazy(() => import("./components/pages/MenuCategory"));
const Tables = React.lazy(() => import("./components/pages/Tables"));

const WaiterDashboard = React.lazy(() => import("./components/pages/WaiterDashboard"));
const KitchenDashboard = React.lazy(() => import("./components/pages/KitchenDashboard"));
const QRMenu = React.lazy(() => import("./components/pages/QRMenu"));
const Order = React.lazy(() => import("./components/pages/Order"));

// ================= GET USER =================
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// ================= ROLE ROUTE =================
const RoleRedirect = () => {
  const user = getUser();

  if (!user) return <Navigate to="/LoginPage" replace />;

  const roleId = String(user.userTypeId).trim();

  console.log("USER ROLE:", roleId);
  console.log("ADMIN ROLE:", ROLE_IDS.ADMIN);

  if (roleId === ROLE_IDS.ADMIN) return <Navigate to="/admin" replace />;
  if (roleId === ROLE_IDS.WAITER) return <Navigate to="/waiter" replace />;
  if (roleId === ROLE_IDS.KITCHEN) return <Navigate to="/kitchen" replace />;

  return <Navigate to="/qr" replace />;
};

// ================= ROUTES =================
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const user = getUser();
 const params = new URLSearchParams(location.search);
  const tableNo = params.get("table");

  // 🔥 ALLOW QR ACCESS WITHOUT LOGIN
  if (!isAuthenticated && tableNo && location.pathname === "/MenuItems") {
    return (
      <Routes>
        <Route path="/MenuItems" element={<MenuItems />} />
        <Route path="*" element={<Navigate to={`/MenuItems?table=${tableNo}`} replace />} />
      </Routes>
    );
  }
  // NOT LOGIN
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/LoginPage" replace />} />
      </Routes>
    );
  }

  // AUTO REDIRECT ONLY ON "/"
  if (location.pathname === "/") {
    return <RoleRedirect />;
  }

  const roleId = String(user?.userTypeId).trim();
// console.log("USER:", user);
// console.log("ROLE IDS:", ROLE_IDS);
// console.log("USER ROLE ID:", user?.userTypeId);
  // ADMIN
  if (roleId === ROLE_IDS.ADMIN) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/User" element={<User />} />
        <Route path="/MenuCategory" element={<MenuCategory />} />
        <Route path="/MenuItems" element={<MenuItems />} />
        <Route path="/Tables" element={<Tables />} />
        <Route path="/Order" element={<Order/>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // WAITER
  if (roleId === ROLE_IDS.WAITER) {
    return (
      <Routes>
        <Route path="/waiter" element={<WaiterDashboard />} />
            <Route path="/MenuCategory" element={<MenuCategory />} />
        <Route path="/MenuItems" element={<MenuItems />} />
            <Route path="/Tables" element={<Tables />} />
             <Route path="/Order" element={<Order/>} />
        <Route path="*" element={<Navigate to="/waiter" replace />} />
      </Routes>
    );
  }

  // KITCHEN
  if (roleId === ROLE_IDS.KITCHEN) {
    return (
      <Routes>
        <Route path="/kitchen" element={<KitchenDashboard />} />
        <Route path="*" element={<Navigate to="/kitchen" replace />} />
      </Routes>
    );
  }

  // QR fallback
  return (
    <Routes>
      <Route path="/qr" element={<QRMenu />} />
      <Route path="*" element={<Navigate to="/qr" replace />} />
    </Routes>
  );
};

// ================= APP =================
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Preloader />
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;