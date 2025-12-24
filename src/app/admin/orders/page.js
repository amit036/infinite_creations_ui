"use client";

import { useEffect, useState } from 'react';
import { Eye, Plus, MapPin, Link2, Check, CheckCircle, XCircle } from 'lucide-react';
import { api, API_URL } from '../../../services/api';

// Order statuses in sequence
const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_OF_DELIVERY', 'DELIVERED', 'CANCELLED'];

// Tracking presets mapped to order status (in sequential order)
// First one is auto-added when order status changes
const TRACKING_PRESETS = {
    PENDING: ['Order Received', 'Order Processing'],
    CONFIRMED: ['Order Confirmed', 'Preparing for Packing', 'Packed'],
    SHIPPED: ['Ready for Pickup', 'Handed to Courier', 'In Transit', 'Reached Local Hub'],
    OUT_OF_DELIVERY: ['Out for Delivery', 'Nearby Your Location'],
    DELIVERED: ['Delivered'],
    CANCELLED: ['Order Cancelled', 'Refund Initiated', 'Refund Completed']
};

// First tracking status for each order status (auto-added when status changes)
const FIRST_TRACKING_STATUS = {
    PENDING: 'Order Received',
    CONFIRMED: 'Order Confirmed',
    SHIPPED: 'Ready for Pickup',
    OUT_OF_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
    CANCELLED: 'Order Cancelled'
};

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
            const res = await api.patch(`/orders/${orderId}/status`, { status });
            loadOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
            return res;
        } catch (e) {
            alert('Failed to update order status');
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            PENDING: { bg: '#fef3c7', text: '#b45309' },
            CONFIRMED: { bg: '#dbeafe', text: '#1d4ed8' },
            SHIPPED: { bg: '#e0e7ff', text: '#4f46e5' },
            OUT_OF_DELIVERY: { bg: '#ffedd5', text: '#ea580c' },
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
                        outline: 'none', background: 'white', minWidth: '180px'
                    }}
                >
                    <option value="">All Statuses</option>
                    {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
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
                                            <span style={{
                                                padding: '6px 12px', borderRadius: '20px',
                                                fontSize: '11px', fontWeight: 600,
                                                background: statusStyle.bg, color: statusStyle.text,
                                                whiteSpace: 'nowrap', display: 'inline-block'
                                            }}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                style={{
                                                    padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none',
                                                    borderRadius: '6px', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', gap: '6px', marginLeft: 'auto', fontWeight: 500
                                                }}
                                            >
                                                <Eye size={16} /> Manage
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
                    onOrderUpdate={(updatedOrder) => {
                        setSelectedOrder(updatedOrder);
                        loadOrders();
                    }}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function OrderDetailModal({ order, onClose, onStatusChange, getStatusColor, onOrderUpdate }) {
    const [tracking, setTracking] = useState([]);
    const [loadingTracking, setLoadingTracking] = useState(true);
    const [newTrackingLocation, setNewTrackingLocation] = useState('');
    const [newTrackingDescription, setNewTrackingDescription] = useState('');
    const [addingTracking, setAddingTracking] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentOrderStatus, setCurrentOrderStatus] = useState(order.status);

    useEffect(() => {
        loadTracking();
        setCurrentOrderStatus(order.status);
    }, [order.id, order.status]);

    async function loadTracking() {
        setLoadingTracking(true);
        try {
            const res = await api.get(`/orders/${order.id}/tracking`);
            setTracking(res || []);
        } catch (e) {
            console.error(e);
        }
        setLoadingTracking(false);
    }

    async function addTracking(status) {
        if (!status) return;
        setAddingTracking(true);
        try {
            const res = await api.post(`/orders/${order.id}/tracking`, {
                status,
                description: newTrackingDescription || null,
                location: newTrackingLocation || null
            });

            setNewTrackingDescription('');
            setNewTrackingLocation('');
            loadTracking();

            // If order status was updated, refresh
            if (res.orderStatusUpdated) {
                setCurrentOrderStatus(res.newOrderStatus);
                onOrderUpdate({ ...order, status: res.newOrderStatus });
                // Reload tracking after status change (to get auto-added first tracking)
                setTimeout(() => loadTracking(), 300);
            }
        } catch (e) {
            alert('Failed to add tracking update');
        }
        setAddingTracking(false);
    }



    const copyTrackingLink = () => {
        const trackingId = order.trackingToken || order.orderNumber;
        const url = `${window.location.origin}/track/${trackingId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Get used tracking statuses
    const usedTrackingStatuses = tracking.map(t => t.status);

    // Get the NEXT single tracking status (sequential - one at a time)
    const getNextTrackingStatus = () => {
        let currentPresets = TRACKING_PRESETS[currentOrderStatus] || [];

        // For CANCELLED with COD, only "Order Cancelled"
        if (currentOrderStatus === 'CANCELLED') {
            const isCOD = order.paymentMethod === 'COD' || order.paymentType === 'COD';
            if (isCOD) {
                currentPresets = ['Order Cancelled'];
            }
        }

        // Find the next unused status in sequence
        for (const preset of currentPresets) {
            if (!usedTrackingStatuses.includes(preset)) {
                return preset;
            }
        }

        return null;
    };

    // Check if all tracking for current order status is complete
    const isCurrentStatusTrackingComplete = () => {
        let currentPresets = TRACKING_PRESETS[currentOrderStatus] || [];

        if (currentOrderStatus === 'CANCELLED') {
            const isCOD = order.paymentMethod === 'COD' || order.paymentType === 'COD';
            if (isCOD) {
                currentPresets = ['Order Cancelled'];
            }
        }

        return currentPresets.every(preset => usedTrackingStatuses.includes(preset));
    };

    // Get next order status
    const getNextOrderStatus = () => {
        if (currentOrderStatus === 'DELIVERED' || currentOrderStatus === 'CANCELLED') return null;

        const statusOrder = ['PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_OF_DELIVERY', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(currentOrderStatus);

        if (currentIndex < statusOrder.length - 1) {
            return statusOrder[currentIndex + 1];
        }
        return null;
    };

    // Can cancel only if PENDING or CONFIRMED
    const canCancel = currentOrderStatus === 'PENDING' || currentOrderStatus === 'CONFIRMED';

    const statusStyle = getStatusColor(currentOrderStatus);
    const nextTrackingStatus = getNextTrackingStatus();
    const trackingComplete = isCurrentStatusTrackingComplete();
    const nextOrderStatus = getNextOrderStatus();

    const handleStatusChange = async (newStatus) => {
        await onStatusChange(order.id, newStatus);
        setCurrentOrderStatus(newStatus);
        // Reload tracking to get auto-added first tracking status
        setTimeout(() => loadTracking(), 300);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '800px',
                maxHeight: '90vh', overflow: 'auto'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Order {order.orderNumber}</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={copyTrackingLink}
                            style={{
                                padding: '8px 12px', background: '#e0e7ff', border: 'none', borderRadius: '6px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#4f46e5', fontWeight: 500
                            }}
                        >
                            {copied ? <><Check size={16} /> Copied!</> : <><Link2 size={16} /> Track Link</>}
                        </button>
                        <button onClick={onClose} style={{ padding: '8px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                    </div>
                </div>

                <div style={{ padding: '24px' }}>
                    {/* Current Status Card */}
                    <div style={{ marginBottom: '24px', padding: '20px', background: statusStyle.bg, borderRadius: '12px', border: `2px solid ${statusStyle.text}30` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: statusStyle.text, marginBottom: '4px', fontWeight: 500 }}>Current Status</p>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: statusStyle.text }}>
                                    {currentOrderStatus.replace(/_/g, ' ')}
                                </p>
                            </div>

                            {/* Cancel Button - Only for PENDING and CONFIRMED */}
                            {canCancel && (
                                <button
                                    onClick={() => handleStatusChange('CANCELLED')}
                                    style={{
                                        padding: '10px 20px', borderRadius: '8px', border: 'none',
                                        background: '#fee2e2', color: '#dc2626',
                                        fontWeight: 600, cursor: 'pointer', fontSize: '14px',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <XCircle size={18} /> Cancel Order
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <h3 style={{ fontWeight: 600, color: '#166534', marginBottom: '12px' }}>Payment Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '14px' }}>
                            <div>
                                <p style={{ color: '#6b7280' }}>Method</p>
                                <p style={{ color: '#111827', fontWeight: 500 }}>{order.paymentMethod || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ color: '#6b7280' }}>Type</p>
                                <p style={{ color: '#111827', fontWeight: 500 }}>{order.paymentType || 'N/A'}</p>
                            </div>
                            <div>
                                <p style={{ color: '#6b7280' }}>Status</p>
                                <p style={{
                                    fontWeight: 600,
                                    color: order.paymentStatus === 'PAID' ? '#059669' : order.paymentStatus === 'FAILED' ? '#dc2626' : '#f59e0b'
                                }}>
                                    {order.paymentStatus || 'PENDING'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
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

                    {/* ===== TRACKING MANAGEMENT ===== */}
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                        <h3 style={{ fontWeight: 600, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={20} /> Tracking Updates
                        </h3>

                        {/* Next Tracking Status Button */}
                        {nextTrackingStatus && (
                            <div style={{ marginBottom: '16px', padding: '16px', background: 'white', borderRadius: '8px' }}>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                                    Next tracking update:
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Location (Optional)</label>
                                        <input
                                            type="text"
                                            value={newTrackingLocation}
                                            onChange={(e) => setNewTrackingLocation(e.target.value)}
                                            placeholder="e.g., Mumbai Hub"
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Description (Optional)</label>
                                        <input
                                            type="text"
                                            value={newTrackingDescription}
                                            onChange={(e) => setNewTrackingDescription(e.target.value)}
                                            placeholder="Additional details..."
                                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => addTracking(nextTrackingStatus)}
                                    disabled={addingTracking}
                                    style={{
                                        padding: '12px 24px', background: '#4f46e5', color: 'white', border: 'none',
                                        borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                        opacity: addingTracking ? 0.5 : 1, fontWeight: 600, fontSize: '14px'
                                    }}
                                >
                                    <Plus size={18} /> Add "{nextTrackingStatus}"
                                </button>
                            </div>
                        )}

                        {/* Show next order status button when tracking for current status is complete */}
                        {trackingComplete && nextOrderStatus && (
                            <div style={{ marginBottom: '16px', padding: '16px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleStatusChange(nextOrderStatus)}
                                    style={{
                                        padding: '12px 24px', borderRadius: '8px', border: 'none',
                                        background: getStatusColor(nextOrderStatus).bg,
                                        color: getStatusColor(nextOrderStatus).text,
                                        fontWeight: 600, cursor: 'pointer', fontSize: '14px'
                                    }}
                                >
                                    Move to {nextOrderStatus.replace(/_/g, ' ')} →
                                </button>
                            </div>
                        )}

                        {/* Order completed/cancelled message */}
                        {(currentOrderStatus === 'DELIVERED' || (currentOrderStatus === 'CANCELLED' && !nextTrackingStatus)) && (
                            <div style={{
                                marginBottom: '16px', padding: '24px',
                                background: currentOrderStatus === 'DELIVERED' ? '#d1fae5' : '#fee2e2',
                                borderRadius: '8px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {currentOrderStatus === 'DELIVERED' ? (
                                    <>
                                        <CheckCircle size={40} color="#059669" style={{ marginBottom: '12px' }} />
                                        <p style={{ color: '#059669', fontWeight: 600, fontSize: '16px' }}>Order Delivered Successfully!</p>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={40} color="#dc2626" style={{ marginBottom: '12px' }} />
                                        <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '16px' }}>Order Cancelled</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tracking History */}
                        {loadingTracking ? (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '16px' }}>Loading tracking...</p>
                        ) : tracking.length === 0 ? (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '16px' }}>No tracking updates yet</p>
                        ) : (
                            <div style={{ position: 'relative', paddingLeft: '24px' }}>
                                <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', background: '#bfdbfe' }} />
                                {tracking.map((t, index) => (
                                    <div key={t.id} style={{ marginBottom: '16px', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '-24px', width: '16px', height: '16px',
                                            borderRadius: '50%', background: index === 0 ? '#4f46e5' : '#bfdbfe',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div>
                                                <p style={{ fontWeight: 600, color: '#1e40af' }}>{t.status}</p>
                                                {t.description && <p style={{ fontSize: '14px', color: '#6b7280' }}>{t.description}</p>}
                                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                                    <span>{new Date(t.createdAt).toLocaleString()}</span>
                                                    {t.location && <span>📍 {t.location}</span>}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                            ₹{Number(order.totalAmount).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
