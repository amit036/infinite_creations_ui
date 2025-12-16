"use client";

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <>
            <Header />
            <main style={{
                minHeight: '100vh',
                background: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '100px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    maxWidth: '400px',
                    width: '100%',
                    margin: '0 16px'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 24px',
                        background: '#fef3c7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <XCircle size={40} color="#f59e0b" />
                    </div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        marginBottom: '8px'
                    }}>
                        Payment Cancelled
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                        You cancelled the payment process. Your order has not been placed.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            onClick={() => router.push('/checkout')}
                            style={{
                                padding: '12px 24px',
                                background: '#4f46e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Return to Checkout
                        </button>
                        <button
                            onClick={() => router.push('/shop')}
                            style={{
                                padding: '12px 24px',
                                background: 'white',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
