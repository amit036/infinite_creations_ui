"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import {
    LayoutDashboard, Package, ShoppingCart, FolderTree,
    Users, Settings, LogOut, Menu, X, ChevronRight, Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!loading && mounted) {
            if (!user) {
                router.push('/login?redirect=/admin');
            } else if (user.role !== 'ADMIN') {
                router.push('/');
            }
        }
    }, [user, loading, mounted, router]);

    if (!mounted || loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '260px' : '72px',
                background: '#1f2937',
                transition: 'width 0.3s',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo */}
                <div style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    borderBottom: '1px solid #374151'
                }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        overflow: 'hidden', flexShrink: 0
                    }}>
                        <Image src={logo} alt="IC" width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {sidebarOpen && (
                        <span style={{ marginLeft: '12px', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                            Admin Panel
                        </span>
                    )}
                </div>

                {/* Menu */}
                <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    marginBottom: '4px',
                                    textDecoration: 'none',
                                    color: isActive ? 'white' : '#9ca3af',
                                    background: isActive ? '#4f46e5' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span style={{ fontWeight: 500 }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 600, flexShrink: 0
                        }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </p>
                                <p style={{ color: '#9ca3af', fontSize: '12px' }}>Admin</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            width: '100%', padding: '12px 16px', marginTop: '12px',
                            borderRadius: '8px', border: 'none', background: '#374151',
                            color: '#9ca3af', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: sidebarOpen ? '260px' : '72px',
                transition: 'margin-left 0.3s'
            }}>
                {/* Header */}
                <header style={{
                    height: '64px',
                    background: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 30
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            padding: '8px', borderRadius: '8px', border: 'none',
                            background: '#f3f4f6', cursor: 'pointer'
                        }}
                    >
                        <Menu size={20} />
                    </button>
                    <Link href="/" style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Store <ChevronRight size={16} />
                    </Link>
                </header>

                {/* Page Content */}
                <div style={{ padding: '24px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
