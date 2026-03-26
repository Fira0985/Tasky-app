import React, { useState } from "react";
import { Mail, Lock, AlertCircle, X, LogIn, Loader2 } from "lucide-react";
import "../styles/loginPop.css";
import { fetchAPI } from "../api";

function LoginPop({ SendDataToParent, getEmail, GetMessage, onClose }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setErrorVisible(false);

    const requestData = { email, password };

    try {
      const result = await fetchAPI("/login", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const ok = result.ok && (
        result.data?.message === "User logged in successfully" ||
        result.data?.message === "User loged in successfully"
      );

      if (ok) {
        sendToParent(result.data);
        if (onClose) onClose();
      } else {
        setErrorVisible(true);
        setErrorMessage(result.message || "Incorrect Password or Email");
      }

      if (GetMessage) GetMessage(!ok);
    } catch (err) {
      setErrorVisible(true);
      setErrorMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-box" className="premium-form-container login-modal">
      <div className="form-header-decoration login-theme"></div>
      <button className="close-btn" onClick={onClose} title="Close">
        <X size={20} />
      </button>

      <div className="form-title-section">
        <div className="icon-badge login-theme">
          <LogIn size={24} />
        </div>
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your account</p>
      </div>

      {errorVisible && (
        <div className="error-message animate-shake">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={loginRequest}>
        <div className="premium-input-group">
          <label className="premium-label" htmlFor="email">Email Address</label>
          <div className="premium-input-wrapper">
            <Mail size={18} />
            <input
              className="premium-input"
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="premium-input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="premium-label" htmlFor="password">Password</label>
            <span className="forgot-password-link">Forgot?</span>
          </div>
          <div className="premium-input-wrapper">
            <Lock size={18} />
            <input
              className="premium-input"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="premium-btn-primary login-theme" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn size={18} />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="form-footer">
        <p>Don't have an account? <span className="signup-link">Create one</span></p>
      </div>
    </div>
  );
}

export default LoginPop;
