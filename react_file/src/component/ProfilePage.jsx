import React, { useEffect, useState } from "react";
import { fetchAPI, API_BASE_URL } from "../api";
import { User, Mail, Lock, Save, X, Shield, Settings, Loader2, Camera, ChevronRight } from "lucide-react";
import "../styles/profile.css";

export default function ProfilePage({ email, onUpdate }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // success, error

    // Profile Data
    const [name, setName] = useState("");
    const [serverEmail, setServerEmail] = useState(email || "");
    const [avatar, setAvatar] = useState("");
    const [uploading, setUploading] = useState(false);

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
                setAvatar(result.data.avatar || "");
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
                if (onUpdate) onUpdate();
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

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Visual preview
        const reader = new FileReader();
        reader.onloadend = () => {
            // We set the temporary preview, but we'll wait for the server to confirm
        };
        reader.readAsDataURL(file);

        // Upload to server
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("email", serverEmail);

        setUploading(true);
        try {
            const result = await fetchAPI("/update-avatar", {
                method: "POST",
                body: formData,
            });

             if (result.ok) {
                setAvatar(result.data.avatarUrl);
                showMessage("Profile photo updated", "success");
                if (onUpdate) onUpdate();
            } else {
                showMessage(result.message || "Upload failed", "error");
            }
        } catch (error) {
            showMessage("Network error during upload", "error");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="profile-dashboard-container loading-state">
            <Loader2 size={48} className="animate-spin" color="var(--primary-500)" />
            <p>Loading personal workspace...</p>
        </div>
    );

    return (
        <div className="profile-dashboard-container animate-fade-in">
            <div className="profile-content-wrapper">
                <div className="profile-header-section">
                    <div className="header-text">
                        <h1>Account Settings</h1>
                        <p>Customize your profile and security preferences</p>
                    </div>
                </div>

                <div className="profile-layout-grid">
                    {/* Left Sidebar - Profile Overview */}
                    <aside className="profile-sidebar">
                        <div className="profile-card modern-card">
                            <div className="profile-avatar-container">
                                <div className="profile-avatar">
                                    {avatar ? (
                                        <img src={`${API_BASE_URL}${avatar}`} alt="Profile" className="avatar-img" />
                                    ) : (
                                        <User size={48} />
                                    )}
                                    <label className="avatar-edit-btn" title="Change Avatar" htmlFor="avatar-upload">
                                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                        <input 
                                            type="file" 
                                            id="avatar-upload" 
                                            hidden 
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                <h3>{name || "User"}</h3>
                                <p>{serverEmail}</p>
                            </div>
                            <nav className="profile-nav">
                                <button className="nav-item active">
                                    <User size={18} />
                                    <span>Personal Info</span>
                                    <ChevronRight size={16} className="chevron" />
                                </button>
                                <button className="nav-item">
                                    <Shield size={18} />
                                    <span>Security</span>
                                    <ChevronRight size={16} className="chevron" />
                                </button>
                                <button className="nav-item">
                                    <Settings size={18} />
                                    <span>Preferences</span>
                                    <ChevronRight size={16} className="chevron" />
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="profile-main-content">
                        <form onSubmit={handleSave} className="modern-form-container profile-form">
                            <div className="form-header-decoration profile-theme"></div>
                            
                            {message && (
                                <div className={`message-banner ${messageType} animate-scale-in`}>
                                    {messageType === 'success' ? <Save size={16} /> : <X size={16} />}
                                    <span>{message}</span>
                                    <button type="button" className="close-msg" onClick={() => setMessage("")}><X size={14} /></button>
                                </div>
                            )}

                            <div className="profile-form-section">
                                <div className="section-title">
                                    <User size={20} />
                                    <h2>Personal Information</h2>
                                </div>
                                <div className="form-row-grid">
                                    <div className="modern-input-group">
                                        <label className="modern-label" htmlFor="profile-name">Full Name</label>
                                        <div className="modern-input-wrapper">
                                            <User size={18} />
                                            <input
                                                className="modern-input"
                                                id="profile-name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your Name"
                                                disabled={saving}
                                            />
                                        </div>
                                    </div>
                                    <div className="modern-input-group">
                                        <label className="modern-label" htmlFor="profile-email">Email Address</label>
                                        <div className="modern-input-wrapper">
                                            <Mail size={18} />
                                            <input
                                                className="modern-input readonly-input"
                                                id="profile-email"
                                                type="email"
                                                value={serverEmail}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-form-section">
                                <div className="section-title">
                                    <Shield size={20} />
                                    <h2>Security & Password</h2>
                                </div>
                                
                                {!showPasswordSection ? (
                                    <div className="password-placeholder-card" onClick={() => setShowPasswordSection(true)}>
                                        <div className="card-info">
                                            <h4>Change Password</h4>
                                            <p>Update your password to keep your account secure</p>
                                        </div>
                                        <button type="button" className="action-btn">Enable</button>
                                    </div>
                                ) : (
                                    <div className="password-form-active animate-scale-in">
                                        <div className="modern-input-group">
                                            <label className="modern-label" htmlFor="current-pw">Current Password</label>
                                            <div className="modern-input-wrapper">
                                                <Lock size={18} />
                                                <input
                                                    className="modern-input"
                                                    id="current-pw"
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row-grid">
                                            <div className="modern-input-group">
                                                <label className="modern-label" htmlFor="new-pw">New Password</label>
                                                <div className="modern-input-wrapper">
                                                    <Lock size={18} />
                                                    <input
                                                        className="modern-input"
                                                        id="new-pw"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="At least 6 chars"
                                                    />
                                                </div>
                                            </div>
                                            <div className="modern-input-group">
                                                <label className="modern-label" htmlFor="confirm-pw">Confirm New</label>
                                                <div className="modern-input-wrapper">
                                                    <Lock size={18} />
                                                    <input
                                                        className="modern-input"
                                                        id="confirm-pw"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="Repeat new password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" className="cancel-pw-btn" onClick={() => setShowPasswordSection(false)}>
                                            Cancel Password Change
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="form-footer-actions">
                                <button type="submit" className="modern-btn-primary save-btn" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            <span>Save Account Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
}
