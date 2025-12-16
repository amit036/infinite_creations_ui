"use client";

import { useEffect, useState } from 'react';
import { Search, Eye, ChevronDown } from 'lucide-react';
import { api, API_URL } from '../../../services/api';

const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [page, statusFilter]);

    async function loadOrders() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '10');
            if (statusFilter) params.set('status', statusFilter);

            const res = await api.get(`/orders?${params.toString()}`);
            setOrders(res?.data || []);
            setMeta(res?.meta || { total: 0, totalPages: 1 });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function updateOrderStatus(orderId, status) {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            loadOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (e) {
            alert('Failed to update order status');
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            PENDING: { bg: '#fef3c7', text: '#b45309' },
            CONFIRMED: { bg: '#dbeafe', text: '#1d4ed8' },
            SHIPPED: { bg: '#e0e7ff', text: '#4f46e5' },
            DELIVERED: { bg: '#d1fae5', text: '#059669' },
            CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
        };
        return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Orders</h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>{meta.total} orders total</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    style={{
                        padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px',
                        outline: 'none', background: 'white', minWidth: '160px'
                    }}
                >
                    <option value="">All Statuses</option>
                    {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: '#6b7280' }}>
                        No orders found
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Order</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Customer</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Items</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total</th>
                                <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const statusStyle = getStatusColor(order.status);
                                return (
                                    <tr key={order.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, color: '#111827' }}>{order.orderNumber}</p>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div>
                                                <p style={{ fontWeight: 500, color: '#111827' }}>{order.customer?.name || order.shippingName}</p>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>{order.customer?.email}</p>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', color: '#6b7280' }}>
                                            {order.items?.length || 0} items
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                style={{
                                                    padding: '6px 12px', borderRadius: '20px', border: 'none',
                                                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                                                    background: statusStyle.bg, color: statusStyle.text
                                                }}
                                            >
                                                {statusOptions.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                style={{
                                                    padding: '8px 16px', background: '#f3f4f6', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', gap: '6px', marginLeft: 'auto'
                                                }}
                                            >
                                                <Eye size={16} /> View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    border: 'none', fontWeight: 500, cursor: 'pointer',
                                    background: p === page ? '#4f46e5' : '#f3f4f6',
                                    color: p === page ? 'white' : '#6b7280'
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={updateOrderStatus}
                    getStatusColor={getStatusColor}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function OrderDetailModal({ order, onClose, onStatusChange, getStatusColor }) {
    const statusStyle = getStatusColor(order.status);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '640px',
                maxHeight: '90vh', overflow: 'auto'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Order {order.orderNumber}</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ padding: '24px' }}>
                    {/* Status */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                            Order Status
                        </label>
                        <select
                            value={order.status}
                            onChange={(e) => onStatusChange(order.id, e.target.value)}
                            style={{
                                padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db',
                                fontSize: '14px', fontWeight: 500, cursor: 'pointer', background: 'white'
                            }}
                        >
                            {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Customer Info */}
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                        <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Shipping Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                            <div>
                                <p style={{ color: '#6b7280' }}>Name</p>
                                <p style={{ color: '#111827', fontWeight: 500 }}>{order.shippingName}</p>
                            </div>
                            <div>
                                <p style={{ color: '#6b7280' }}>Phone</p>
                                <p style={{ color: '#111827', fontWeight: 500 }}>{order.shippingPhone}</p>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <p style={{ color: '#6b7280' }}>Address</p>
                                <p style={{ color: '#111827', fontWeight: 500 }}>
                                    {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZip}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Order Items</h3>
                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                            {order.items?.map((item, i) => (
                                <div key={item.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', borderTop: i > 0 ? '1px solid #e5e7eb' : 'none'
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '8px',
                                        background: '#f3f4f6', overflow: 'hidden', flexShrink: 0
                                    }}>
                                        {item.product?.images?.[0] ? (
                                            <img src={item.product.images[0].startsWith('http') ? item.product.images[0] : `${API_URL}${item.product.images[0]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 500, color: '#111827' }}>{item.product?.name || 'Product'}</p>
                                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                    </div>
                                    <p style={{ fontWeight: 600, color: '#111827' }}>
                                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>Total Amount</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                            ₹{Number(order.totalAmount).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
