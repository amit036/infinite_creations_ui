"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, ChevronDown, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { api, API_URL } from '../../services/api';
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
        <div className="product-card" style={{
            background: 'white',
            borderRadius: '12px',
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
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '36px' }}>
                            📦
                        </div>
                    )}
                    {hasDiscount && (
                        <span style={{
                            position: 'absolute', top: '8px', left: '8px',
                            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                            color: 'white', padding: '4px 8px', borderRadius: '16px',
                            fontSize: '10px', fontWeight: 700
                        }}>-{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}%</span>
                    )}
                    {product.featured && (
                        <span style={{
                            position: 'absolute', top: hasDiscount ? '36px' : '8px', left: '8px',
                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                            color: '#78350f', padding: '3px 8px', borderRadius: '16px',
                            fontSize: '9px', fontWeight: 600
                        }}>⭐ Featured</span>
                    )}
                </div>
            </Link>
            <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    {product.category?.name || 'Product'}
                </p>
                <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '8px', fontSize: '14px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                            {formatPrice(displayPrice)}
                        </span>
                        {hasDiscount && (
                            <span style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                    {product.stock === 0 ? (
                        <button
                            disabled
                            style={{
                                padding: '6px 12px',
                                background: '#f3f4f6',
                                color: '#9ca3af',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: 600,
                                fontSize: '12px',
                                cursor: 'not-allowed'
                            }}
                        >
                            Out
                        </button>
                    ) : quantity > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                                onClick={() => quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, quantity - 1)}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '8px',
                                    background: '#f3f4f6', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
                                }}
                            >
                                −
                            </button>
                            <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center', fontSize: '14px' }}>{quantity}</span>
                            <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                disabled={quantity >= product.stock}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '8px',
                                    background: quantity >= product.stock ? '#e5e7eb' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    color: quantity >= product.stock ? '#9ca3af' : 'white',
                                    border: 'none', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
                                }}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(product)}
                            style={{
                                padding: '6px 14px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: 600,
                                fontSize: '12px',
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
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

    // Close filter on body scroll lock
    useEffect(() => {
        if (mobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileFilterOpen]);

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'priceLow': return Number(a.salePrice || a.price) - Number(b.salePrice || b.price);
            case 'priceHigh': return Number(b.salePrice || b.price) - Number(a.salePrice || a.price);
            case 'name': return a.name.localeCompare(b.name);
            default: return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const currentCategory = categories.find(c => c.slug === selectedCategory);

    // Category filter sidebar content
    const FilterContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
                href="/shop"
                onClick={() => setMobileFilterOpen(false)}
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
            </Link>
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setMobileFilterOpen(false)}
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
    );

    return (
        <main style={{ background: '#f9fafb', minHeight: '100vh' }}>
            {/* Page Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                padding: '32px 0'
            }}>
                <div className="page-container">
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                        {currentCategory ? currentCategory.name : 'All Products'}
                    </h1>
                    <p style={{ color: '#c7d2fe', fontSize: '14px' }}>
                        {currentCategory ? currentCategory.description : 'Browse our complete collection'}
                    </p>
                </div>
            </div>

            <div className="page-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
                <div className="shop-layout">
                    {/* Desktop Sidebar */}
                    <aside className="shop-sidebar">
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            position: 'sticky',
                            top: '120px'
                        }}>
                            <h3 style={{ fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                                <Filter size={16} /> Categories
                            </h3>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="shop-content">
                        {/* Mobile Filter Button */}
                        <button
                            className="mobile-filter-btn"
                            onClick={() => setMobileFilterOpen(true)}
                        >
                            <Filter size={18} /> Filter by Category
                        </button>

                        {/* Toolbar */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}>
                            <p style={{ color: '#6b7280', fontSize: '14px' }}>
                                Showing <strong>{sortedProducts.length}</strong> products
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#6b7280', display: 'none' }} className="hide-mobile">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #e5e7eb',
                                        background: 'white',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="priceLow">Price: Low</option>
                                    <option value="priceHigh">Price: High</option>
                                    <option value="name">Name</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    border: '3px solid #e5e7eb', borderTopColor: '#4f46e5',
                                    borderRadius: '50%', animation: 'spin 1s linear infinite'
                                }}></div>
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '48px 24px',
                                textAlign: 'center'
                            }}>
                                <p style={{ fontSize: '40px', marginBottom: '12px' }}>📦</p>
                                <h3 style={{ fontWeight: 600, marginBottom: '6px' }}>No products found</h3>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>Try selecting a different category</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            <div
                className={`mobile-menu-overlay ${mobileFilterOpen ? 'active' : ''}`}
                onClick={() => setMobileFilterOpen(false)}
            />

            {/* Mobile Filter Drawer */}
            <div className={`mobile-menu ${mobileFilterOpen ? 'active' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '18px' }}>Categories</h3>
                    <button
                        onClick={() => setMobileFilterOpen(false)}
                        style={{
                            padding: '8px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                        aria-label="Close filter"
                    >
                        <X size={20} color="#374151" />
                    </button>
                </div>
                <FilterContent />
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
