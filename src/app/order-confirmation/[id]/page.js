"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../../../services/api';
import { formatPrice, getImageUrl } from '../../../utils/helpers';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function OrderConfirmationPage() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrder() {
            try {
                const res = await api.get(`/orders/${params.id}`);
                setOrder(res);
            } catch (error) {
                console.error('Failed to load order:', error);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) loadOrder();
    }, [params.id]);

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

    if (!order) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Order not found</h1>
                        <Link href="/shop" style={{ color: '#4f46e5', fontWeight: 500 }}>Continue Shopping</Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
                <div className="page-container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
                    {/* Success Header */}
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{
                            width: '80px', height: '80px', margin: '0 auto 24px',
                            background: '#d1fae5', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle size={40} color="#059669" />
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                            Order Confirmed!
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '18px' }}>
                            Thank you for your purchase. Your order has been received.
                        </p>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {/* Order Info */}
                        <div style={{
                            background: 'white', borderRadius: '16px', padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                                <div>
                                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>Order Number</p>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f46e5' }}>{order.orderNumber}</p>
                                </div>
                                <div style={{
                                    padding: '8px 16px', borderRadius: '20px', fontWeight: 500,
                                    background: '#fef3c7', color: '#b45309'
                                }}>
                                    {order.status}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '12px', background: '#e0e7ff', borderRadius: '12px' }}>
                                        <Package size={24} color="#4f46e5" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Items</p>
                                        <p style={{ fontWeight: 600 }}>{order.items?.length || 0} products</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '12px' }}>
                                        <Truck size={24} color="#059669" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Shipping</p>
                                        <p style={{ fontWeight: 600 }}>{order.totalAmount >= 2000 ? 'Free' : formatPrice(99)}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '12px' }}>
                                        <MapPin size={24} color="#d97706" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#6b7280' }}>Delivery</p>
                                        <p style={{ fontWeight: 600 }}>3-5 business days</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
                                <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Shipping Address</h3>
                                <p style={{ color: '#6b7280' }}>
                                    {order.shippingName}<br />
                                    {order.shippingAddress}<br />
                                    {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
                                    {order.shippingPhone}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div style={{
                            background: 'white', borderRadius: '16px', padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Order Items</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {order.items?.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '8px',
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
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, marginBottom: '4px' }}>{item.product?.name}</p>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                        </div>
                                        <p style={{ fontWeight: 600 }}>{formatPrice(Number(item.price) * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                {order.discount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#059669' }}>
                                        <span>Discount ({order.couponCode})</span>
                                        <span>-{formatPrice(order.discount)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
                                    <span>Total Paid</span>
                                    <span>{formatPrice(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <Link href="/profile/orders" style={{
                                padding: '14px 28px', background: 'white', color: '#111827',
                                border: '1px solid #d1d5db', borderRadius: '12px', fontWeight: 600,
                                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                View My Orders
                            </Link>
                            <Link href="/shop" style={{
                                padding: '14px 28px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
                                border: 'none', borderRadius: '12px', fontWeight: 600,
                                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}>
                                Continue Shopping <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
