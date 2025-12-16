"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    User, MapPin, ShoppingBag, Heart, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { API_URL } from '../../services/api';

const menuItems = [
    { href: '/profile', icon: User, label: 'My Profile' },
    { href: '/profile/addresses', icon: MapPin, label: 'Addresses' },
    { href: '/profile/orders', icon: ShoppingBag, label: 'My Orders' },
    { href: '/profile/wishlist', icon: Heart, label: 'Wishlist' },
    { href: '/profile/settings', icon: Settings, label: 'Settings' },
];

export default function ProfileLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !loading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [mounted, loading, user, router]);

    if (!mounted || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <Header />
            <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
                <div className="page-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        {/* Sidebar */}
                        <aside style={{ width: '280px', flexShrink: 0 }}>
                            {/* User Card */}
                            <div style={{
                                background: 'white', borderRadius: '16px', padding: '24px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
                                    background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden', border: '3px solid #c7d2fe'
                                }}>
                                    {user.avatar ? (
                                        <img src={user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '32px', color: '#4f46e5', fontWeight: 'bold' }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <h2 style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{user.name}</h2>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>{user.email}</p>
                            </div>

                            {/* Menu */}
                            <div style={{
                                background: 'white', borderRadius: '16px', overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '14px 20px', textDecoration: 'none',
                                                background: isActive ? '#e0e7ff' : 'transparent',
                                                borderLeft: isActive ? '3px solid #4f46e5' : '3px solid transparent',
                                                transition: 'all 0.15s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Icon size={20} color={isActive ? '#4f46e5' : '#6b7280'} />
                                                <span style={{ fontWeight: isActive ? 600 : 500, color: isActive ? '#4f46e5' : '#374151' }}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronRight size={18} color="#9ca3af" />
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={() => { logout(); router.push('/'); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '14px 20px', width: '100%', textAlign: 'left',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        borderTop: '1px solid #e5e7eb', color: '#dc2626'
                                    }}
                                >
                                    <LogOut size={20} />
                                    <span style={{ fontWeight: 500 }}>Logout</span>
                                </button>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main style={{ flex: 1, minWidth: 0 }}>
                            {children}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
