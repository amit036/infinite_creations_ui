"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, Eye, ChevronDown, Filter, Download, Loader2, MapPin } from 'lucide-react';
import { api, API_URL } from '../../../services/api';
import { formatPrice, getImageUrl } from '../../../utils/helpers';

export default function ProfileOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await api.get('/orders/my-orders');
            setOrders(res || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            PENDING: { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' },
            CONFIRMED: { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },
            SHIPPED: { bg: '#e0e7ff', text: '#4f46e5', border: '#a5b4fc' },
            OUT_OF_DELIVERY: { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' },
            DELIVERED: { bg: '#d1fae5', text: '#059669', border: '#6ee7b7' },
            CANCELLED: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
        };
        return colors[status] || { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
    };

    const downloadInvoice = async (orderId, orderNumber) => {
        setDownloadingId(orderId);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download invoice');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice-${orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>My Orders</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>{orders.length} total orders</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={18} color="#6b7280" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px',
                            outline: 'none', background: 'white', cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Orders</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '64px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 24px',
                        background: '#f3f4f6', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ShoppingBag size={32} color="#9ca3af" />
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>
                        {filter === 'all' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Start shopping to see your orders here</p>
                    <Link href="/shop" style={{
                        padding: '12px 24px', background: '#4f46e5', color: 'white',
                        borderRadius: '8px', fontWeight: 600, textDecoration: 'none', display: 'inline-block'
                    }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredOrders.map((order) => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                            <div
                                key={order.id}
                                style={{
                                    background: 'white', borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'
                                }}
                            >
                                {/* Header */}
                                <div style={{
                                    padding: '20px 24px', background: '#f9fafb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    borderBottom: '1px solid #e5e7eb'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Order Number</p>
                                            <p style={{ fontWeight: 600, color: '#4f46e5' }}>{order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Date</p>
                                            <p style={{ fontWeight: 500 }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>Total</p>
                                            <p style={{ fontWeight: 600 }}>{formatPrice(order.totalAmount)}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '6px 16px', borderRadius: '20px', fontWeight: 500, fontSize: '13px',
                                        background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`
                                    }}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Items */}
                                <div style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                        {order.items?.slice(0, 4).map((item) => (
                                            <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '56px', height: '56px', borderRadius: '8px',
                                                    background: '#f3f4f6', overflow: 'hidden', flexShrink: 0
                                                }}>
                                                    {item.product?.images?.[0] ? (
                                                        <img
                                                            src={getImageUrl(item.product.images[0])}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{item.product?.name}</p>
                                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items?.length > 4 && (
                                            <div style={{
                                                width: '56px', height: '56px', borderRadius: '8px',
                                                background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#6b7280', fontWeight: 600, fontSize: '14px'
                                            }}>
                                                +{order.items.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    {order.couponCode && (
                                        <div style={{ marginTop: '16px', padding: '10px 16px', background: '#d1fae5', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#059669', fontWeight: 500, fontSize: '14px' }}>
                                                Coupon: {order.couponCode} (saved {formatPrice(order.discount)})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{
                                    padding: '16px 24px', borderTop: '1px solid #e5e7eb',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    flexWrap: 'wrap', gap: '12px'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                        Shipping to: {order.shippingCity}, {order.shippingState}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {/* Track Order button for active orders */}
                                        {['CONFIRMED', 'SHIPPED', 'OUT_OF_DELIVERY'].includes(order.status) && (
                                            <Link
                                                href={order.trackingToken ? `/track/${order.trackingToken}` : `/track/${order.orderNumber}`}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '8px 16px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                    borderRadius: '8px', border: 'none',
                                                    color: 'white', fontWeight: 500, fontSize: '14px',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <MapPin size={16} /> Track Order
                                            </Link>
                                        )}
                                        {/* Only show Invoice for non-cancelled orders */}
                                        {order.status !== 'CANCELLED' && order.paymentStatus !== 'FAILED' && (
                                            <button
                                                onClick={() => downloadInvoice(order.id, order.orderNumber)}
                                                disabled={downloadingId === order.id}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    padding: '8px 16px', background: downloadingId === order.id ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                                    borderRadius: '8px', border: 'none',
                                                    color: 'white', fontWeight: 500, fontSize: '14px',
                                                    cursor: downloadingId === order.id ? 'wait' : 'pointer',
                                                    opacity: downloadingId === order.id ? 0.7 : 1
                                                }}
                                            >
                                                {downloadingId === order.id ? (
                                                    <><Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Downloading...</>
                                                ) : (
                                                    <><Download size={16} /> Invoice</>
                                                )}
                                            </button>
                                        )}
                                        <Link
                                            href={`/order-confirmation/${order.id}`}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                padding: '8px 16px', background: '#f3f4f6', borderRadius: '8px',
                                                color: '#374151', textDecoration: 'none', fontWeight: 500, fontSize: '14px'
                                            }}
                                        >
                                            <Eye size={16} /> Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
