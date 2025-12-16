"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useRouter } from 'next/navigation';

import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Listen for Firebase Auth Changes
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // User logged in via Firebase
                const token = await currentUser.getIdToken();
                localStorage.setItem('accessToken', token);
                await checkUser(); // Verify with backend
            } else {
                // Firebase Logout
                // Only clear if not using legacy admin token? 
                // For simplicity, we assume generic logout clears everything.
            }
            setLoading(false);
        });

        checkUser();

        return () => unsubscribe();
    }, []);

    const checkUser = async () => {
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const userData = await api.get('/users/me');
                setUser(userData);
            }
        } catch (error) {
            console.warn("Auth check failed (session invalid), logging out:", error.message);
            localStorage.removeItem('accessToken');
            setUser(null);
            await signOut(auth);
        } finally {
            // Loading handled by onAuthStateChanged mostly, but safe to set false here too
        }
    };

    const login = async (email, password) => {
        // Legacy/Admin Login
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data.user);
        return data;
    };

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // The onAuthStateChanged listener will handle the token storage
            const token = await result.user.getIdToken();
            localStorage.setItem('accessToken', token);
            await checkUser();
            return result.user;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const signup = async (data) => {
        const res = await api.post('/auth/signup', data);
        return res;
    };

    const logout = async () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        await signOut(auth); // Firebase SignOut
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, loginWithGoogle, signup, logout, loading, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        return { user: null, setUser: () => { }, login: () => { }, signup: () => { }, logout: () => { }, loading: true };
    }
    return context;
};
