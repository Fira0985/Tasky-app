import React, { useState } from "react";
import "../styles/loginPop.css";

function LoginPop({ SendDataToParent, getEmail, GetMessage, onClose }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  const color = { color: "red" };
  const api_url_vercel = process.env.REACT_APP_API_URL_vercel;

  // Send data to parent
  function sendToParent(data) {
    if (SendDataToParent) SendDataToParent(data);
    if (getEmail) getEmail(email);
  }

  const data = { email, password };

  // Handle input changes
  const passwordValue = (e) => setPassword(e.target.value);
  const emailValue = (e) => setEmail(e.target.value);

  // Login request
  const loginRequest = async (e) => {
    e.preventDefault();
    const url = api_url_vercel + "login";
    const option = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, option);
      const answer = await response.json();
      sendToParent(answer);

      const ok = answer?.message === "User loged in successfully";
      setErrorVisible(!ok);

      if (GetMessage) GetMessage(!ok);
      if (ok && onClose) onClose();
    } catch (error) {
      console.error("Internal error " + error);
      setErrorVisible(true);
      if (GetMessage) GetMessage(true);
    }
  };

  return (
    <div id="login-box" className="login-box">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <h2>Login</h2>
      <form onSubmit={loginRequest}>
        <div className="textbox">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={emailValue}
          />
        </div>
        <div className="textbox">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={passwordValue}
          />
        </div>
        {errorVisible && (
          <div className="message show">
            <label htmlFor="message" style={color}>
              Incorrect Password or Email
            </label>
          </div>
        )}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPop;
