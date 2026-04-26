import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ================= ROLE CONFIG FROM .env =================
const ADMIN_ID = process.env.REACT_APP_ADMIN_ROLE_ID;
const KITCHEN_ID = process.env.REACT_APP_KITCHEN_ROLE_ID;
const WAITER_ID = process.env.REACT_APP_WAITER_ROLE_ID;

// ================= GET USER =================
const getUserFromStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());

  const isAuthenticated = !!user;

  // ================= LOGIN =================
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ================= ROLE DETECTION =================
  const getRole = () => {
    if (!user) return null;

    if (user.userTypeId === ADMIN_ID) return "Admin";
    if (user.userTypeId === KITCHEN_ID) return "Kitchen";
    if (user.userTypeId === WAITER_ID) return "Waiter";

    return "QR";
  };

  // ================= HELPERS =================
  const isAdmin = () => getRole() === "Admin";
  const isWaiter = () => getRole() === "Waiter";
  const isKitchen = () => getRole() === "Kitchen";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        role: getRole(),
        isAdmin,
        isWaiter,
        isKitchen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};