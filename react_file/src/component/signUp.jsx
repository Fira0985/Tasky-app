import React, { useState } from "react";
import { User, Mail, Lock, ShieldCheck, AlertCircle, X } from "lucide-react";
import "../styles/signUp.css";
import { fetchAPI } from "../api";

function SignUp({ onClose, GetMessage }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

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
        // Relaxed validation for better UX during development
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

        const requestData = { name, email, password };

        const result = await fetchAPI("/signup", {
            method: "POST",
            body: JSON.stringify(requestData),
        });

        setMessage(result.message);
        if (GetMessage) GetMessage(!result.ok);

        if (result.ok) {
            // Logic for what happens after successful signup
            // We could automatically log them in or show a success message
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        }
    };

    return (
        <div className="signup-modal">
            <h2>Create Account</h2>
            <form onSubmit={registerRequest} className="signup-form">
                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <User className="input-icon" size={18} />
                </div>
                <div className="input-group">
                    <label htmlFor="regEmail">Email Address</label>
                    <input
                        id="regEmail"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="input-icon" size={18} />
                </div>
                <div className="input-group">
                    <label htmlFor="regPassword">Password</label>
                    <input
                        id="regPassword"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="input-icon" size={18} />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <ShieldCheck className="input-icon" size={18} />
                </div>
                {message && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{message}</span>
                    </div>
                )}
                <button type="submit">Join Tasky</button>
            </form>
        </div>
    );
}

export default SignUp;
