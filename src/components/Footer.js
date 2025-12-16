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
            { label: 'Accessories', href: '/shop?category=accessories' },
        ],
        company: [
            { label: 'About Us', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Press', href: '#' },
        ],
        support: [
            { label: 'Help Center', href: '#' },
            { label: 'Track Order', href: '#' },
            { label: 'Shipping Info', href: '#' },
            { label: 'Returns', href: '#' },
            { label: 'Contact Us', href: '#' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Cookie Policy', href: '#' },
        ],
    };

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹2,000' },
        { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support team' },
        { icon: CreditCard, title: 'Easy Returns', desc: '30-day return policy' },
    ];

    return (
        <footer style={{ background: '#111827', color: 'white' }}>
            {/* Features Bar */}
            <div style={{ borderBottom: '1px solid #374151' }}>
                <div className="page-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Icon size={24} color="white" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, marginBottom: '2px' }}>{feature.title}</p>
                                        <p style={{ fontSize: '14px', color: '#9ca3af' }}>{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="page-container" style={{ paddingTop: '56px', paddingBottom: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '48px' }}>
                    {/* Brand */}
                    <div>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '20px' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                <Image src={logo} alt="IC" width={44} height={44} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
                                Infinite Creations
                            </span>
                        </Link>
                        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '24px' }}>
                            Your one-stop destination for premium quality products. We bring you the finest selection of electronics, fashion, and lifestyle products.
                        </p>

                        {/* Contact Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
                                <Mail size={18} />
                                <span>support@infinitecreations.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
                                <Phone size={18} />
                                <span>+91 1800-123-4567</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af' }}>
                                <MapPin size={18} />
                                <span>Mumbai, Maharashtra, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '20px', color: 'white' }}>Shop</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.shop.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '20px', color: 'white' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.company.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '20px', color: 'white' }}>Support</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footerLinks.support.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontWeight: 600, marginBottom: '20px', color: 'white' }}>Newsletter</h4>
                        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
                            Subscribe for exclusive deals and updates
                        </p>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input
                                type="email"
                                placeholder="Your email"
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#1f2937',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button style={{
                                padding: '12px 20px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                Subscribe
                            </button>
                        </div>

                        {/* Social Icons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: '#1f2937',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#9ca3af',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ borderTop: '1px solid #374151' }}>
                <div className="page-container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            © {currentYear} Infinite Creations. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {footerLinks.legal.map((link, index) => (
                                <Link key={index} href={link.href} style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>We accept:</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['Visa', 'Mastercard', 'UPI', 'GPay'].map((method) => (
                                    <div key={method} style={{
                                        padding: '4px 10px',
                                        background: '#1f2937',
                                        borderRadius: '4px',
                                        fontSize: '11px',
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
