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
   const [errorMessage, setErrorMessage] = useState("");
  const [validated, setValidated] = useState(false);

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
          <div className="content">
            <div className="logo-container">
              <h2>HMM</h2>
            </div>
            <h1 style={{ color: '#000000' }}>Login To Your Account</h1>
            <form className="login-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={handleSubmit} className="login-button">
                Login
              </button>
            </form>
            {/* <div className="login-options" style={{ marginTop: "25px" }}>
              <ul>
                <li>
                  <Link to="/KitchenOrder" className="role-link">Login as Kitchen Staff</Link>
                </li>
                <li>
                  <Link to="/WaitstaffOrder" className="role-link">Login as Wait Staff</Link>
                </li>
                <li>
                  <Link to="/Dashboard" className="role-link">Login as Admin</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
