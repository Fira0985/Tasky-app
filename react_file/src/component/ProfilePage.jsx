import React, { useEffect, useState } from "react";
import { fetchAPI } from "../api";
import { User, Mail, Lock, Save, X } from "lucide-react";
import "../styles/profile.css";

export default function ProfilePage({ email }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success, error

    // Profile Data
    const [name, setName] = useState("");
    const [serverEmail, setServerEmail] = useState(email || "");

    // Password Data
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    useEffect(() => {
        if (!email) {
            setLoading(false);
            return;
        }
        fetchProfile();
    }, [email]);

    async function fetchProfile() {
        setLoading(true);
        try {
            const result = await fetchAPI("/get-profile", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            if (result.ok) {
                setName(result.data.name || "");
                setServerEmail(result.data.email || email);
            } else {
                showMessage(result.message || "Failed to load profile", "error");
            }
        } catch (error) {
            showMessage("Network error while loading profile", "error");
        } finally {
            setLoading(false);
        }
    }

    function showMessage(msg, type) {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 5000);
    }

    async function handleSave(e) {
        e.preventDefault();
        setMessage("");

        if (name.trim().length < 3) {
            return showMessage("Name must be at least 3 characters", "error");
        }

        if (showPasswordSection && (newPassword || confirmPassword)) {
            if (!currentPassword) return showMessage("Current password is required", "error");
            if (newPassword.length < 6) return showMessage("New password must be at least 6 characters", "error");
            if (newPassword !== confirmPassword) return showMessage("New passwords do not match", "error");
        }

        setSaving(true);
        try {
            const payload = {
                email: serverEmail,
                name: name.trim()
            };

            if (showPasswordSection && newPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const result = await fetchAPI("/update-profile", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (result.ok) {
                showMessage("Profile updated successfully", "success");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setShowPasswordSection(false);
            } else {
                showMessage(result.message || "Failed to update profile", "error");
            }
        } catch (error) {
            showMessage("Network error while updating profile", "error");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="profile-dashboard-container loading"><div className="spinner"></div><p>Loading Profile...</p></div>;

    return (
        <div className="profile-dashboard-container">
            <div className="profile-content-wrapper">
                <div className="profile-header-section">
                    <h1>User Profile</h1>
                    <p>Manage your account settings and preferences.</p>
                </div>

                <form onSubmit={handleSave} className="profile-form">
                    <div className="form-section">
                        <h2>Personal Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label><User size={16} /> Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="form-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    value={serverEmail}
                                    readOnly
                                    className="readonly-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <h2>Security</h2>
                            <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                            >
                                {showPasswordSection ? "Cancel Change" : "Change Password"}
                            </button>
                        </div>

                        {showPasswordSection && (
                            <div className="password-grid">
                                <div className="form-group">
                                    <label><Lock size={16} /> Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Current Password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Lock size={16} /> New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Lock size={16} /> Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm New Password"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className={`message-banner ${messageType}`}>
                            {message}
                            <button type="button" onClick={() => setMessage("")}><X size={16} /></button>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            <Save size={18} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
