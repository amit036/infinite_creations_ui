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
            <div className="profile-layout-wrapper">
                <div className="page-container profile-page-container">
                    <div className="profile-grid">
                        {/* Sidebar - Desktop Only */}
                        <aside className="profile-sidebar">
                            <div className="sidebar-user-card">
                                <div className="sidebar-avatar">
                                    {user.avatar ? (
                                        <img src={user.avatar.startsWith('http') ? user.avatar : `${API_URL}${user.avatar}`} alt="" />
                                    ) : (
                                        <span>{user.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="sidebar-user-info">
                                    <h4>{user.name}</h4>
                                    <p>{user.email}</p>
                                </div>
                            </div>

                            <nav className="sidebar-nav">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                                        >
                                            <Icon size={18} />
                                            <span>{item.label}</span>
                                            <ChevronRight size={16} className="chevron" />
                                        </Link>
                                    );
                                })}
                                <button
                                    className="sidebar-logout"
                                    onClick={() => { logout(); router.push('/'); }}
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </aside>

                        {/* Mobile Navigation */}
                        <nav className="mobile-nav">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`mobile-nav-pill ${isActive ? 'active' : ''}`}
                                    >
                                        <Icon size={16} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Main Content */}
                        <main className="profile-content">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />

            <style jsx global>{`
                .profile-layout-wrapper {
                    min-height: 100vh;
                    background: #f8fafc;
                }

                .profile-page-container {
                    padding-top: 40px;
                    padding-bottom: 80px;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 260px 1fr;
                    gap: 32px;
                    align-items: start;
                }

                /* Sidebar */
                .profile-sidebar {
                    position: sticky;
                    top: 100px;
                }

                .sidebar-user-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 16px;
                }

                .sidebar-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .sidebar-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .sidebar-avatar span {
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                }

                .sidebar-user-info h4 {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 2px;
                }
                .sidebar-user-info p {
                    font-size: 13px;
                    color: #64748b;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 150px;
                }

                .sidebar-nav {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    text-decoration: none;
                    color: #64748b;
                    font-weight: 500;
                    font-size: 14px;
                    border-bottom: 1px solid #f1f5f9;
                    transition: all 0.15s;
                }
                .sidebar-link:last-of-type { border-bottom: none; }
                .sidebar-link:hover { background: #f8fafc; color: #4f46e5; }
                .sidebar-link.active {
                    background: #f5f3ff;
                    color: #4f46e5;
                    font-weight: 600;
                }
                .sidebar-link .chevron {
                    margin-left: auto;
                    opacity: 0.4;
                }

                .sidebar-logout {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    width: 100%;
                    background: none;
                    border: none;
                    border-top: 1px solid #f1f5f9;
                    color: #ef4444;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                }

                /* Mobile Nav - Hidden on Desktop */
                .mobile-nav {
                    display: none;
                }

                /* Profile Content */
                .profile-content {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 32px;
                    min-height: 400px;
                }

                /* ========== MOBILE STYLES ========== */
                @media (max-width: 900px) {
                    .profile-page-container {
                        padding-top: 0;
                        padding-bottom: 40px;
                    }

                    .profile-grid {
                        display: block;
                    }

                    .profile-sidebar {
                        display: none;
                    }

                    .mobile-nav {
                        display: flex;
                        gap: 8px;
                        padding: 12px 0;
                        overflow-x: auto;
                        scrollbar-width: none;
                        margin-bottom: 20px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .mobile-nav::-webkit-scrollbar { display: none; }

                    .mobile-nav-pill {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        padding: 10px 16px;
                        background: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 50px;
                        text-decoration: none;
                        color: #64748b;
                        font-weight: 600;
                        font-size: 13px;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .mobile-nav-pill.active {
                        background: #0f172a;
                        color: white;
                        border-color: #0f172a;
                    }

                    .profile-content {
                        border: none;
                        border-radius: 0;
                        padding: 0;
                        background: transparent;
                    }
                }
            `}</style>
        </>
    );
}

