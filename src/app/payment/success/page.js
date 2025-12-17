"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { api } from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function PayPalSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [error, setError] = useState('');

    useEffect(() => {
        capturePayment();
    }, []);

    const capturePayment = async () => {
        // Get PayPal token from URL (PayPal sends token parameter on approval)
        const token = searchParams.get('token');

        // Get stored order info
        const storedInfo = localStorage.getItem('paypalOrderInfo');
        if (!storedInfo) {
            setStatus('failed');
            setError('Order information not found. Please try again.');
            return;
        }

        const { orderId, paypalOrderId } = JSON.parse(storedInfo);

        if (!orderId || !paypalOrderId) {
            setStatus('failed');
            setError('Invalid order information');
            return;
        }

        try {
            // Capture the PayPal payment
            const result = await api.post('/payments/paypal/capture-order', {
                paypalOrderId: paypalOrderId,
                orderId: orderId
            });

            if (result.success) {
                setStatus('success');
                clearCart();
                // Clean up stored info
                localStorage.removeItem('paypalOrderInfo');
                // Redirect to order confirmation after 2 seconds
                setTimeout(() => {
                    router.push(`/order-confirmation/${orderId}`);
                }, 2000);
            } else {
                setStatus('failed');
                setError(result.message || 'Payment capture failed');
            }
        } catch (err) {
            console.error('PayPal capture error:', err);
            setStatus('failed');
            setError(err.message || 'Failed to capture payment');
        }
    };

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
                    {status === 'verifying' && (
                        <>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                margin: '0 auto 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Loader
                                    size={48}
                                    color="#003087"
                                    style={{
                                        animation: 'spin 1s linear infinite'
                                    }}
                                />
                            </div>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#111827',
                                marginBottom: '8px'
                            }}>
                                Completing Payment
                            </h1>
                            <p style={{ color: '#6b7280' }}>
                                Please wait while we confirm your PayPal payment...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                margin: '0 auto 24px',
                                background: '#d1fae5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CheckCircle size={40} color="#059669" />
                            </div>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#059669',
                                marginBottom: '8px'
                            }}>
                                Payment Successful!
                            </h1>
                            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                                Your PayPal payment has been confirmed. Redirecting to order confirmation...
                            </p>
                            <div style={{
                                width: '100%',
                                height: '4px',
                                background: '#e5e7eb',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#059669',
                                    animation: 'progress 2s linear forwards'
                                }} />
                            </div>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                margin: '0 auto 24px',
                                background: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <XCircle size={40} color="#dc2626" />
                            </div>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#dc2626',
                                marginBottom: '8px'
                            }}>
                                Payment Failed
                            </h1>
                            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                                {error || 'Something went wrong with your payment.'}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => router.push('/checkout')}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#003087',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Try Again
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
                        </>
                    )}
                </div>
            </main>
            <Footer />

            <style jsx global>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes progress {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </>
    );
}
