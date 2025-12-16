"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, ChevronRight, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { formatPrice, getImageUrl } from '../../../utils/helpers';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';



export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart, items, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Get cart item if exists
    const cartItem = items.find(item => item.id === product?.id);
    const cartQuantity = cartItem?.quantity || 0;
    const [localQuantity, setLocalQuantity] = useState(1);

    useEffect(() => {
        async function loadProduct() {
            try {
                const res = await api.get(`/products/${params.slug}`);
                setProduct(res);
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setLoading(false);
            }
        }
        if (params.slug) loadProduct();
    }, [params.slug]);

    // Check if in wishlist
    useEffect(() => {
        async function checkWishlist() {
            if (user && product) {
                try {
                    const res = await api.get(`/users/me/wishlist/${product.id}/check`);
                    setInWishlist(res.inWishlist);
                } catch (e) { /* ignore */ }
            }
        }
        checkWishlist();
    }, [user, product]);

    const toggleWishlist = async () => {
        if (!user) {
            router.push('/login?redirect=' + encodeURIComponent(`/product/${params.slug}`));
            return;
        }
        setWishlistLoading(true);
        try {
            if (inWishlist) {
                await api.delete(`/users/me/wishlist/${product.id}`);
                setInWishlist(false);
            } else {
                await api.post(`/users/me/wishlist/${product.id}`);
                setInWishlist(true);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, localQuantity);
        }
    };

    const handleUpdateQuantity = (newQty) => {
        if (newQty <= 0) {
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, newQty);
        }
    };

    const hasDiscount = product?.salePrice && Number(product.salePrice) < Number(product.price);
    const displayPrice = hasDiscount ? product.salePrice : product?.price;
    const discount = hasDiscount ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100) : 0;

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </main>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Product Not Found</h1>
                        <Link href="/shop" style={{ color: '#4f46e5', fontWeight: 500 }}>← Back to Shop</Link>
                    </div>
                </main>
            </>
        );
    }

    const images = product.images?.length > 0 ? product.images : [null];

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
                <div className="page-container" style={{ paddingTop: '24px', paddingBottom: '64px' }}>
                    {/* Back Button */}
                    <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginBottom: '24px', textDecoration: 'none' }}>
                        <ArrowLeft size={20} /> Back to Shop
                    </Link>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
                        {/* Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div style={{
                                aspectRatio: '1', borderRadius: '16px', overflow: 'hidden',
                                background: 'white', marginBottom: '16px', position: 'relative'
                            }}>
                                {images[selectedImage] ? (
                                    <img
                                        src={getImageUrl(images[selectedImage])}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '80px' }}>
                                        📦
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                            style={{
                                                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                                                width: '40px', height: '40px', borderRadius: '50%', background: 'white',
                                                border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                            style={{
                                                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                                                width: '40px', height: '40px', borderRadius: '50%', background: 'white',
                                                border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}

                                {/* Discount Badge */}
                                {hasDiscount && (
                                    <span style={{
                                        position: 'absolute', top: '16px', left: '16px',
                                        background: '#dc2626', color: 'white', padding: '6px 12px',
                                        borderRadius: '20px', fontWeight: 600, fontSize: '14px'
                                    }}>
                                        -{discount}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            style={{
                                                width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden',
                                                border: selectedImage === i ? '2px solid #4f46e5' : '2px solid transparent',
                                                padding: 0, cursor: 'pointer', background: '#f3f4f6'
                                            }}
                                        >
                                            {img ? (
                                                <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ color: '#4f46e5', fontWeight: 500 }}>
                                    {product.category?.name || 'Product'}
                                </p>
                                <button
                                    onClick={toggleWishlist}
                                    disabled={wishlistLoading}
                                    style={{
                                        padding: '10px', borderRadius: '50%', border: 'none',
                                        background: inWishlist ? '#fce7f3' : '#f3f4f6',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <Heart size={22} fill={inWishlist ? '#ec4899' : 'none'} color={inWishlist ? '#ec4899' : '#6b7280'} />
                                </button>
                            </div>
                            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>
                                    {formatPrice(displayPrice)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span style={{ fontSize: '20px', color: '#9ca3af', textDecoration: 'line-through' }}>
                                            {formatPrice(product.price)}
                                        </span>
                                        <span style={{
                                            background: '#fee2e2', color: '#dc2626',
                                            padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '14px'
                                        }}>
                                            Save {formatPrice(Number(product.price) - Number(product.salePrice))}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock */}
                            <p style={{
                                marginBottom: '24px', fontSize: '14px',
                                color: product.stock > 10 ? '#059669' : product.stock > 0 ? '#d97706' : '#dc2626'
                            }}>
                                {product.stock > 10 ? `✓ In Stock (${product.stock} available)` :
                                    product.stock > 0 ? `⚠ Only ${product.stock} left!` : '✗ Out of Stock'}
                            </p>

                            {/* Description */}
                            {product.description && (
                                <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: '32px' }}>
                                    {product.description}
                                </p>
                            )}

                            {/* Add to Cart / Quantity Controls */}
                            {cartQuantity > 0 ? (
                                // Item is in cart - show quantity controls
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{
                                        background: '#d1fae5', borderRadius: '12px', padding: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#059669', fontWeight: 600 }}>✓ Added to Cart</span>
                                        </div>
                                        <Link href="/cart" style={{ color: '#059669', fontWeight: 500, textDecoration: 'none' }}>
                                            View Cart →
                                        </Link>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Quantity in cart:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button
                                                onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #d1d5db',
                                                    background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span style={{ width: '48px', textAlign: 'center', fontWeight: 600, fontSize: '18px' }}>{cartQuantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                                                disabled={cartQuantity >= product.stock}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #d1d5db',
                                                    background: 'white', cursor: cartQuantity >= product.stock ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: cartQuantity >= product.stock ? 0.5 : 1
                                                }}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Item not in cart - show add to cart
                                <>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                            Quantity
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button
                                                onClick={() => setLocalQuantity(q => Math.max(1, q - 1))}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #d1d5db',
                                                    background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span style={{ width: '48px', textAlign: 'center', fontWeight: 600, fontSize: '18px' }}>{localQuantity}</span>
                                            <button
                                                onClick={() => setLocalQuantity(q => Math.min(product.stock, q + 1))}
                                                style={{
                                                    width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #d1d5db',
                                                    background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            style={{
                                                flex: 1, padding: '16px 32px', borderRadius: '12px', border: 'none',
                                                background: '#4f46e5', color: 'white',
                                                fontWeight: 600, fontSize: '16px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                opacity: product.stock === 0 ? 0.5 : 1, transition: 'all 0.2s'
                                            }}
                                        >
                                            <ShoppingCart size={20} /> Add to Cart
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Features */}
                            <div style={{ display: 'flex', gap: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Truck size={20} color="#6b7280" />
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Free shipping over ₹2,000</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={20} color="#6b7280" />
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Secure payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
