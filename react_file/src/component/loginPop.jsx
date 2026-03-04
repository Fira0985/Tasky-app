import React, { useState } from "react";
import { Mail, Lock, AlertCircle, X } from "lucide-react";
import "../styles/loginPop.css";

function LoginPop({ SendDataToParent, getEmail, GetMessage, onClose }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Incorrect Password or Email");

  const api_url_vercel = process.env.REACT_APP_API_URL_vercel;

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

    // Construct URL responsibly (handle trailing slashes in env var)
    const base_url = api_url_vercel?.endsWith("/") ? api_url_vercel.slice(0, -1) : api_url_vercel;
    const url = `${base_url}/login`;

    const option = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, option);
      const answer = await response.json();

      const ok = response.ok && (
        answer?.message === "User logged in successfully" ||
        answer?.message === "User loged in successfully"
      );

      if (ok) {
        // Update parent state and navigate only on success
        sendToParent(answer);
        if (onClose) onClose();
      } else {
        setErrorVisible(true);
        setErrorMessage(answer?.message || "Incorrect Password or Email");
      }

      if (GetMessage) GetMessage(!ok);
      if (ok && onClose) onClose();
    } catch (error) {
      console.error("Login attempt failed:", error);
      setErrorVisible(true);
      setErrorMessage("Network error. Please check your connection.");
      if (GetMessage) GetMessage(true);
    }
  };

  return (
    <div id="login-box" className="login-box">
      <button className="close-modal-btn" onClick={onClose}>
        <X size={24} />
      </button>
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
