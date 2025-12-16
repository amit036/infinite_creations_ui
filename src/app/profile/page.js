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
        <div>
            {imgSrc && (
                <ImageCropperModal
                    imageSrc={imgSrc}
                    onCancel={() => setImgSrc(null)}
                    onComplete={handleCropComplete}
                />
            )}
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>My Profile</h1>


            {/* Profile Card */}
            <div style={{
                background: 'white', borderRadius: '16px', padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
            }}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'start' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            background: '#e0e7ff', overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '4px solid #c7d2fe'
                        }}>
                            {profile?.avatar ? (
                                <img src={getAvatarUrl(profile.avatar)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '48px', color: '#4f46e5', fontWeight: 'bold' }}>
                                    {profile?.name?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={onSelectFile}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            style={{
                                position: 'absolute', bottom: '0', right: '0',
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: '#4f46e5', color: 'white', border: '3px solid white',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            {uploadingAvatar ? '...' : <Camera size={16} />}
                        </button>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{
                                            fontSize: '24px', fontWeight: 'bold', padding: '4px 8px',
                                            border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none'
                                        }}
                                    />
                                ) : (
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{profile?.name}</h2>
                                )}
                                <p style={{ color: '#6b7280', marginTop: '4px' }}>Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            </div>
                            {editing ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setEditing(false)}
                                        style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        style={{
                                            padding: '8px 20px', background: '#4f46e5', color: 'white',
                                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                                        }}
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 16px', background: '#f3f4f6', border: 'none',
                                        borderRadius: '8px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', background: '#e0e7ff', borderRadius: '10px' }}>
                                    <Mail size={20} color="#4f46e5" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Email</p>
                                    <p style={{ fontWeight: 500 }}>{profile?.email}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', background: '#d1fae5', borderRadius: '10px' }}>
                                    <Phone size={20} color="#059669" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Phone</p>
                                    {editing ? (
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Add phone number"
                                            style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none' }}
                                        />
                                    ) : (
                                        <p style={{ fontWeight: 500 }}>{profile?.phone || 'Not added'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{
                    background: 'white', borderRadius: '12px', padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <div style={{
                        width: '48px', height: '48px', margin: '0 auto 12px',
                        background: '#e0e7ff', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ShoppingBag size={24} color="#4f46e5" />
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{profile?._count?.orders || 0}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Orders</p>
                </div>
                <div style={{
                    background: 'white', borderRadius: '12px', padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <div style={{
                        width: '48px', height: '48px', margin: '0 auto 12px',
                        background: '#fce7f3', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Heart size={24} color="#ec4899" />
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{profile?._count?.wishlist || 0}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Wishlist</p>
                </div>
                <div style={{
                    background: 'white', borderRadius: '12px', padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <div style={{
                        width: '48px', height: '48px', margin: '0 auto 12px',
                        background: '#d1fae5', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <MapPin size={24} color="#059669" />
                    </div>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{profile?._count?.addresses || 0}</p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Addresses</p>
                </div>
            </div>
        </div>
    );
}
