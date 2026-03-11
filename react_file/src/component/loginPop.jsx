import React, { useState } from "react";
import { Mail, Lock, AlertCircle, X } from "lucide-react";
import "../styles/loginPop.css";
import { fetchAPI } from "../api";

function LoginPop({ SendDataToParent, getEmail, GetMessage, onClose }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Incorrect Password or Email");

  // Send data to parent
  function sendToParent(data) {
    if (getEmail) getEmail(email);
    if (SendDataToParent) SendDataToParent(data);
  }

  // Login request
  const loginRequest = async (e) => {
    e.preventDefault();

    // Ensure the data object is built with the current state
    const requestData = { email, password };

    const result = await fetchAPI("/login", {
      method: "POST",
      body: JSON.stringify(requestData),
    });

    const ok = result.ok && (
      result.data?.message === "User logged in successfully" ||
      result.data?.message === "User loged in successfully"
    );

    if (ok) {
      // Update parent state and navigate only on success
      sendToParent(result.data);
      if (onClose) onClose();
    } else {
      setErrorVisible(true);
      setErrorMessage(result.message || "Incorrect Password or Email");
    }

    if (GetMessage) GetMessage(!ok);
    if (ok && onClose) onClose();
  };

  return (
    <div id="login-box" className="login-box">
      <h2>Welcome Back</h2>
      <form onSubmit={loginRequest}>
        <div className="textbox">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Mail className="input-icon" size={18} />
        </div>
        <div className="textbox">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="input-icon" size={18} />
        </div>
        {errorVisible && (
          <div className="message">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}
        <button type="submit" className="login-btn">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginPop;
