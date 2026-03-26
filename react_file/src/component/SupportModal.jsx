import React, { useState } from 'react';
import { X, Send, MessageSquare, Phone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import '../styles/SupportModal.css';

const SupportModal = ({ onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setTimeout(onClose, 2500);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="success-state animate-scale-in">
                <div className="icon-badge" style={{ background: 'var(--primary-50)', color: 'var(--success)' }}>
                    <CheckCircle2 size={32} />
                </div>
                <h2>Message Sent!</h2>
                <p>Our support team will get back to you shortly.</p>
            </div>
        );
    }

    return (
        <div className="premium-form-container support-modal">
            <div className="form-header-decoration support-theme"></div>
            <button className="close-btn" onClick={onClose} title="Close">
                <X size={20} />
            </button>

            <div className="form-title-section">
                <div className="icon-badge support-theme">
                    <MessageSquare size={24} />
                </div>
                <h2>Get in Touch</h2>
                <p>How can we help you today?</p>
            </div>

            <div className="support-info-grid">
                <div className="support-info-card">
                    <Mail size={20} color="var(--primary-600)" />
                    <span>support@tasky.com</span>
                </div>
                <div className="support-info-card">
                    <Phone size={20} color="var(--primary-600)" />
                    <span>+1 (555) 000-0000</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="support-form">
                <div className="premium-input-group">
                    <label className="premium-label" htmlFor="subject">Subject</label>
                    <div className="premium-input-wrapper">
                        <MessageSquare size={18} />
                        <input
                            className="premium-input"
                            id="subject"
                            type="text"
                            required
                            placeholder="e.g., Billing issue, Feature request"
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="premium-input-group">
                    <label className="premium-label" htmlFor="help-message">Message</label>
                    <div className="premium-input-wrapper">
                        <textarea
                            className="premium-input premium-textarea"
                            id="help-message"
                            required
                            rows="4"
                            placeholder="Describe your issue in detail..."
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            disabled={loading}
                            style={{ paddingLeft: '1rem' }}
                        ></textarea>
                    </div>
                </div>

                <button type="submit" className="premium-btn-primary support-theme" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            <span>Send Message</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SupportModal;
