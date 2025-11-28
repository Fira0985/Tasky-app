import React, { useState } from "react";
import "../styles/signUp.css";

function SignUp({ onClose, GetMessage }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const api_url_vercel = process.env.REACT_APP_API_URL_vercel;
    const data = { name, email, password };

    // ===== Input Handlers =====
    const nameValue = (e) => setName(e.target.value);
    const emailValue = (e) => setEmail(e.target.value);
    const passwordValue = (e) => setPassword(e.target.value);
    const confirmPasswordValue = (e) => setConfirmPassword(e.target.value);

    // ===== Validation Functions =====
    const validateName = (name) => {
        if (!name.trim()) return "Name is required";
        if (name.length < 3) return "Name must be at least 3 characters";
        if (/\d/.test(name)) return "Name cannot contain numbers";
        return "";
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return "Email is required";
        if (!regex.test(email)) return "Invalid email format";
        return "";
    };

    const validatePassword = (password) => {
        if (!password.trim()) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        if (!regex.test(password))
            return "Password must contain uppercase, lowercase, number, and special character";
        return "";
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        if (!confirmPassword.trim()) return "Confirm password is required";
        if (password !== confirmPassword) return "Passwords do not match";
        return "";
    };

    // ===== Form Submission =====
    const registerRequest = async (event) => {
        event.preventDefault();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

        if (nameError || emailError || passwordError || confirmPasswordError) {
            setMessage(nameError || emailError || passwordError || confirmPasswordError);
            if (GetMessage) GetMessage(true);
            return;
        }

        const url = api_url_vercel + "signup";
        const option = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(url, option);
            const result = await response.json();
            setMessage(result.message || "Signup response received");
            if (GetMessage) GetMessage(false);

            // close when server responded with success (2xx)
            if (response.ok && onClose) onClose();
        } catch (error) {
            console.error("There was an error during the request:", error.message);
            setMessage("Network error. Please try again.");
            if (GetMessage) GetMessage(true);
        }
    };

    return (
        <div className="signup-modal">
            <button className="close-btn" onClick={onClose}>
                &times;
            </button>
            <h2>Register</h2>
            <form onSubmit={registerRequest} className="signup-form">
                <input type="text" placeholder="Full Name" value={name} onChange={nameValue} />
                <input type="email" placeholder="Email" value={email} onChange={emailValue} />
                <input type="password" placeholder="Password" value={password} onChange={passwordValue} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={confirmPasswordValue} />
                {message && <p className="error-message">{message}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default SignUp;
