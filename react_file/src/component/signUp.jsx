import React, { useState } from "react";
import { User, Mail, Lock, ShieldCheck, AlertCircle, X, UserPlus, Loader2 } from "lucide-react";
import "../styles/signUp.css";
import { fetchAPI } from "../api";

function SignUp({ onClose, GetMessage, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        setMessage("");

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

        if (nameError || emailError || passwordError || confirmPasswordError) {
            setMessage(nameError || emailError || passwordError || confirmPasswordError);
            if (GetMessage) GetMessage(true);
            setLoading(false);
            return;
        }

        const requestData = { name, email, password };

        try {
            const result = await fetchAPI("/signup", {
                method: "POST",
                body: JSON.stringify(requestData),
            });

            setMessage(result.message);
            if (GetMessage) GetMessage(!result.ok);

            if (result.ok) {
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            }
        } catch (err) {
            setMessage("Connection error. Please try again.");
            if (GetMessage) GetMessage(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modern-form-container signup-modal">
            <div className="form-header-decoration signup-theme"></div>
            <button className="close-btn" onClick={onClose} title="Close">
                <X size={20} />
            </button>

            <div className="form-title-section">
                <div className="icon-badge signup-theme">
                    <UserPlus size={24} />
                </div>
                <h2>Create Account</h2>
                <p>Join Tasky today and start managing tasks like a pro</p>
            </div>

            {message && (
                <div className={`message-banner ${message.toLowerCase().includes('success') ? 'success' : 'error'} animate-shake`}>
                    <AlertCircle size={16} />
                    <span>{message}</span>
                </div>
            )}

            <form onSubmit={registerRequest} className="signup-form">
                <div className="modern-input-group">
                    <label className="modern-label" htmlFor="fullName">Full Name</label>
                    <div className="modern-input-wrapper">
                        <User size={18} />
                        <input
                            className="modern-input"
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="modern-input-group">
                    <label className="modern-label" htmlFor="regEmail">Email Address</label>
                    <div className="modern-input-wrapper">
                        <Mail size={18} />
                        <input
                            className="modern-input"
                            id="regEmail"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="form-row-grid">
                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="regPassword">Password</label>
                        <div className="modern-input-wrapper">
                            <Lock size={18} />
                            <input
                                className="modern-input"
                                id="regPassword"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="modern-input-group">
                        <label className="modern-label" htmlFor="confirmPassword">Confirm</label>
                        <div className="modern-input-wrapper">
                            <ShieldCheck size={18} />
                            <input
                                className="modern-input"
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="modern-btn-primary signup-theme" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Creating...</span>
                        </>
                    ) : (
                        <>
                            <UserPlus size={18} />
                            <span>Join Tasky</span>
                        </>
                    )}
                </button>
            </form>
            
            <div className="form-footer">
                <p>Already have an account? <span className="login-link" onClick={onSwitchToLogin} style={{cursor: 'pointer'}}>Sign In</span></p>
            </div>
        </div>
    );
}

export default SignUp;
