"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
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

    // Close menu on route change
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/shop?category=electronics', label: 'Electronics' },
        { href: '/shop?category=clothing', label: 'Clothing' },
    ];

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'white',
                borderBottom: '1px solid #e5e7eb'
            }}>
                {/* Top Bar - Controlled by Admin */}
                {promoSettings && promoSettings.promoBarEnabled && (
                    <div style={{
                        background: promoSettings.promoBarBgColor || '#4f46e5',
                        color: promoSettings.promoBarTextColor || 'white',
                        fontSize: '11px',
                        fontWeight: '500',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 8px',
                        overflow: 'hidden'
                    }}>
                        <span style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            🎉 {promoSettings.promoBarMessage.replace(/^🎉\s*/, '')}
                        </span>
                    </div>
                )}

                {/* Main Header */}
                <header style={{
                    background: scrolled ? 'rgba(255,255,255,0.98)' : 'white',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    // borderBottom: '1px solid #e5e7eb', // Moved to the parent fixed div
                    boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.06)' : 'none',
                    transition: 'all 0.3s ease',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div className="page-container" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* Logo */}
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                                <Image
                                    src={logo}
                                    alt="IC"
                                    width={36}
                                    height={36}
                                    style={{ objectFit: 'contain', flexShrink: 0 }}
                                />
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    whiteSpace: 'nowrap'
                                }}>
                                    Infinite Creations
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="desktop-nav">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        style={{
                                            color: '#374151',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            textDecoration: 'none',
                                            padding: '6px 0',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#4f46e5'}
                                        onMouseLeave={(e) => e.target.style.color = '#374151'}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right Side Icons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {/* Cart */}
                                <Link href="/cart" style={{
                                    position: 'relative',
                                    width: '36px',
                                    height: '36px',
                                    background: '#f3f4f6',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ShoppingCart size={18} color="#374151" />
                                    {mounted && cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: -4,
                                            right: -4,
                                            background: '#4f46e5',
                                            color: 'white',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid white'
                                        }}>{cartCount}</span>
                                    )}
                                </Link>

                                {/* User - Hidden on mobile, show via hamburger menu */}
                                <div className="hide-mobile">
                                    {mounted && user ? (
                                        <Link href="/profile" style={{
                                            width: '36px',
                                            height: '36px',
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
                                                <span style={{ color: '#4f46e5', fontWeight: 600, fontSize: '13px' }}>
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </Link>
                                    ) : mounted && (
                                        <Link href="/login" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 14px',
                                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '13px',
                                            textDecoration: 'none'
                                        }}>
                                            <User size={16} /> Sign In
                                        </Link>
                                    )}
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    className="mobile-menu-btn"
                                    onClick={() => setMobileMenuOpen(true)}
                                    aria-label="Open menu"
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        background: '#f3f4f6',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Menu size={20} color="#374151" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
            </div>
            {/* Spacer to push content down since header is fixed - OUTSIDE fixed div */}
            <div style={{
                height: promoSettings && promoSettings.promoBarEnabled ? '84px' : '56px'
            }} />

            {/* Mobile Menu Overlay */}
            <div
                className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>Menu</span>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            width: '32px',
                            height: '32px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        aria-label="Close menu"
                    >
                        <X size={18} color="#374151" />
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                padding: '12px 14px',
                                background: '#f9fafb',
                                borderRadius: '8px',
                                color: '#374151',
                                fontWeight: 500,
                                fontSize: '14px',
                                textDecoration: 'none'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu User Actions */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                    {mounted && user ? (
                        <Link
                            href="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 14px',
                                background: '#f9fafb',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: '#374151'
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {user.avatar ? (
                                    <img
                                        src={user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span style={{ color: '#4f46e5', fontWeight: 600, fontSize: '13px' }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{user.name}</p>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>View Profile</p>
                            </div>
                        </Link>
                    ) : mounted && (
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '12px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                color: 'white',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '14px',
                                textDecoration: 'none'
                            }}
                        >
                            <User size={18} /> Sign In
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
