"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_URL } from '../services/api';

// Format price in INR
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Product Card Component
function ProductCard({ product }) {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
  const displayPrice = hasDiscount ? product.salePrice : product.price;

  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const getImageUrl = (img) => img?.startsWith('http') ? img : `${API_URL}${img}`;

  return (
    <div className="product-card" style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease'
    }}>
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div style={{
          aspectRatio: '1',
          background: '#f8f9fa',
          position: 'relative',
          overflow: 'hidden'
        }}>
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
            }}>
              -{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}%
            </span>
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

// Loading Spinner
function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTopColor: '#4f46e5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );
}

// Home Page
export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadData() {
      try {
        const [productsRes, catsRes] = await Promise.all([
          api.get('/products?limit=20'),
          api.get('/categories')
        ]);
        const allProducts = productsRes?.data || [];
        setFeaturedProducts(allProducts.filter(p => p.featured).slice(0, 4));
        setNewArrivals(allProducts.slice(0, 8));
        setCategories(catsRes || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <Header />

      <main style={{ background: '#f9fafb' }}>
        {/* Hero Section */}
        <section className="hero-section" style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-30%', left: '-5%', width: '400px', height: '400px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.03)'
          }} />

          <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '700px' }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 14px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '20px',
                color: 'white',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                🎉 New Arrivals Available Now
              </span>
              <h1 className="hero-title" style={{ color: 'white' }}>
                Premium Quality<br />
                <span style={{
                  background: 'linear-gradient(to right, #a5b4fc, #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Products for You</span>
              </h1>
              <p className="hero-subtitle" style={{ color: '#c7d2fe', maxWidth: '500px' }}>
                Discover curated products from top brands. Free shipping on orders over ₹2,000.
              </p>
              <div className="hero-buttons">
                <Link href="/shop" className="hero-btn-primary">
                  Shop Now <ArrowRight size={20} />
                </Link>
                <Link href="/shop?featured=true" className="hero-btn-secondary">
                  View Featured
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="page-container section-padding">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>Browse our wide selection of products</p>
            </div>
            <Link href="/shop" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#4f46e5', fontWeight: 600, textDecoration: 'none', fontSize: '14px'
            }}>
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                style={{
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s',
                  border: '1px solid #f3f4f6'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px', fontSize: '22px'
                }}>
                  {cat.slug === 'electronics' ? '📱' :
                    cat.slug === 'clothing' ? '👕' :
                      cat.slug === 'home-living' ? '🏠' : '🎒'}
                </div>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '2px', fontSize: '15px' }}>{cat.name}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>{cat._count?.products || 0} products</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="page-container" style={{ paddingBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>Handpicked items just for you</p>
            </div>
            <Link href="/shop?featured=true" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#4f46e5', fontWeight: 600, textDecoration: 'none', fontSize: '14px'
            }}>
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Banner */}
        <section className="page-container" style={{ paddingTop: '16px', paddingBottom: '32px' }}>
          <div className="promo-banner" style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white'
          }}>
            <div>
              <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Get 25% Off Your First Order
              </h2>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                Use code <strong style={{ background: 'white', color: '#4f46e5', padding: '2px 10px', borderRadius: '6px' }}>FLASH25</strong> at checkout
              </p>
            </div>
            <Link href="/shop" style={{
              padding: '14px 28px',
              background: 'white',
              color: '#4f46e5',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}>
              Shop Now
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="page-container section-padding" style={{ paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>Check out our latest products</p>
            </div>
            <Link href="/shop" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#4f46e5', fontWeight: 600, textDecoration: 'none', fontSize: '14px'
            }}>
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="product-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
