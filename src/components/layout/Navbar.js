"use client";

import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="page-container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <Image src={logo} alt="IC" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold hidden sm:block" style={{
                            background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Infinite Creations
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Shop
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ShoppingCart size={20} />
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full" style={{ background: '#4f46e5' }}>
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {mounted && user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e0e7ff' }}>
                                        <span className="font-semibold text-sm" style={{ color: '#4f46e5' }}>
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block font-medium">{user.name?.split(' ')[0]}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="p-2">
                                        {user.role === 'ADMIN' && (
                                            <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : mounted ? (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors"
                                style={{ background: '#4f46e5' }}
                            >
                                <User size={18} />
                                <span className="hidden sm:block">Sign In</span>
                            </Link>
                        ) : null}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
                    <div className="p-4 space-y-4">
                        <Link href="/" className="block py-2 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="block py-2 text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
