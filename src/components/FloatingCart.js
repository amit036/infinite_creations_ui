"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingCart() {
    const { items } = useCart();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!mounted) return null;

    // Total quantity
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Don't show if cart is empty OR if we are already on checkout/cart page
    if (cartCount === 0 || pathname === '/checkout' || pathname === '/cart' || pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: isMobile ? '16px' : '24px',
            right: isMobile ? '16px' : '24px',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out'
        }}>
            <Link
                href="/checkout"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '8px' : '12px',
                    padding: isMobile ? '10px 18px' : '12px 24px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: 'white',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    boxShadow: isHovered
                        ? '0 15px 30px rgba(79, 70, 229, 0.5)'
                        : '0 10px 25px rgba(79, 70, 229, 0.4)',
                    fontWeight: 600,
                    transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart size={isMobile ? 20 : 24} />
                    <span style={{
                        position: 'absolute',
                        top: isMobile ? '-8px' : '-10px',
                        right: isMobile ? '-8px' : '-10px',
                        background: '#ef4444',
                        color: 'white',
                        fontSize: isMobile ? '9px' : '10px',
                        width: isMobile ? '18px' : '20px',
                        height: isMobile ? '18px' : '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        fontWeight: 'bold'
                    }}>
                        {cartCount}
                    </span>
                </div>
                <span style={{
                    fontSize: isMobile ? '13px' : '15px',
                    whiteSpace: 'nowrap'
                }}>
                    Checkout Now
                </span>
                <ArrowRight size={isMobile ? 16 : 18} />
            </Link>

            <style jsx global>{`
                @keyframes slideIn {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
