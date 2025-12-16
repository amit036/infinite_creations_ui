"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { api } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { formatPrice, getImageUrl } from '../../../utils/helpers';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, items } = useCart();

    useEffect(() => {
        loadWishlist();
    }, []);

    async function loadWishlist() {
        try {
            const res = await api.get('/users/me/wishlist');
            setWishlist(res || []);
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        } finally {
            setLoading(false);
        }
    }

    async function removeFromWishlist(productId) {
        try {
            await api.delete(`/users/me/wishlist/${productId}`);
            setWishlist(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            alert('Failed to remove from wishlist');
        }
    }

    function handleAddToCart(product) {
        addToCart(product);
    }

    const isInCart = (productId) => items.some(item => item.id === productId);

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>My Wishlist</h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>{wishlist.length} items saved</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : wishlist.length === 0 ? (
                <div style={{
                    background: 'white', borderRadius: '16px', padding: '64px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto 24px',
                        background: '#fce7f3', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Heart size={32} color="#ec4899" />
                    </div>
                    <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Your wishlist is empty</h3>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>Save your favorite products for later</p>
                    <Link href="/shop" style={{
                        padding: '12px 24px', background: '#4f46e5', color: 'white',
                        borderRadius: '8px', fontWeight: 600, textDecoration: 'none', display: 'inline-block'
                    }}>
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                    {wishlist.map((product) => {
                        const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
                        const displayPrice = hasDiscount ? product.salePrice : product.price;

                        return (
                            <div key={product.id} style={{
                                background: 'white', borderRadius: '12px', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative'
                            }}>
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    style={{
                                        position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        background: 'white', border: 'none', cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <X size={16} color="#dc2626" />
                                </button>

                                {/* Image */}
                                <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ aspectRatio: '1', background: '#f3f4f6', position: 'relative' }}>
                                        {product.images?.[0] ? (
                                            <img
                                                src={getImageUrl(product.images[0])}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '48px' }}>
                                                📦
                                            </div>
                                        )}
                                        {hasDiscount && (
                                            <span style={{
                                                position: 'absolute', top: '12px', left: '12px',
                                                background: '#dc2626', color: 'white', padding: '4px 10px',
                                                borderRadius: '20px', fontSize: '12px', fontWeight: 600
                                            }}>
                                                -{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}%
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <div style={{
                                                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <span style={{ color: 'white', fontWeight: 600 }}>Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Info */}
                                <div style={{ padding: '16px' }}>
                                    <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '4px' }}>
                                        {product.category?.name || 'Product'}
                                    </p>
                                    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                        <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{product.name}</h3>
                                    </Link>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                                            {formatPrice(displayPrice)}
                                        </span>
                                        {hasDiscount && (
                                            <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>

                                    {isInCart(product.id) ? (
                                        <Link href="/cart" style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            width: '100%', padding: '10px', background: '#d1fae5', color: '#059669',
                                            border: 'none', borderRadius: '8px', fontWeight: 600, textDecoration: 'none'
                                        }}>
                                            <ShoppingCart size={18} /> View in Cart
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                width: '100%', padding: '10px', background: product.stock === 0 ? '#e5e7eb' : '#4f46e5',
                                                color: product.stock === 0 ? '#6b7280' : 'white',
                                                border: 'none', borderRadius: '8px', fontWeight: 600,
                                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <ShoppingCart size={18} /> Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
