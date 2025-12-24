"use client";

import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Bell, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsPage() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('password');

    return (
        <div className="settings-page">
            <h1>Settings</h1>

            <div className="tabs-container">
                {[
                    { id: 'password', icon: Lock, label: 'Password' },
                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                    { id: 'danger', icon: Shield, label: 'Privacy' },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'password' && <PasswordSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'danger' && <DangerSection logout={logout} />}

            <style jsx>{`
                .settings-page { width: 100%; }
                .settings-page h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 20px;
                }
                .tabs-container {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    overflow-x: auto;
                    scrollbar-width: none;
                    padding-bottom: 4px;
                }
                .tabs-container::-webkit-scrollbar { display: none; }
                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: none;
                    background: white;
                    color: #374151;
                    font-weight: 500;
                    font-size: 13px;
                    cursor: pointer;
                    white-space: nowrap;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    flex-shrink: 0;
                }
                .tab-btn.active {
                    background: #4f46e5;
                    color: white;
                }

                @media (max-width: 768px) {
                    .settings-page h1 { font-size: 20px; }
                    .tab-btn { padding: 6px 12px; font-size: 12px; }
                }
            `}</style>
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
        <div className="section-card">
            <div className="section-header">
                <div className="section-icon purple"><Lock size={20} /></div>
                <div>
                    <h2>Change Password</h2>
                    <p>Update your password to keep your account secure</p>
                </div>
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
                {[
                    { key: 'currentPassword', label: 'Current Password' },
                    { key: 'newPassword', label: 'New Password' },
                    { key: 'confirmPassword', label: 'Confirm New Password' },
                ].map((field) => (
                    <div key={field.key} className="field-group">
                        <label>{field.label}</label>
                        <div className="input-wrap">
                            <input
                                type={showPasswords[field.key] ? 'text' : 'password'}
                                value={formData[field.key]}
                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, [field.key]: !showPasswords[field.key] })}
                                className="toggle-btn"
                            >
                                {showPasswords[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                ))}

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>

            <style jsx>{`
                .section-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .section-icon {
                    padding: 10px;
                    border-radius: 10px;
                    display: flex;
                }
                .section-icon.purple { background: #e0e7ff; color: #4f46e5; }
                .section-header h2 { font-size: 16px; font-weight: 600; color: #111827; margin: 0; }
                .section-header p { font-size: 13px; color: #6b7280; margin: 0; }
                .message {
                    padding: 10px 14px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 13px;
                }
                .message.success { background: #d1fae5; color: #059669; }
                .message.error { background: #fee2e2; color: #dc2626; }
                .form-container { display: flex; flex-direction: column; gap: 16px; }
                .field-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 6px;
                }
                .input-wrap { position: relative; }
                .input-wrap input {
                    width: 100%;
                    padding: 10px 44px 10px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    outline: none;
                    font-size: 14px;
                }
                .toggle-btn {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 0;
                }
                .submit-btn {
                    padding: 10px 18px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    align-self: flex-start;
                }

                @media (max-width: 768px) {
                    .section-card { padding: 20px 16px; }
                    .section-header h2 { font-size: 15px; }
                }
            `}</style>
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
        <div className="section-card">
            <div className="section-header">
                <div className="section-icon yellow"><Bell size={20} /></div>
                <div>
                    <h2>Notification Preferences</h2>
                    <p>Choose what notifications you'd like to receive</p>
                </div>
            </div>

            <div className="settings-list">
                {[
                    { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status' },
                    { key: 'promotions', label: 'Promotions', desc: 'Receive offers and discounts' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Weekly product updates' },
                    { key: 'productUpdates', label: 'Product Updates', desc: 'Wishlist item notifications' },
                ].map((item) => (
                    <div key={item.key} className="setting-row">
                        <div>
                            <p className="setting-label">{item.label}</p>
                            <p className="setting-desc">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                            className={`toggle ${settings[item.key] ? 'on' : ''}`}
                        >
                            <div className="toggle-handle" />
                        </button>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .section-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .section-icon {
                    padding: 10px;
                    border-radius: 10px;
                    display: flex;
                }
                .section-icon.yellow { background: #fef3c7; color: #d97706; }
                .section-header h2 { font-size: 16px; font-weight: 600; color: #111827; margin: 0; }
                .section-header p { font-size: 13px; color: #6b7280; margin: 0; }
                .settings-list { display: flex; flex-direction: column; gap: 12px; }
                .setting-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px;
                    background: #f9fafb;
                    border-radius: 10px;
                    gap: 12px;
                }
                .setting-label { font-weight: 500; font-size: 14px; margin: 0; }
                .setting-desc { font-size: 12px; color: #6b7280; margin: 2px 0 0; }
                .toggle {
                    width: 44px;
                    height: 24px;
                    border-radius: 12px;
                    border: none;
                    background: #d1d5db;
                    cursor: pointer;
                    position: relative;
                    flex-shrink: 0;
                }
                .toggle.on { background: #4f46e5; }
                .toggle-handle {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    transition: left 0.2s;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .toggle.on .toggle-handle { left: 22px; }

                @media (max-width: 768px) {
                    .section-card { padding: 20px 16px; }
                    .section-header h2 { font-size: 15px; }
                    .setting-row { padding: 12px; }
                }
            `}</style>
        </div>
    );
}

function DangerSection({ logout }) {
    return (
        <div className="section-card">
            <div className="section-header">
                <div className="section-icon red"><Shield size={20} /></div>
                <div>
                    <h2>Privacy & Security</h2>
                    <p>Manage your account security</p>
                </div>
            </div>

            <div className="danger-list">
                <div className="danger-item">
                    <h3>Logout from all devices</h3>
                    <p>This will log you out from all devices.</p>
                    <button onClick={() => { logout(); window.location.href = '/'; }} className="logout-btn">
                        Logout Everywhere
                    </button>
                </div>

                <div className="danger-item delete">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account. This cannot be undone.</p>
                    <button onClick={() => alert('Please contact support to delete your account.')} className="delete-btn">
                        <Trash2 size={14} /> Delete Account
                    </button>
                </div>
            </div>

            <style jsx>{`
                .section-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid #e2e8f0;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .section-icon {
                    padding: 10px;
                    border-radius: 10px;
                    display: flex;
                }
                .section-icon.red { background: #fee2e2; color: #dc2626; }
                .section-header h2 { font-size: 16px; font-weight: 600; color: #111827; margin: 0; }
                .section-header p { font-size: 13px; color: #6b7280; margin: 0; }
                .danger-list { display: flex; flex-direction: column; gap: 12px; }
                .danger-item {
                    padding: 16px;
                    background: #f9fafb;
                    border-radius: 10px;
                }
                .danger-item.delete {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                }
                .danger-item h3 { font-size: 14px; font-weight: 600; margin: 0 0 6px; }
                .danger-item.delete h3 { color: #dc2626; }
                .danger-item p { font-size: 12px; color: #6b7280; margin: 0 0 12px; }
                .logout-btn {
                    padding: 8px 14px;
                    background: #f3f4f6;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 13px;
                    cursor: pointer;
                }
                .delete-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    background: #dc2626;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 13px;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .section-card { padding: 20px 16px; }
                    .section-header h2 { font-size: 15px; }
                    .danger-item { padding: 14px; }
                }
            `}</style>
        </div>
    );
}

