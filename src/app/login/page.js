"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });

    const { login, signup, user, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    useEffect(() => setMounted(true), []);

    // Redirect if already logged in
    useEffect(() => {
        if (mounted && user) {
            if (user?.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push(redirect || '/');
            }
        }
    }, [mounted, user, redirect, router]);

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(err.message || 'Failed to login with Google');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const data = await login(formData.email, formData.password);
                if (data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push(redirect || '/');
                }
            } else {
                await signup({ name: formData.name, email: formData.email, password: formData.password });
                const data = await login(formData.email, formData.password);
                if (data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push(redirect || '/');
                }
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div style={{
            width: '100%',
            maxWidth: '400px',
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    width: '64px', height: '64px', margin: '0 auto 16px',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <Image src={logo} alt="IC" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>
                    {isLogin ? 'Sign in to continue shopping' : 'Join us for exclusive deals'}
                </p>
            </div>

            {/* ERROR DISPLAY HERE */}
            {error && (
                <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    color: '#b91c1c', padding: '12px 16px', borderRadius: '8px',
                    marginBottom: '24px', fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            {/* Social Login */}
            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: 'white',
                        color: '#374151',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign in with Google
                </button>
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '8px' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {!isLogin && (
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={20} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                required={!isLogin}
                                style={{
                                    width: '100%', padding: '12px 16px 12px 48px',
                                    border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                        Email
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                            style={{
                                width: '100%', padding: '12px 16px 12px 48px',
                                border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                        Password
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            style={{
                                width: '100%', padding: '12px 48px 12px 48px',
                                border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </form>

            {/* Toggle */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p style={{ color: '#6b7280' }}>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{
                            marginLeft: '8px', color: '#4f46e5', fontWeight: 500,
                            background: 'none', border: 'none', cursor: 'pointer'
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>

            {/* Demo Accounts */}
            <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>Demo Accounts:</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Admin: admin@shop.com / password123</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>User: user@shop.com / password123</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Link href="/" style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        }}>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
