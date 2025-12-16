"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../services/api';

export default function Header() {
    const { user } = useAuth();
    const { items } = useCart();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [promoSettings, setPromoSettings] = useState(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        // Fetch promo bar settings
        fetch(`${API_URL}/settings`)
            .then(res => res.json())
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setPromoSettings(data);
                }
            })
            .catch(err => console.log('Using default promo settings'));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/shop?category=electronics', label: 'Electronics' },
        { href: '/shop?category=clothing', label: 'Clothing' },
    ];

    return (
        <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            {/* Top Bar - Controlled by Admin */}
            {promoSettings && promoSettings.promoBarEnabled && (
                <div style={{
                    background: `linear-gradient(135deg, ${promoSettings.promoBarBgColor} 0%, ${promoSettings.promoBarBgColor}cc 50%, ${promoSettings.promoBarBgColor} 100%)`,
                    color: promoSettings.promoBarTextColor,
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.3px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none'
                    }} />
                    <div style={{ width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>🎉</span>
                        <span>{promoSettings.promoBarMessage.replace(/^🎉\s*/, '')}</span>
                    </div>
                </div>
            )}

            {/* Main Header */}
            <header style={{
                background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,1)',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
                boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <div className="page-container" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        {/* Logo */}
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                            <div style={{
                                width: '55px',
                                height: '55px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <Image
                                    src={logo}
                                    alt="Infinite Creations"
                                    width={55}
                                    height={55}
                                    style={{
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <div>
                                <span style={{
                                    fontSize: '21px',
                                    fontWeight: '700',
                                    letterSpacing: '-0.5px',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Infinite Creations
                                </span>
                                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px', fontWeight: '500', letterSpacing: '0.5px' }}>Premium Quality Products</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    style={{
                                        color: '#374151',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        padding: '8px 0',
                                        borderBottom: '2px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#4f46e5'}
                                    onMouseLeave={(e) => e.target.style.color = '#374151'}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Side Icons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Search */}
                            <button style={{
                                padding: '10px',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Search size={20} color="#6b7280" />
                            </button>

                            {/* Wishlist */}
                            {mounted && user && (
                                <Link href="/profile/wishlist" style={{
                                    padding: '10px',
                                    background: '#f3f4f6',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Heart size={20} color="#6b7280" />
                                </Link>
                            )}

                            {/* Cart */}
                            <Link href="/cart" style={{
                                position: 'relative',
                                padding: '10px',
                                background: '#f3f4f6',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ShoppingCart size={20} color="#6b7280" />
                                {mounted && cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                        color: 'white',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid white'
                                    }}>{cartCount}</span>
                                )}
                            </Link>

                            {/* User */}
                            {mounted && user ? (
                                <Link href="/profile" style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    textDecoration: 'none',
                                    border: '2px solid #c7d2fe'
                                }}>
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span style={{ color: '#4f46e5', fontWeight: 600, fontSize: '16px' }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </Link>
                            ) : mounted ? (
                                <Link href="/login" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 18px',
                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                                    transition: 'all 0.2s'
                                }}>
                                    <User size={18} /> Sign In
                                </Link>
                            ) : (
                                <div style={{ width: '40px', height: '40px' }} />
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
