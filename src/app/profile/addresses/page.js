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
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>My Addresses</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>{addresses.length} saved addresses</p>
                </div>
                <button
                    onClick={() => { setEditAddress(null); setShowModal(true); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 20px', background: '#4f46e5', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> Add Address
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : addresses.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '64px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 24px',
                        background: '#f3f4f6', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <MapPin size={32} color="#9ca3af" />
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>No addresses yet</h3>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Add your first address for faster checkout</p>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '12px 24px', background: '#4f46e5', color: 'white',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        Add Address
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            style={{
                                background: 'white', borderRadius: '12px', padding: '20px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative',
                                border: addr.isDefault ? '2px solid #4f46e5' : '2px solid transparent'
                            }}
                        >
                            {addr.isDefault && (
                                <span style={{
                                    position: 'absolute', top: '-10px', right: '12px',
                                    background: '#4f46e5', color: 'white', padding: '4px 12px',
                                    borderRadius: '12px', fontSize: '12px', fontWeight: 600
                                }}>
                                    Default
                                </span>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{
                                    padding: '6px', background: '#e0e7ff', borderRadius: '6px',
                                    color: '#4f46e5'
                                }}>
                                    {getLabelIcon(addr.label)}
                                </div>
                                <span style={{ fontWeight: 600, color: '#111827' }}>{addr.label}</span>
                            </div>

                            <p style={{ fontWeight: 500, marginBottom: '4px' }}>{addr.name}</p>
                            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>
                                {addr.address}<br />
                                {addr.city}, {addr.state} {addr.zip}<br />
                                {addr.country}
                            </p>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>📞 {addr.phone}</p>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button
                                    onClick={() => { setEditAddress(addr); setShowModal(true); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
                                        background: 'white', cursor: 'pointer', fontSize: '13px'
                                    }}
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
                                            background: 'white', cursor: 'pointer', fontSize: '13px'
                                        }}
                                    >
                                        <Check size={14} /> Set Default
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        padding: '6px 12px', border: '1px solid #fecaca', borderRadius: '6px',
                                        background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px'
                                    }}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddressModal
                    address={editAddress}
                    onClose={() => setShowModal(false)}
                    onSave={() => { setShowModal(false); loadAddresses(); }}
                />
            )}
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
