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
        <div className="wishlist-page">
            <div className="page-header">
                <h1>My Wishlist</h1>
                <p>{wishlist.length} items saved</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            ) : wishlist.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <Heart size={32} color="#ec4899" />
                    </div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save your favorite products for later</p>
                    <Link href="/shop" className="browse-btn">Browse Products</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((product) => {
                        const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
                        const displayPrice = hasDiscount ? product.salePrice : product.price;

                        return (
                            <div key={product.id} className="product-card">
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="remove-btn"
                                >
                                    <X size={16} color="#dc2626" />
                                </button>

                                <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                    <div className="product-img">
                                        {product.images?.[0] ? (
                                            <img src={getImageUrl(product.images[0])} alt={product.name} />
                                        ) : (
                                            <span className="placeholder">📦</span>
                                        )}
                                        {hasDiscount && (
                                            <span className="discount-badge">
                                                -{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}%
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="out-of-stock">
                                                <span>Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="product-info">
                                    <p className="category">{product.category?.name || 'Product'}</p>
                                    <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                        <h3 className="product-name">{product.name}</h3>
                                    </Link>
                                    <div className="price-row">
                                        <span className="current-price">{formatPrice(displayPrice)}</span>
                                        {hasDiscount && (
                                            <span className="original-price">{formatPrice(product.price)}</span>
                                        )}
                                    </div>

                                    {isInCart(product.id) ? (
                                        <Link href="/cart" className="cart-btn in-cart">
                                            <ShoppingCart size={16} /> View in Cart
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className={`cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                                        >
                                            <ShoppingCart size={16} /> Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style jsx>{`
                .wishlist-page { width: 100%; }
                .page-header { margin-bottom: 24px; }
                .page-header h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0; }
                .page-header p { color: #6b7280; margin: 4px 0 0; font-size: 14px; }
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
                    background: #fce7f3;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .empty-state h3 { font-weight: 600; margin-bottom: 8px; }
                .empty-state p { color: #6b7280; margin-bottom: 20px; font-size: 14px; }
                .browse-btn {
                    display: inline-block;
                    padding: 10px 20px;
                    background: #4f46e5;
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 14px;
                }
                .wishlist-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 16px;
                }
                .product-card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    position: relative;
                }
                .remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 10;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .product-img {
                    aspect-ratio: 1;
                    background: #f3f4f6;
                    position: relative;
                }
                .product-img img { width: 100%; height: 100%; object-fit: cover; }
                .placeholder {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                }
                .discount-badge {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #dc2626;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                }
                .out-of-stock {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                }
                .product-info { padding: 14px; }
                .category {
                    font-size: 11px;
                    color: #6b7280;
                    text-transform: uppercase;
                    margin: 0 0 4px;
                }
                .product-name {
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 8px;
                    font-size: 14px;
                }
                .price-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
                .current-price { font-size: 16px; font-weight: 700; color: #111827; }
                .original-price { font-size: 13px; color: #9ca3af; text-decoration: line-through; }
                .cart-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    width: 100%;
                    padding: 10px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    text-decoration: none;
                }
                .cart-btn.in-cart { background: #d1fae5; color: #059669; }
                .cart-btn.disabled { background: #e5e7eb; color: #6b7280; cursor: not-allowed; }

                @media (max-width: 768px) {
                    .page-header h1 { font-size: 20px; }
                    .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
                    .product-info { padding: 12px; }
                    .product-name { font-size: 13px; }
                }
            `}</style>
        </div>
    );
}
