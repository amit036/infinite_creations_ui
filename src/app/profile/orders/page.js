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
        <div className="orders-page">
            <div className="page-header">
                <div>
                    <h1>My Orders</h1>
                    <p>{orders.length} total orders</p>
                </div>
                <div className="filter-row">
                    <Filter size={16} color="#6b7280" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
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
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <ShoppingBag size={32} color="#9ca3af" />
                    </div>
                    <h3>{filter === 'all' ? 'No orders yet' : `No ${filter.toLowerCase()} orders`}</h3>
                    <p>Start shopping to see your orders here</p>
                    <Link href="/shop" className="shop-btn">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map((order) => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Order Number</span>
                                            <span className="meta-value order-num">{order.orderNumber}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Date</span>
                                            <span className="meta-value">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Total</span>
                                            <span className="meta-value">{formatPrice(order.totalAmount)}</span>
                                        </div>
                                    </div>
                                    <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-items">
                                    <div className="items-row">
                                        {order.items?.slice(0, 3).map((item) => (
                                            <div key={item.id} className="item-preview">
                                                <div className="item-img">
                                                    {item.product?.images?.[0] ? (
                                                        <img src={getImageUrl(item.product.images[0])} alt="" />
                                                    ) : (
                                                        <span>📦</span>
                                                    )}
                                                </div>
                                                <div className="item-info">
                                                    <p className="item-name">{item.product?.name}</p>
                                                    <p className="item-qty">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items?.length > 3 && (
                                            <div className="more-items">+{order.items.length - 3}</div>
                                        )}
                                    </div>

                                    {order.couponCode && (
                                        <div className="coupon-badge">
                                            Coupon: {order.couponCode} (saved {formatPrice(order.discount)})
                                        </div>
                                    )}
                                </div>

                                <div className="order-footer">
                                    <span className="shipping-info">Shipping to: {order.shippingCity}, {order.shippingState}</span>
                                    <div className="action-btns">
                                        {['CONFIRMED', 'SHIPPED', 'OUT_OF_DELIVERY'].includes(order.status) && (
                                            <Link
                                                href={order.trackingToken ? `/track/${order.trackingToken}` : `/track/${order.orderNumber}`}
                                                className="track-btn"
                                            >
                                                <MapPin size={14} /> Track
                                            </Link>
                                        )}
                                        {order.status !== 'CANCELLED' && order.paymentStatus !== 'FAILED' && (
                                            <button
                                                onClick={() => downloadInvoice(order.id, order.orderNumber)}
                                                disabled={downloadingId === order.id}
                                                className="invoice-btn"
                                            >
                                                {downloadingId === order.id ? (
                                                    <><Loader2 size={14} className="spin" /> ...</>
                                                ) : (
                                                    <><Download size={14} /> Invoice</>
                                                )}
                                            </button>
                                        )}
                                        <Link
                                            href={`/order-confirmation/${order.id}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontWeight: 500,
                                                fontSize: '12px',
                                                textDecoration: 'none',
                                                background: 'white',
                                                color: '#374151',
                                                border: '1px solid #d1d5db'
                                            }}
                                        >
                                            <Eye size={14} /> Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style jsx>{`
                .orders-page { width: 100%; }
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .page-header h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0; }
                .page-header p { color: #6b7280; margin: 4px 0 0; font-size: 14px; }
                .filter-row { display: flex; align-items: center; gap: 8px; }
                .filter-select {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    outline: none;
                    background: white;
                    font-size: 13px;
                }
                .loading-container { display: flex; justify-content: center; padding: 64px; }
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
                .shop-btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background: #4f46e5;
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 14px;
                }
                .orders-list { display: flex; flex-direction: column; gap: 16px; }
                .order-card {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                }
                .order-header {
                    padding: 16px;
                    background: #f9fafb;
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    border-bottom: 1px solid #e5e7eb;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .order-meta { display: flex; gap: 20px; flex-wrap: wrap; }
                .meta-item { display: flex; flex-direction: column; }
                .meta-label { font-size: 11px; color: #6b7280; margin-bottom: 2px; }
                .meta-value { font-weight: 500; font-size: 13px; }
                .order-num { color: #4f46e5; font-weight: 600; word-break: break-all; }
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 500;
                    font-size: 11px;
                    border: 1px solid;
                    white-space: nowrap;
                }
                .order-items { padding: 16px; }
                .items-row { display: flex; gap: 12px; flex-wrap: wrap; }
                .item-preview { display: flex; gap: 10px; align-items: center; }
                .item-img {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    background: #f3f4f6;
                    overflow: hidden;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .item-img img { width: 100%; height: 100%; object-fit: cover; }
                .item-name { font-weight: 500; font-size: 13px; margin: 0; }
                .item-qty { font-size: 11px; color: #6b7280; margin: 2px 0 0; }
                .more-items {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    background: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                    font-weight: 600;
                    font-size: 12px;
                }
                .coupon-badge {
                    display: inline-block;
                    margin-top: 12px;
                    padding: 8px 12px;
                    background: #d1fae5;
                    border-radius: 6px;
                    color: #059669;
                    font-weight: 500;
                    font-size: 12px;
                }
                .order-footer {
                    padding: 12px 16px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .shipping-info { font-size: 12px; color: #6b7280; }
                .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
                .track-btn, .invoice-btn, .details-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 12px;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                }
                .track-btn { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
                .invoice-btn { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; }
                .details-btn { 
                    background: white; 
                    color: #374151; 
                    border: 1px solid #d1d5db;
                }

                @media (max-width: 768px) {
                    .page-header { flex-direction: column; align-items: flex-start; }
                    .page-header h1 { font-size: 20px; }
                    .order-header { flex-direction: column; }
                    .order-meta { gap: 12px; }
                    .status-badge { align-self: flex-start; }
                    .order-footer { flex-direction: column; align-items: flex-start; }
                    .action-btns { width: 100%; }
                }
            `}</style>
        </div>
    );
}

