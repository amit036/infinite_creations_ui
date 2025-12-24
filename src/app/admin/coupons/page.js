"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { api } from '../../../services/api';

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editCoupon, setEditCoupon] = useState(null);

    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        setLoading(true);
        try {
            const res = await api.get('/coupons');
            setCoupons(res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            loadCoupons();
        } catch (e) {
            alert('Failed to delete coupon');
        }
    }

    async function toggleActive(coupon) {
        try {
            await api.patch(`/coupons/${coupon.id}`, { active: !coupon.active });
            loadCoupons();
        } catch (e) {
            alert('Failed to update coupon');
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Coupons & Promotions</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>{coupons.length} coupons total</p>
                </div>
                <button
                    onClick={() => { setEditCoupon(null); setShowModal(true); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 20px', background: '#4f46e5', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> Add Coupon
                </button>
            </div>

            {/* Coupons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : coupons.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#6b7280' }}>
                        No coupons found. Create your first coupon!
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            style={{
                                background: 'white', borderRadius: '12px', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                opacity: coupon.active ? 1 : 0.6
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '20px', borderBottom: '1px dashed #e5e7eb',
                                background: coupon.discountType === 'percentage' ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '6px 12px', background: 'white', borderRadius: '20px'
                                    }}>
                                        <Tag size={16} color="#4f46e5" />
                                        <span style={{ fontWeight: 700, color: '#4f46e5', letterSpacing: '1px' }}>{coupon.code}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => { setEditCoupon(coupon); setShowModal(true); }}
                                            style={{ padding: '6px', background: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            <Edit size={14} color="#6b7280" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            style={{ padding: '6px', background: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={14} color="#dc2626" />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                                    <span style={{ fontSize: '36px', fontWeight: 'bold', color: coupon.discountType === 'percentage' ? '#4f46e5' : '#059669' }}>
                                        {coupon.discountType === 'percentage' ? `${Number(coupon.discountValue)}%` : `₹${Number(coupon.discountValue)}`}
                                    </span>
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>OFF</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{ padding: '16px' }}>
                                {coupon.description && (
                                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>{coupon.description}</p>
                                )}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                    {coupon.minOrderValue && (
                                        <span style={{ padding: '4px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '12px', color: '#6b7280' }}>
                                            Min: ₹{Number(coupon.minOrderValue)}
                                        </span>
                                    )}
                                    {coupon.maxUses && (
                                        <span style={{ padding: '4px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '12px', color: '#6b7280' }}>
                                            Uses: {coupon.usedCount}/{coupon.maxUses}
                                        </span>
                                    )}
                                    {coupon.expiresAt && (
                                        <span style={{ padding: '4px 8px', background: new Date(coupon.expiresAt) < new Date() ? '#fee2e2' : '#f3f4f6', borderRadius: '4px', fontSize: '12px', color: new Date(coupon.expiresAt) < new Date() ? '#dc2626' : '#6b7280' }}>
                                            {new Date(coupon.expiresAt) < new Date() ? 'Expired' : `Expires: ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                                        </span>
                                    )}
                                    {coupon.firstOrderOnly && (
                                        <span style={{ padding: '4px 8px', background: '#e0e7ff', borderRadius: '4px', fontSize: '12px', color: '#4f46e5', fontWeight: 600 }}>
                                            First Order Only
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => toggleActive(coupon)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                        background: coupon.active ? '#d1fae5' : '#f3f4f6',
                                        color: coupon.active ? '#059669' : '#6b7280',
                                        fontWeight: 500, fontSize: '14px'
                                    }}
                                >
                                    {coupon.active ? '✓ Active' : 'Inactive'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CouponModal
                    coupon={editCoupon}
                    onClose={() => setShowModal(false)}
                    onSave={() => { setShowModal(false); loadCoupons(); }}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function CouponModal({ coupon, onClose, onSave }) {
    const [form, setForm] = useState({
        code: coupon?.code || '',
        description: coupon?.description || '',
        discountType: coupon?.discountType || 'percentage',
        discountValue: coupon?.discountValue || '',
        minOrderValue: coupon?.minOrderValue || '',
        maxUses: coupon?.maxUses || '',
        expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
        firstOrderOnly: coupon?.firstOrderOnly || false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                code: form.code,
                description: form.description || null,
                discountType: form.discountType,
                discountValue: form.discountValue,
                minOrderValue: form.minOrderValue || null,
                maxUses: form.maxUses || null,
                expiresAt: form.expiresAt || null,
                firstOrderOnly: form.firstOrderOnly
            };

            if (coupon) {
                await api.patch(`/coupons/${coupon.id}`, data);
            } else {
                await api.post('/coupons', data);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to save coupon');
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
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px',
                maxHeight: '90vh', overflow: 'auto'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                        {coupon ? 'Edit Coupon' : 'Add Coupon'}
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
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Coupon Code *</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                required
                                placeholder="e.g. SAVE20"
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', textTransform: 'uppercase' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Description</label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="e.g. 20% off your order"
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Discount Type *</label>
                                <select
                                    value={form.discountType}
                                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: 'white' }}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Discount Value *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.discountValue}
                                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                                    required
                                    placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 10'}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Min Order Value</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.minOrderValue}
                                    onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                                    placeholder="Optional"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Max Uses</label>
                                <input
                                    type="number"
                                    value={form.maxUses}
                                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                                    placeholder="Unlimited"
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Expires At</label>
                            <input
                                type="date"
                                value={form.expiresAt}
                                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                            <input
                                type="checkbox"
                                id="firstOrderOnly"
                                checked={form.firstOrderOnly}
                                onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="firstOrderOnly" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                                Valid for first order only
                            </label>
                        </div>
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
                            {loading ? 'Saving...' : coupon ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
