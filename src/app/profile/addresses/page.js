"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Check, Home, Briefcase } from 'lucide-react';
import { api } from '../../../services/api';

export default function AddressesPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editAddress, setEditAddress] = useState(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {
        try {
            const res = await api.get('/users/me/addresses');
            setAddresses(res || []);
        } catch (error) {
            console.error('Failed to load addresses:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/users/me/addresses/${id}`);
            loadAddresses();
        } catch (error) {
            alert('Failed to delete address');
        }
    }

    async function handleSetDefault(id) {
        try {
            await api.post(`/users/me/addresses/${id}/default`);
            loadAddresses();
        } catch (error) {
            alert('Failed to set default address');
        }
    }

    const getLabelIcon = (label) => {
        switch (label?.toLowerCase()) {
            case 'work': return <Briefcase size={16} />;
            case 'home': default: return <Home size={16} />;
        }
    };

    return (
        <div className="addresses-page">
            <div className="page-header">
                <div>
                    <h1>My Addresses</h1>
                    <p>{addresses.length} saved addresses</p>
                </div>
                <button
                    onClick={() => { setEditAddress(null); setShowModal(true); }}
                    className="add-btn"
                >
                    <Plus size={18} /> Add Address
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : addresses.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <MapPin size={32} color="#9ca3af" />
                    </div>
                    <h3>No addresses yet</h3>
                    <p>Add your first address for faster checkout</p>
                    <button onClick={() => setShowModal(true)} className="add-btn">
                        Add Address
                    </button>
                </div>
            ) : (
                <div className="address-grid">
                    {addresses.map((addr) => (
                        <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                            {addr.isDefault && <span className="default-badge">Default</span>}
                            <div className="label-row">
                                <div className="label-icon">{getLabelIcon(addr.label)}</div>
                                <span className="label-text">{addr.label}</span>
                            </div>
                            <p className="name">{addr.name}</p>
                            <p className="address-text">
                                {addr.address}<br />
                                {addr.city}, {addr.state} {addr.zip}<br />
                                {addr.country}
                            </p>
                            <p className="phone">📞 {addr.phone}</p>
                            <div className="actions">
                                <button onClick={() => { setEditAddress(addr); setShowModal(true); }} className="action-btn">
                                    <Edit2 size={14} /> Edit
                                </button>
                                {!addr.isDefault && (
                                    <button onClick={() => handleSetDefault(addr.id)} className="action-btn">
                                        <Check size={14} /> Set Default
                                    </button>
                                )}
                                <button onClick={() => handleDelete(addr.id)} className="action-btn delete">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <AddressModal
                    address={editAddress}
                    onClose={() => setShowModal(false)}
                    onSave={() => { setShowModal(false); loadAddresses(); }}
                />
            )}

            <style jsx>{`
                .addresses-page { width: 100%; }
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    gap: 16px;
                }
                .page-header h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0; }
                .page-header p { color: #6b7280; margin: 4px 0 0; font-size: 14px; }
                .add-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 16px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .loading-container {
                    display: flex;
                    justify-content: center;
                    padding: 64px;
                }
                .spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #4f46e5;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .empty-state {
                    background: white;
                    border-radius: 16px;
                    padding: 48px 24px;
                    text-align: center;
                    border: 1px solid #e2e8f0;
                }
                .empty-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 20px;
                    background: #f3f4f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .empty-state h3 { font-weight: 600; margin-bottom: 8px; }
                .empty-state p { color: #6b7280; margin-bottom: 20px; font-size: 14px; }
                .empty-state .add-btn {
                    display: inline-flex;
                    margin: 0 auto;
                }
                .address-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }
                .address-card {
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    position: relative;
                }
                .address-card.default { border-color: #4f46e5; }
                .default-badge {
                    position: absolute;
                    top: -8px;
                    right: 12px;
                    background: #4f46e5;
                    color: white;
                    padding: 3px 10px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 600;
                }
                .label-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                }
                .label-icon {
                    padding: 5px;
                    background: #e0e7ff;
                    border-radius: 6px;
                    color: #4f46e5;
                    display: flex;
                }
                .label-text { font-weight: 600; color: #111827; font-size: 14px; }
                .name { font-weight: 500; margin-bottom: 4px; font-size: 14px; }
                .address-text { color: #6b7280; font-size: 13px; line-height: 1.5; }
                .phone { color: #6b7280; font-size: 13px; margin-top: 8px; }
                .actions {
                    display: flex;
                    gap: 6px;
                    margin-top: 12px;
                    flex-wrap: wrap;
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 5px 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: white;
                    cursor: pointer;
                    font-size: 12px;
                }
                .action-btn.delete {
                    border-color: #fecaca;
                    background: #fef2f2;
                    color: #dc2626;
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .page-header h1 { font-size: 20px; }
                    .add-btn { padding: 8px 14px; font-size: 13px; }
                    .address-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

function AddressModal({ address, onClose, onSave }) {
    const [form, setForm] = useState({
        label: address?.label || 'Home',
        name: address?.name || '',
        phone: address?.phone || '',
        address: address?.address || '',
        city: address?.city || '',
        state: address?.state || '',
        zip: address?.zip || '',
        country: address?.country || 'USA',
        isDefault: address?.isDefault || false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (address) {
                await api.patch(`/users/me/addresses/${address.id}`, form);
            } else {
                await api.post('/users/me/addresses', form);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px',
                maxHeight: '90vh', overflow: 'auto'
            }}>
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                        {address ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button onClick={onClose} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {error && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Label */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Address Type</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['Home', 'Work', 'Other'].map((label) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => setForm({ ...form, label })}
                                        style={{
                                            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                                            background: form.label === label ? '#e0e7ff' : '#f3f4f6',
                                            border: form.label === label ? '2px solid #4f46e5' : '2px solid transparent',
                                            color: form.label === label ? '#4f46e5' : '#6b7280',
                                            fontWeight: 500
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Full Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Phone *</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Street Address *</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>City *</label>
                                <input
                                    type="text"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>State *</label>
                                <input
                                    type="text"
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>ZIP Code *</label>
                                <input
                                    type="text"
                                    value={form.zip}
                                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Country</label>
                                <input
                                    type="text"
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <span style={{ fontSize: '14px' }}>Set as default address</span>
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
                                background: '#4f46e5', color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 600, opacity: loading ? 0.5 : 1
                            }}
                        >
                            {loading ? 'Saving...' : address ? 'Update' : 'Add Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
