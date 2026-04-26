import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../App.css";
import toastr from "toastr";

toastr.options = {
  closeButton: true,
  positionClass: "toast-bottom-right",
  timeOut: "3000",
};

// ================= ROLE IDS FROM ENV =================
const ADMIN_ROLE = process.env.REACT_APP_ADMIN_ROLE_ID;
const WAITER_ROLE = process.env.REACT_APP_WAITER_ROLE_ID;
const KITCHEN_ROLE = process.env.REACT_APP_KITCHEN_ROLE_ID;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toastr.error("Email and Password required");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const user = response.data.user;

        // save user
        localStorage.setItem("user", JSON.stringify(user));
        login(user);

        // ================= ROLE BASED REDIRECT USING ENV IDS =================
        if (user.userTypeId === ADMIN_ROLE) {
          navigate("/Dashboard");
        } 
        else if (user.userTypeId === WAITER_ROLE) {
          navigate("/waiter");
        } 
        else if (user.userTypeId === KITCHEN_ROLE) {
          navigate("/kitchen");
        } 
        else {
          navigate("/qr"); // fallback QR user
        }
      }
    } catch (error) {
      toastr.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="app">
      <div className="content-container">
        <div className="login-container">

          <h2>HMM Login</h2>

          <form onSubmit={handleSubmit} className="login-form">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />

            <button type="submit" className="login-button">
              Login
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;