"use client";

import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Bell, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsPage() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('password');

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>Settings</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {[
                    { id: 'password', icon: Lock, label: 'Password' },
                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                    { id: 'danger', icon: Shield, label: 'Privacy & Security' },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '8px', border: 'none',
                                background: activeTab === tab.id ? '#4f46e5' : 'white',
                                color: activeTab === tab.id ? 'white' : '#374151',
                                fontWeight: 500, cursor: 'pointer',
                                boxShadow: activeTab === tab.id ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Icon size={18} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {activeTab === 'password' && <PasswordSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'danger' && <DangerSection logout={logout} />}
        </div>
    );
}

function PasswordSection() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/users/me/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', background: '#e0e7ff', borderRadius: '12px' }}>
                    <Lock size={24} color="#4f46e5" />
                </div>
                <div>
                    <h2 style={{ fontWeight: 600, color: '#111827' }}>Change Password</h2>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Update your password to keep your account secure</p>
                </div>
            </div>

            {message.text && (
                <div style={{
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
                    background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: message.type === 'success' ? '#059669' : '#dc2626'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                        { key: 'currentPassword', label: 'Current Password' },
                        { key: 'newPassword', label: 'New Password' },
                        { key: 'confirmPassword', label: 'Confirm New Password' },
                    ].map((field) => (
                        <div key={field.key}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                                {field.label}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords[field.key.replace('Password', '').replace('confirm', 'confirm')] ? 'text' : 'password'}
                                    value={formData[field.key]}
                                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                    required
                                    style={{
                                        width: '100%', padding: '12px 48px 12px 14px',
                                        border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, [field.key.replace('Password', '').replace('confirm', 'confirm')]: !showPasswords[field.key.replace('Password', '').replace('confirm', 'confirm')] })}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280'
                                    }}
                                >
                                    {showPasswords[field.key.replace('Password', '').replace('confirm', 'confirm')] ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: '24px', padding: '12px 24px',
                        background: '#4f46e5', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1
                    }}
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}

function NotificationsSection() {
    const [settings, setSettings] = useState({
        orderUpdates: true,
        promotions: true,
        newsletter: false,
        productUpdates: true,
    });

    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '12px' }}>
                    <Bell size={24} color="#d97706" />
                </div>
                <div>
                    <h2 style={{ fontWeight: 600, color: '#111827' }}>Notification Preferences</h2>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Choose what notifications you'd like to receive</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                    { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about your order status changes' },
                    { key: 'promotions', label: 'Promotions & Deals', desc: 'Receive exclusive offers and discount codes' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Weekly updates about new products and features' },
                    { key: 'productUpdates', label: 'Product Updates', desc: 'Get notified when wishlist items are back in stock' },
                ].map((item) => (
                    <div
                        key={item.key}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px', background: '#f9fafb', borderRadius: '12px'
                        }}
                    >
                        <div>
                            <p style={{ fontWeight: 500 }}>{item.label}</p>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{item.desc}</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                            style={{
                                width: '52px', height: '28px', borderRadius: '14px', border: 'none',
                                background: settings[item.key] ? '#4f46e5' : '#d1d5db',
                                cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '2px',
                                left: settings[item.key] ? '26px' : '2px',
                                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DangerSection({ logout }) {
    return (
        <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '12px' }}>
                    <Shield size={24} color="#dc2626" />
                </div>
                <div>
                    <h2 style={{ fontWeight: 600, color: '#111827' }}>Privacy & Security</h2>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Manage your account security settings</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Logout from all devices</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                        This will log you out from all devices where you're currently signed in.
                    </p>
                    <button
                        onClick={() => { logout(); window.location.href = '/'; }}
                        style={{
                            padding: '10px 20px', background: '#f3f4f6',
                            border: '1px solid #d1d5db', borderRadius: '8px',
                            fontWeight: 500, cursor: 'pointer'
                        }}
                    >
                        Logout Everywhere
                    </button>
                </div>

                <div style={{ padding: '20px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <h3 style={{ fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>Delete Account</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => alert('Please contact support to delete your account.')}
                        style={{
                            padding: '10px 20px', background: '#dc2626', color: 'white',
                            border: 'none', borderRadius: '8px',
                            fontWeight: 500, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <Trash2 size={16} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
