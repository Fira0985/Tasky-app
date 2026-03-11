import React, { useState } from 'react';
import { X, Send, MessageSquare, Phone, Mail, CheckCircle2 } from 'lucide-react';
import '../styles/addPop.css'; // Reusing modal base styles

const SupportModal = ({ onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setTimeout(onClose, 2000);
        }, 1000);
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
                <h2 style={{ color: 'var(--secondary-900)' }}>Message Sent!</h2>
                <p style={{ color: 'var(--secondary-500)' }}>Our support team will get back to you shortly.</p>
            </div>
        );
    }

    return (
        <div className="support-content">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', color: 'var(--secondary-900)', marginBottom: '0.5rem' }}>Get in Touch</h2>
                <p style={{ color: 'var(--secondary-500)' }}>How can we help you today?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', background: 'var(--secondary-50)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={20} color="var(--primary-600)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>support@tasky.com</span>
                </div>
                <div style={{ padding: '1rem', background: 'var(--secondary-50)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Phone size={20} color="var(--primary-600)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>+1 (555) 000-0000</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.5rem', flexDirection: 'column' }}>
                <div className="input-wrapper">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary-700)', marginBottom: '0.5rem' }}>Subject</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g., Billing issue, Feature request"
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--secondary-200)' }}
                    />
                </div>

                <div className="input-wrapper">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--secondary-700)', marginBottom: '0.5rem' }}>Message</label>
                    <textarea
                        required
                        rows="4"
                        placeholder="Describe your issue in detail..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--secondary-200)', resize: 'none' }}
                    ></textarea>
                </div>

                <button type="submit" className="save-btn" style={{ width: '100%', gap: '1rem', marginTop: '1rem' }}>
                    <Send size={18} /> Send Message
                </button>
            </form>
        </div>
    );
};

export default SupportModal;
