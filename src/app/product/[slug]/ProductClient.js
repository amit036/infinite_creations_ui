"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Minus, Plus, ChevronLeft, ChevronRight, Truck, Shield, ArrowLeft, Share2, Copy, Facebook, Twitter, Linkedin, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { formatPrice, getImageUrl } from '../../../utils/helpers';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ProductClient({ initialProduct }) {
    const params = useParams();
    const router = useRouter();
    const { addToCart, items, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);
    const [selectedImage, setSelectedImage] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [localQuantity, setLocalQuantity] = useState(1);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // If server fetch failed, try client fetch
    useEffect(() => {
        if (!product && params.slug) {
            setLoading(true);
            api.get(`/products/${params.slug}`)
                .then(res => {
                    setProduct(res);
                })
                .catch(err => {
                    console.error('Client-side product fetch failed:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [product, params.slug]);

    // Get cart item if exists
    const cartItem = items.find(item => item.id === product?.id);
    const cartQuantity = cartItem?.quantity || 0;

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

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out this amazing product: ${product?.name} at Infinite Creations!`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.617 1.435h.005c6.556 0 11.894-5.335 11.897-11.894a11.83 11.83 0 00-3.484-8.412z" /></svg>,
            link: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
            color: '#25D366'
        },
        {
            name: 'Facebook',
            icon: <Facebook size={24} color="#1877F2" />,
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: '#1877F2'
        },
        {
            name: 'Twitter',
            icon: <Twitter size={24} color="#1DA1F2" />,
            link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            color: '#1DA1F2'
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={24} color="#0077B5" />,
            link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: '#0077B5'
        }
    ];

    if (loading) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </main>
                <Footer />
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
                <Footer />
            </>
        );
    }

    const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
    const displayPrice = hasDiscount ? product.salePrice : product.price;
    const discount = hasDiscount ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100) : 0;
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }} className="product-grid">
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
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        onClick={() => setIsShareModalOpen(true)}
                                        style={{
                                            padding: '10px', borderRadius: '50%', border: 'none',
                                            background: '#f3f4f6', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        title="Share Product"
                                    >
                                        <Share2 size={22} color="#6b7280" />
                                    </button>
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

                <style jsx>{`
                    @media (max-width: 768px) {
                        .product-grid {
                            grid-template-columns: 1fr !important;
                            gap: 32px !important;
                        }
                    }
                `}</style>
            </main>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)'
                }} onClick={() => setIsShareModalOpen(false)}>
                    <div style={{
                        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px',
                        padding: '32px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        animation: 'modalSlideUp 0.3s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Share Product</h2>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Share this with your friends and family!</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                            {shareOptions.map(option => (
                                <a
                                    key={option.name}
                                    href={option.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                        textDecoration: 'none', color: '#374151'
                                    }}
                                >
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '16px',
                                        background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'transform 0.2s', border: '1px solid #f3f4f6'
                                    }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        {option.icon}
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 500 }}>{option.name}</span>
                                </a>
                            ))}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>Direct Link</p>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
                                background: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6'
                            }}>
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    style={{
                                        flex: 1, background: 'none', border: 'none', outline: 'none',
                                        fontSize: '14px', color: '#6b7280', textOverflow: 'ellipsis'
                                    }}
                                />
                                <button
                                    onClick={copyToClipboard}
                                    style={{
                                        background: copied ? '#059669' : '#111827', color: 'white',
                                        border: 'none', borderRadius: '8px', padding: '8px',
                                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                            {copied && (
                                <span style={{
                                    position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)',
                                    fontSize: '11px', color: '#059669', fontWeight: 600
                                }}>
                                    Copied to clipboard!
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => setIsShareModalOpen(false)}
                            style={{
                                width: '100%', marginTop: '32px', padding: '14px',
                                borderRadius: '12px', border: '1px solid #e5e7eb',
                                background: 'white', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
            <Footer />
        </>
    );
}
