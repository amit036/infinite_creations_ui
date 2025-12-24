"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, Share2, Copy, Check, AlertCircle, Bike } from 'lucide-react';
import { formatPrice, getImageUrl } from '../../../utils/helpers';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { API_URL } from '../../../services/api';

export default function PublicTrackingPage() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function loadOrder() {
            try {
                const res = await fetch(`${API_URL}/orders/track/${params.token}`);
                if (!res.ok) {
                    throw new Error('Order not found');
                }
                const data = await res.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (params.token) loadOrder();
    }, [params.token]);

    const copyTrackingLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock size={24} />;
            case 'CONFIRMED': return <Package size={24} />;
            case 'SHIPPED': return <Truck size={24} />;
            case 'OUT_OF_DELIVERY': return <Bike size={24} />;
            case 'DELIVERED': return <CheckCircle size={24} />;
            case 'CANCELLED': return <AlertCircle size={24} />;
            default: return <Clock size={24} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#f59e0b';
            case 'CONFIRMED': return '#3b82f6';
            case 'SHIPPED': return '#8b5cf6';
            case 'OUT_OF_DELIVERY': return '#f97316';
            case 'DELIVERED': return '#059669';
            case 'CANCELLED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_OF_DELIVERY', 'DELIVERED'];
    const currentStatusIndex = orderStatuses.indexOf(order?.status);

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </main>
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                    <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                        <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>Order Not Found</h1>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>The tracking link is invalid or has expired.</p>
                        <Link href="/shop" style={{ padding: '12px 24px', background: '#4f46e5', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                            Continue Shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '32px', paddingBottom: '64px' }}>
                <div className="page-container">
                    {/* Header Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        borderRadius: '20px',
                        padding: '32px',
                        marginBottom: '24px',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div>
                                <p style={{ opacity: 0.8, marginBottom: '4px', fontSize: '14px' }}>Order Number</p>
                                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{order.orderNumber}</h1>
                            </div>
                            <button
                                onClick={copyTrackingLink}
                                style={{
                                    padding: '10px 16px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 600
                                }}
                            >
                                {copied ? <><Check size={18} /> Copied!</> : <><Share2 size={18} /> Share</>}
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '12px',
                            color: getStatusColor(order.status)
                        }}>
                            {getStatusIcon(order.status)}
                            <span style={{ fontWeight: 700, fontSize: '16px' }}>{order.status.replace(/_/g, ' ')}</span>
                        </div>
                    </div>

                    {/* Progress Tracker */}
                    {order.status !== 'CANCELLED' && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            marginBottom: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Order Progress</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                {/* Progress Line */}
                                <div style={{
                                    position: 'absolute',
                                    top: '24px',
                                    left: '24px',
                                    right: '24px',
                                    height: '4px',
                                    background: '#e5e7eb',
                                    zIndex: 0
                                }}>
                                    <div style={{
                                        width: `${(currentStatusIndex / (orderStatuses.length - 1)) * 100}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                                        borderRadius: '2px',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>

                                {orderStatuses.map((status, index) => {
                                    const isActive = index <= currentStatusIndex;
                                    const isCurrent = index === currentStatusIndex;
                                    return (
                                        <div key={status} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                background: isActive ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#e5e7eb',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 8px',
                                                color: isActive ? 'white' : '#9ca3af',
                                                boxShadow: isCurrent ? '0 0 0 4px rgba(79, 70, 229, 0.3)' : 'none',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                {status === 'PENDING' && <Clock size={20} />}
                                                {status === 'CONFIRMED' && <Package size={20} />}
                                                {status === 'SHIPPED' && <Truck size={20} />}
                                                {status === 'OUT_OF_DELIVERY' && <Bike size={20} />}
                                                {status === 'DELIVERED' && <CheckCircle size={20} />}
                                            </div>
                                            <p style={{
                                                fontSize: '12px',
                                                fontWeight: isActive ? 600 : 400,
                                                color: isActive ? '#111827' : '#9ca3af'
                                            }}>
                                                {status.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tracking Updates */}
                    {order.tracking && order.tracking.length > 0 && (
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            marginBottom: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Tracking Updates</h2>
                            <div style={{ position: 'relative', paddingLeft: '32px' }}>
                                {/* Timeline Line */}
                                <div style={{
                                    position: 'absolute',
                                    left: '11px',
                                    top: '8px',
                                    bottom: '8px',
                                    width: '2px',
                                    background: '#e5e7eb'
                                }} />

                                {order.tracking.map((track, index) => (
                                    <div key={track.id} style={{ marginBottom: '24px', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '-32px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: index === 0 ? '#4f46e5' : '#e5e7eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: index === 0 ? 'white' : '#9ca3af'
                                            }} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{track.status}</p>
                                            {track.description && <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>{track.description}</p>}
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                                                <span><Calendar size={12} style={{ marginRight: '4px' }} />{new Date(track.createdAt).toLocaleString('en-IN')}</span>
                                                {track.location && <span><MapPin size={12} style={{ marginRight: '4px' }} />{track.location}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {/* Order Items */}
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Order Items ({order.items?.length || 0})</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {order.items?.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '12px',
                                            background: '#f3f4f6',
                                            overflow: 'hidden',
                                            flexShrink: 0
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
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, marginBottom: '4px', color: '#111827' }}>{item.product?.name}</p>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                        </div>
                                        <p style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(Number(item.price) * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #e5e7eb' }}>
                                {order.couponCode && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#059669' }}>
                                        <span>Coupon ({order.couponCode})</span>
                                        <span>-{formatPrice(order.discount)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#059669' }}>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Delivery Information</h2>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ padding: '12px', background: '#e0e7ff', borderRadius: '12px' }}>
                                        <MapPin size={24} color="#4f46e5" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Shipping To</p>
                                        <p style={{ fontWeight: 600 }}>{order.shippingName}</p>
                                    </div>
                                </div>
                                <p style={{ color: '#6b7280', paddingLeft: '60px' }}>
                                    {order.shippingCity}, {order.shippingState} - {order.shippingZip}
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '12px' }}>
                                    <Calendar size={24} color="#059669" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Estimated Delivery</p>
                                    <p style={{ fontWeight: 600 }}>{order.estimatedDeliveryDays || 5} Business Days</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '12px' }}>
                                    <Package size={24} color="#d97706" />
                                </div>
                                <div>
                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Payment</p>
                                    <p style={{ fontWeight: 600 }}>{order.paymentMethod} - {order.paymentStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Date */}
                    <div style={{ textAlign: 'center', marginTop: '32px', color: '#9ca3af', fontSize: '14px' }}>
                        Order placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
