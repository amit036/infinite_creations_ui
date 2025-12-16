"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (!loading && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            router.push('/unauthorized');
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!user) return null; // Will redirect

    return <>{children}</>;
}
