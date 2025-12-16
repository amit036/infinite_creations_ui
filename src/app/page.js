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
      borderRadius: '16px',
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
            }}>
              -{Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)}% OFF
            </span>
          )}
          {product.featured && (
            <span style={{
              position: 'absolute', top: hasDiscount ? '48px' : '12px', left: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              color: '#78350f', padding: '4px 10px', borderRadius: '20px',
              fontSize: '11px', fontWeight: 600
            }}>
              ⭐ Featured
            </span>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        <section style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
          padding: '80px 0',
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
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '20px',
                color: 'white',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                🎉 New Arrivals Available Now
              </span>
              <h1 style={{
                fontSize: '56px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '20px'
              }}>
                Premium Quality<br />
                <span style={{
                  background: 'linear-gradient(to right, #a5b4fc, #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Products for You</span>
              </h1>
              <p style={{ color: '#c7d2fe', fontSize: '18px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '500px' }}>
                Discover curated products from top brands. Free shipping on orders over ₹2,000.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Link href="/shop" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  background: 'white',
                  color: '#4f46e5',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '16px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}>
                  Shop Now <ArrowRight size={20} />
                </Link>
                <Link href="/shop?featured=true" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  background: 'transparent',
                  color: 'white',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '16px',
                  textDecoration: 'none',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}>
                  View Featured
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="page-container" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Shop by Category</h2>
              <p style={{ color: '#6b7280', marginTop: '4px' }}>Browse our wide selection of products</p>
            </div>
            <Link href="/shop" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#4f46e5', fontWeight: 600, textDecoration: 'none'
            }}>
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                style={{
                  padding: '28px',
                  background: 'white',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s',
                  border: '1px solid #f3f4f6'
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px', fontSize: '24px'
                }}>
                  {cat.slug === 'electronics' ? '📱' :
                    cat.slug === 'clothing' ? '👕' :
                      cat.slug === 'home-living' ? '🏠' : '🎒'}
                </div>
                <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{cat.name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{cat._count?.products || 0} products</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="page-container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Featured Products</h2>
              <p style={{ color: '#6b7280', marginTop: '4px' }}>Handpicked items just for you</p>
            </div>
            <Link href="/shop?featured=true" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#4f46e5', fontWeight: 600, textDecoration: 'none'
            }}>
              View All <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Banner */}
        <section className="page-container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '24px',
            padding: '48px 56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white'
          }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                Get 25% Off Your First Order
              </h2>
              <p style={{ fontSize: '18px', opacity: 0.9 }}>
                Use code <strong style={{ background: 'white', color: '#4f46e5', padding: '2px 12px', borderRadius: '6px' }}>FLASH25</strong> at checkout
              </p>
            </div>
            <Link href="/shop" style={{
              padding: '16px 32px',
              background: 'white',
              color: '#4f46e5',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}>
              Shop Now
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="page-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>New Arrivals</h2>
              <p style={{ color: '#6b7280', marginTop: '4px' }}>Check out our latest products</p>
            </div>
            <Link href="/shop" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: '#4f46e5', fontWeight: 600, textDecoration: 'none'
            }}>
              View All <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
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
