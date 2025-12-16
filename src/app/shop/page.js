"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Product Card
function ProductCard({ product }) {
    const { addToCart, items, updateQuantity, removeFromCart } = useCart();
    const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
    const displayPrice = hasDiscount ? product.salePrice : product.price;

    const cartItem = items.find(item => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease'
        }}>
            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ aspectRatio: '1', background: '#f8f9fa', position: 'relative', overflow: 'hidden' }}>
                    {product.images?.[0] ? (
                        <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '48px' }}>
                            📦
                        </div>
                    )}
                    {hasDiscount && (
                        <span style={{
                            position: 'absolute', top: '12px', left: '12px',
                            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                            color: 'white', padding: '6px 12px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: 700
                        }}>-{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}% OFF</span>
                    )}
                    {product.featured && (
                        <span style={{
                            position: 'absolute', top: hasDiscount ? '48px' : '12px', left: '12px',
                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                            color: '#78350f', padding: '4px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: 600
                        }}>⭐ Featured</span>
                    )}
                </div>
            </Link>
            <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    {product.category?.name || 'Product'}
                </p>
                <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '10px', fontSize: '15px', lineHeight: 1.4 }}>{product.name}</h3>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                            {formatPrice(displayPrice)}
                        </span>
                        {hasDiscount && (
                            <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    {product.stock === 0 ? (
                        <button
                            disabled
                            style={{
                                padding: '8px 16px',
                                background: '#f3f4f6',
                                color: '#9ca3af',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'not-allowed'
                            }}
                        >
                            Out of Stock
                        </button>
                    ) : quantity > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                                style={{
                                    width: '30px', height: '30px', borderRadius: '8px',
                                    background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}
                            >
                                −
                            </button>
                            <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                            <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                disabled={quantity >= product.stock}
                                style={{
                                    width: '30px', height: '30px', borderRadius: '8px',
                                    background: quantity >= product.stock ? '#e5e7eb' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    color: quantity >= product.stock ? '#9ca3af' : 'white',
                                    border: 'none', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(product)}
                            style={{
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                            }}
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Shop Content
function ShopContent() {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('category');

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        async function loadData() {
            try {
                let url = '/products?limit=50';
                if (selectedCategory) {
                    url += `&category=${selectedCategory}`;
                }
                const [productsRes, catsRes] = await Promise.all([
                    api.get(url),
                    api.get('/categories')
                ]);
                setProducts(productsRes?.data || []);
                setCategories(catsRes || []);
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [selectedCategory]);

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'priceLow': return Number(a.salePrice || a.price) - Number(b.salePrice || b.price);
            case 'priceHigh': return Number(b.salePrice || b.price) - Number(a.salePrice || a.price);
            case 'name': return a.name.localeCompare(b.name);
            default: return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const currentCategory = categories.find(c => c.slug === selectedCategory);

    return (
        <main style={{ background: '#f9fafb', minHeight: '100vh' }}>
            {/* Page Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                padding: '48px 0'
            }}>
                <div className="page-container">
                    <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                        {currentCategory ? currentCategory.name : 'All Products'}
                    </h1>
                    <p style={{ color: '#c7d2fe' }}>
                        {currentCategory ? currentCategory.description : 'Browse our complete collection of premium products'}
                    </p>
                </div>
            </div>

            <div className="page-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                    {/* Sidebar Filters */}
                    <aside style={{ width: '260px', flexShrink: 0 }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            position: 'sticky',
                            top: '140px'
                        }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Filter size={18} /> Categories
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Link
                                    href="/shop"
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        background: !selectedCategory ? 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' : '#f9fafb',
                                        color: !selectedCategory ? '#4f46e5' : '#374151',
                                        textDecoration: 'none',
                                        fontWeight: !selectedCategory ? 600 : 500,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    All Products
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{products.length}</span>
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/shop?category=${cat.slug}`}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            background: selectedCategory === cat.slug ? 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' : '#f9fafb',
                                            color: selectedCategory === cat.slug ? '#4f46e5' : '#374151',
                                            textDecoration: 'none',
                                            fontWeight: selectedCategory === cat.slug ? 600 : 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {cat.name}
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{cat._count?.products || 0}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div style={{ flex: 1 }}>
                        {/* Toolbar */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '24px'
                        }}>
                            <p style={{ color: '#6b7280' }}>
                                Showing <strong>{sortedProducts.length}</strong> products
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '10px',
                                        border: '1px solid #e5e7eb',
                                        background: 'white',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                    <option value="name">Name</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    border: '3px solid #e5e7eb', borderTopColor: '#4f46e5',
                                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                                }}></div>
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '64px',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
                                <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>No products found</h3>
                                <p style={{ color: '#6b7280' }}>Try selecting a different category</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// Shop Page
export default function ShopPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        border: '3px solid #e5e7eb', borderTopColor: '#4f46e5',
                        borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            }>
                <ShopContent />
            </Suspense>
            <Footer />
        </>
    );
}
