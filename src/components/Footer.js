"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, CreditCard, Truck, Shield, Headphones } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { label: 'All Products', href: '/shop' },
            { label: 'Electronics', href: '/shop?category=electronics' },
            { label: 'Clothing', href: '/shop?category=clothing' },
            { label: 'Home & Living', href: '/shop?category=home-living' },
        ],
        support: [
            { label: 'Help Center', href: '#' },
            { label: 'Track Order', href: '#' },
            { label: 'Shipping Info', href: '#' },
            { label: 'Returns', href: '#' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms of Service', href: '/terms-of-service' },
        ],
    };

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹2,000' },
        { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support' },
        { icon: CreditCard, title: 'Easy Returns', desc: '30-day return policy' },
    ];

    return (
        <footer style={{ background: '#111827', color: 'white' }}>
            {/* Features Bar */}
            <div style={{ borderBottom: '1px solid #374151' }}>
                <div className="page-container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                    <div className="category-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={20} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '2px', fontSize: '14px' }}>{feature.title}</p>
                                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="page-container" style={{ paddingTop: '40px', paddingBottom: '32px' }}>
                <div className="footer-grid">
                    {/* Brand */}
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                overflow: 'hidden'
                            }}>
                                <Image src={logo} alt="IC" width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                                Infinite Creations
                            </span>
                        </Link>
                        <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '20px', fontSize: '14px' }}>
                            Your one-stop destination for premium quality products. We bring you the finest selection of electronics, fashion, and lifestyle products.
                        </p>

                        {/* Contact Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', fontSize: '14px' }}>
                                <Mail size={16} />
                                <span>support@infinitecreations.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', fontSize: '14px' }}>
                                <Phone size={16} />
                                <span>+91 1800-123-4567</span>
                            </div>
                        </div>

                        {/* Social Icons - Mobile */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '8px',
                                        background: '#1f2937',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#9ca3af',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'white', fontSize: '15px' }}>Shop</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {footerLinks.shop.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'white', fontSize: '15px' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {footerLinks.support.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '16px', color: 'white', fontSize: '15px' }}>Newsletter</h4>
                        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '14px' }}>
                            Subscribe for exclusive deals
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#1f2937',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '14px'
                                }}
                            />
                            <button style={{
                                padding: '12px 20px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}>
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ borderTop: '1px solid #374151' }}>
                <div className="page-container" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>
                            © {currentYear} Infinite Creations. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {footerLinks.legal.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>We accept:</span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {['Visa', 'Mastercard', 'UPI'].map((method) => (
                                    <div key={method} style={{
                                        padding: '3px 8px',
                                        background: '#1f2937',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        color: '#9ca3af'
                                    }}>
                                        {method}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
