"use client";

import { useEffect, useState, useRef } from 'react';
import { Camera, Edit2, Mail, Phone, Calendar, ShoppingBag, MapPin, Heart } from 'lucide-react';
import ImageCropperModal from '../../components/ImageCropperModal';
import { useAuth } from '../../context/AuthContext';
import { api, API_URL } from '../../services/api';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const res = await api.get('/users/me');
            setProfile(res);
            setFormData({ name: res.name || '', phone: res.phone || '' });
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const res = await api.patch('/users/me', formData);
            setProfile(res);
            setUser(prev => ({ ...prev, ...res }));
            setEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    }

    const [imgSrc, setImgSrc] = useState(null);

    // ... loadProfile ...

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setUploadingAvatar(false);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            // Clear input so same file can be selected again
            e.target.value = '';
        }
    }

    async function handleCropComplete(croppedBlob) {
        if (!croppedBlob) return;
        setImgSrc(null); // Close modal
        setUploadingAvatar(true);

        const formData = new FormData();
        formData.append('avatar', croppedBlob, 'avatar.webp');

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/users/me/avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(prev => ({ ...prev, avatar: data.avatar }));
                setUser(prev => ({ ...prev, avatar: data.avatar }));
            } else {
                alert(data.message || 'Failed to upload avatar');
            }
        } catch (error) {
            alert('Failed to upload avatar');
        } finally {
            setUploadingAvatar(false);
        }
    }

    const getAvatarUrl = (avatar) => avatar?.startsWith('http') ? avatar : `${API_URL}${avatar}`;
    // ...

    return (
        <div className="profile-page-content">
            {imgSrc && (
                <ImageCropperModal
                    imageSrc={imgSrc}
                    onCancel={() => setImgSrc(null)}
                    onComplete={handleCropComplete}
                />
            )}

            {/* Mobile-Only Header with Avatar */}
            <div className="mobile-profile-header">
                <div className="mobile-avatar">
                    {profile?.avatar ? (
                        <img src={getAvatarUrl(profile.avatar)} alt="" />
                    ) : (
                        <span>{profile?.name?.charAt(0).toUpperCase()}</span>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onSelectFile}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <button
                        className="avatar-edit-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                    >
                        {uploadingAvatar ? <div className="spinner"></div> : <Camera size={14} />}
                    </button>
                </div>
                <h2 className="mobile-name">{profile?.name}</h2>
                <p className="mobile-email">{profile?.email}</p>
            </div>

            {/* Desktop Title */}
            <div className="desktop-header">
                <h1>My Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-row">
                <div className="stat-box">
                    <div className="stat-icon-wrap orders"><ShoppingBag size={18} /></div>
                    <span className="stat-number">{profile?._count?.orders || 0}</span>
                    <span className="stat-text">Orders</span>
                </div>
                <div className="stat-box">
                    <div className="stat-icon-wrap wishlist"><Heart size={18} /></div>
                    <span className="stat-number">{profile?._count?.wishlist || 0}</span>
                    <span className="stat-text">Wishlist</span>
                </div>
                <div className="stat-box">
                    <div className="stat-icon-wrap address"><MapPin size={18} /></div>
                    <span className="stat-number">{profile?._count?.addresses || 0}</span>
                    <span className="stat-text">Addresses</span>
                </div>
            </div>

            {/* Account Info Card */}
            <div className="account-card">
                <div className="card-top">
                    <h3>Account Information</h3>
                    {!editing ? (
                        <button className="edit-btn" onClick={() => setEditing(true)}>
                            <Edit2 size={14} /> Edit
                        </button>
                    ) : (
                        <div className="edit-btns">
                            <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                            <button className="save-btn" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>
                <div className="account-fields">
                    <div className="field-row">
                        <label>Full Name</label>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="field-input"
                            />
                        ) : (
                            <p>{profile?.name}</p>
                        )}
                    </div>
                    <div className="field-row">
                        <label>Email Address</label>
                        <p>{profile?.email}</p>
                    </div>
                    <div className="field-row">
                        <label>Phone Number</label>
                        {editing ? (
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Add phone number"
                                className="field-input"
                            />
                        ) : (
                            <p>{profile?.phone || 'Not provided'}</p>
                        )}
                    </div>
                    <div className="field-row">
                        <label>Member Since</label>
                        <p>{new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .profile-page-content {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                /* Mobile Header - Hidden on Desktop */
                .mobile-profile-header {
                    display: none;
                }

                /* Desktop Header */
                .desktop-header {
                    margin-bottom: 32px;
                }
                .desktop-header h1 {
                    font-size: 28px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 6px;
                }
                .desktop-header p {
                    color: #64748b;
                    font-size: 15px;
                    margin: 0;
                }

                /* Stats Row */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .stat-box {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                }
                .stat-icon-wrap {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                }
                .stat-icon-wrap.orders { background: #eef2ff; color: #4f46e5; }
                .stat-icon-wrap.wishlist { background: #fef2f2; color: #ef4444; }
                .stat-icon-wrap.address { background: #f0fdf4; color: #22c55e; }
                .stat-number {
                    display: block;
                    font-size: 24px;
                    font-weight: 800;
                    color: #0f172a;
                }
                .stat-text {
                    font-size: 13px;
                    color: #64748b;
                }

                /* Account Card */
                .account-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    overflow: hidden;
                }
                .card-top {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .card-top h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }
                .edit-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                }
                .edit-btns { display: flex; gap: 8px; }
                .cancel-btn {
                    padding: 8px 14px;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .save-btn {
                    padding: 8px 16px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .account-fields {
                    padding: 24px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .field-row label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 6px;
                }
                .field-row p {
                    font-size: 15px;
                    font-weight: 500;
                    color: #334155;
                    margin: 0;
                    word-break: break-word;
                }
                .field-input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 15px;
                    outline: none;
                }

                .spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ========== MOBILE STYLES ========== */
                @media (max-width: 900px) {
                    .desktop-header { display: none; }

                    .mobile-profile-header {
                        display: block;
                        text-align: center;
                        padding: 20px 0 24px;
                        border-bottom: 1px solid #f1f5f9;
                        margin-bottom: 24px;
                    }
                    .mobile-avatar {
                        position: relative;
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 12px;
                    }
                    .mobile-avatar img, .mobile-avatar span {
                        width: 100%;
                        height: 100%;
                        border-radius: 24px;
                        object-fit: cover;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                        font-weight: 700;
                        color: white;
                        background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    }
                    .avatar-edit-btn {
                        position: absolute;
                        bottom: -4px;
                        right: -4px;
                        width: 28px;
                        height: 28px;
                        background: #0f172a;
                        color: white;
                        border: 2px solid white;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .mobile-name {
                        font-size: 20px;
                        font-weight: 700;
                        color: #0f172a;
                        margin: 0 0 4px;
                    }
                    .mobile-email {
                        font-size: 13px;
                        color: #64748b;
                        margin: 0;
                    }

                    .stats-row {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 10px;
                    }
                    .stat-box {
                        padding: 14px 8px;
                        border-radius: 14px;
                    }
                    .stat-icon-wrap {
                        width: 32px;
                        height: 32px;
                        margin-bottom: 8px;
                    }
                    .stat-number { font-size: 18px; }
                    .stat-text { font-size: 11px; }

                    .account-fields {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .card-top {
                        padding: 16px 20px;
                    }
                    .account-fields {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
}

