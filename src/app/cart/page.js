"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleCheckout = () => {
        if (!user) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    if (!mounted) return null;

    const shippingThreshold = 2000;
    const shippingCost = total >= shippingThreshold ? 0 : 99;

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
                <div className="page-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>Shopping Cart</h1>

                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{
                                width: '96px', height: '96px', margin: '0 auto 24px',
                                background: '#f3f4f6', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <ShoppingBag size={40} color="#9ca3af" />
                            </div>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Your cart is empty</h2>
                            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Looks like you haven't added anything yet.</p>
                            <Link href="/shop" className="btn-primary">
                                Start Shopping <ArrowRight size={20} />
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
                            {/* Cart Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {items.map((item) => (
                                    <div key={item.id} style={{
                                        background: 'white', borderRadius: '12px', padding: '16px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px'
                                    }}>
                                        <div style={{
                                            width: '96px', height: '96px', background: '#f3f4f6',
                                            borderRadius: '8px', overflow: 'hidden', flexShrink: 0
                                        }}>
                                            {item.images?.[0] ? (
                                                <img src={getImageUrl(item.images[0])} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>📦</div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{item.name}</h3>
                                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{item.category?.name || 'Product'}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        style={{
                                                            width: '32px', height: '32px', borderRadius: '8px',
                                                            background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span style={{ width: '32px', textAlign: 'center', fontWeight: 500 }}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.stock && item.quantity >= item.stock}
                                                        style={{
                                                            width: '32px', height: '32px', borderRadius: '8px',
                                                            background: (item.stock && item.quantity >= item.stock) ? '#e5e7eb' : '#f3f4f6',
                                                            cursor: (item.stock && item.quantity >= item.stock) ? 'not-allowed' : 'pointer',
                                                            border: 'none',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: (item.stock && item.quantity >= item.stock) ? '#9ca3af' : 'inherit'
                                                        }}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#111827' }}>
                                                        {formatPrice(Number(item.salePrice || item.price) * item.quantity)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        style={{
                                                            padding: '8px', color: '#ef4444', background: 'none',
                                                            border: 'none', cursor: 'pointer', borderRadius: '8px'
                                                        }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={clearCart}
                                    style={{ alignSelf: 'flex-start', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div style={{
                                background: 'white', borderRadius: '12px', padding: '24px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content', position: 'sticky', top: '140px'
                            }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Order Summary</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#6b7280' }}>Subtotal ({items.length} items)</span>
                                        <span style={{ fontWeight: 500 }}>{formatPrice(total)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#6b7280' }}>Shipping</span>
                                        <span style={{ fontWeight: 500, color: shippingCost === 0 ? '#10b981' : '#111827' }}>
                                            {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    {total < shippingThreshold && (
                                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                                            Add {formatPrice(shippingThreshold - total)} more for free shipping
                                        </p>
                                    )}
                                </div>
                                <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '16px', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                                        <span>Total</span>
                                        <span>{formatPrice(total + shippingCost)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    style={{
                                        width: '100%', marginTop: '24px', padding: '16px',
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
                                        border: 'none', borderRadius: '12px', fontWeight: 600,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                                    }}
                                >
                                    Proceed to Checkout <ArrowRight size={20} />
                                </button>
                                <Link href="/shop" style={{
                                    display: 'block', textAlign: 'center', marginTop: '16px',
                                    color: '#4f46e5', fontWeight: 500, textDecoration: 'none'
                                }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
