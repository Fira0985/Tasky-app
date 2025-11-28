import React, { useEffect, useState } from "react";
import "../styles/profile.css";

export default function ProfilePage({ email, onProfileUpdated }) {
    const api_url_vercel = process.env.REACT_APP_API_URL_vercel;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [serverEmail, setServerEmail] = useState(email || "");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            setMessage("");

            try {
                const response = await fetch(api_url_vercel + "get-profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (response.ok) {
                    setName(data.name || "");
                    setServerEmail(data.email || email);
                } else {
                    setMessage("Could not load profile.");
                }
            } catch {
                setMessage("Network error while loading profile.");
            }

            setLoading(false);
        }

        fetchProfile();
    }, [email, api_url_vercel]);

    function validateInputs() {
        if (name.trim().length < 3) return "Name must be at least 3 characters.";
        if (newPassword || confirmPassword) {
            if (!currentPassword) return "Enter current password.";
            if (newPassword.length < 6) return "New password must be at least 6 characters.";
            if (newPassword !== confirmPassword) return "New passwords do not match.";
        }
        return "";
    }

    async function handleSave(e) {
        e.preventDefault();
        setMessage("");

        const err = validateInputs();
        if (err) return setMessage(err);

        setSaving(true);

        try {
            const payload = {
                email: serverEmail,
                name: name.trim(),
            };

            if (newPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const res = await fetch(api_url_vercel + "update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Profile updated successfully.");

                if (onProfileUpdated) onProfileUpdated(name.trim());

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage(data.message || "Failed to update profile.");
            }
        } catch {
            setMessage("Network error while updating profile.");
        }

        setSaving(false);
    }

    function handleCancel() {
        setMessage("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1 className="profile-title">Profile Settings</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSave} className="profile-form">

                        <label>Email (read-only)</label>
                        <input type="email" value={serverEmail} readOnly />

                        <label>Full name</label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Your full name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <hr className="divider" />

                        <p className="section-title">Change password (optional)</p>

                        <label>Current password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            placeholder="Current password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />

                        <label>New password</label>
                        <input
                            type="password"
                            value={newPassword}
                            placeholder="New password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label>Confirm new password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm new password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {message && (
                            <p className={`msg ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
                                {message}
                            </p>
                        )}

                        <div className="btn-row">
                            <button type="submit" className="save-btn">
                                {saving ? "Saving..." : "Save changes"}
                            </button>

                            <button type="button" className="cancel-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>

    );
}
