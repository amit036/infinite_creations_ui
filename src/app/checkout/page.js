"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ShoppingCart, CreditCard, MapPin, Tag, X, Check, ArrowLeft, Home, Building, MapPinned, Wallet, Banknote, Smartphone, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Payment gateway icons
import razorpayIcon from '../../assets/razorpay.png';
import phonepeIcon from '../../assets/phonepay.png';
import paypalIcon from '../../assets/paypal.png';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const currentOrderIdRef = useRef(null);

    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [razorpayReady, setRazorpayReady] = useState(false);
    const [razorpayKey, setRazorpayKey] = useState('');
    const [siteSettings, setSiteSettings] = useState(null);

    // Payment method: razorpay, phonepe, paypal, cod
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    // Saved addresses
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    // Shipping form
    const [shipping, setShipping] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
    });

    useEffect(() => {
        setMounted(true);
        // Fetch payment config
        fetchPaymentConfig();
        if (user) {
            setShipping(s => ({ ...s, name: user.name || '' }));
            loadSavedAddresses();
            fetchAvailableCoupons();
        }
    }, [user]);

    useEffect(() => {
        if (mounted && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [mounted, user, router]);

    async function fetchPaymentConfig() {
        try {
            const [config, settings] = await Promise.all([
                api.get('/payments/config'),
                api.get('/settings')
            ]);

            if (config.razorpay?.key) {
                setRazorpayKey(config.razorpay.key);
            }

            setSiteSettings(settings);

            // Set default payment method based on enabled options
            if (settings.paymentMethods) {
                const methods = settings.paymentMethods;
                if (methods.razorpay) setPaymentMethod('razorpay');
                else if (methods.phonepe) setPaymentMethod('phonepe');
                else if (methods.paypal) setPaymentMethod('paypal');
                else if (methods.cod) setPaymentMethod('cod');
            }
        } catch (err) {
            console.error('Failed to fetch payment config:', err);
        }
    }

    async function loadSavedAddresses() {
        try {
            const addresses = await api.get('/users/me/addresses');
            setSavedAddresses(addresses || []);
            const defaultAddr = addresses?.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (addresses?.length > 0) {
                setSelectedAddressId(addresses[0].id);
            } else {
                setUseNewAddress(true);
            }
        } catch (err) {
            console.error('Failed to load addresses:', err);
            setUseNewAddress(true);
        } finally {
            setLoadingAddresses(false);
        }
    }

    async function fetchAvailableCoupons() {
        setLoadingCoupons(true);
        try {
            // Get all coupons - the backend will filter them or we can filter active ones
            // Actually, we need a public endpoint for 'available' coupons or we can use the admin one if the user has permission?
            // No, we should probably have a public endpoint. Let's check routes/coupons.js again.
            // It has router.get('/', auth, adminOnly, async ...) so we can't use it.
            // I should create a public endpoint or just fetch it here if I can.
            // For now, let's assume there's a public 'list' or we'll just show the one from the promo bar.
            // Wait, I can add a public endpoint to list active coupons.
            const res = await api.get('/coupons/available');
            setAvailableCoupons(res || []);
        } catch (err) {
            console.error('Failed to fetch coupons:', err);
        } finally {
            setLoadingCoupons(false);
        }
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await api.post('/coupons/validate', { code: couponCode, subtotal: total });
            setAppliedCoupon(res);
            setCouponCode('');
        } catch (err) {
            setCouponError(err.message || 'Invalid coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    const getShippingData = () => {
        if (useNewAddress) {
            return {
                shippingName: shipping.name,
                shippingAddress: shipping.address,
                shippingCity: shipping.city,
                shippingState: shipping.state,
                shippingZip: shipping.zip,
                shippingPhone: shipping.phone,
            };
        } else {
            const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId);
            if (!selectedAddr) return null;
            return {
                shippingName: selectedAddr.name,
                shippingAddress: selectedAddr.address,
                shippingCity: selectedAddr.city,
                shippingState: selectedAddr.state,
                shippingZip: selectedAddr.zip,
                shippingPhone: selectedAddr.phone,
            };
        }
    };

    // Create order in backend
    const createOrder = async (paymentMethodName) => {
        const shippingData = getShippingData();
        if (!shippingData) {
            setError('Please select a shipping address');
            return null;
        }

        try {
            const orderData = {
                ...shippingData,
                paymentMethod: paymentMethodName,
                couponCode: appliedCoupon?.code || null,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                })),
            };

            const order = await api.post('/orders', orderData);
            currentOrderIdRef.current = order.id;
            return order;
        } catch (err) {
            setError(err.message || 'Failed to create order');
            return null;
        }
    };

    // Cash on Delivery handler
    const handleCODOrder = async (e) => {
        e?.preventDefault();
        setLoading(true);
        setError('');

        try {
            const order = await createOrder('COD');
            if (order) {
                clearCart();
                router.push(`/order-confirmation/${order.id}`);
            }
        } catch (err) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    // Razorpay handler
    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError('');

        try {
            // First create order in our system
            const order = await createOrder('RAZORPAY');
            if (!order) {
                setLoading(false);
                return;
            }

            // Create Razorpay order
            const razorpayOrder = await api.post('/payments/razorpay/create-order', {
                orderId: order.id,
                amount: finalTotal
            });

            // Open Razorpay checkout
            const options = {
                key: razorpayOrder.key || razorpayKey,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency || 'INR',
                name: 'Infinite Creations',
                description: `Order #${order.orderNumber}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verifyResult = await api.post('/payments/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: order.id
                        });

                        if (verifyResult.success) {
                            clearCart();
                            router.push(`/order-confirmation/${order.id}`);
                        } else {
                            setError('Payment verification failed');
                        }
                    } catch (err) {
                        setError(err.message || 'Payment verification failed');
                    }
                    setLoading(false);
                },
                prefill: {
                    name: getShippingData()?.shippingName || user?.name || '',
                    email: user?.email || '',
                    contact: getShippingData()?.shippingPhone || ''
                },
                theme: {
                    color: '#4f46e5'
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError(response.error.description || 'Payment failed');
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            console.error('Razorpay error:', err);
            setError(err.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    // PhonePe handler
    const handlePhonePePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // First create order in our system
            const order = await createOrder('PHONEPE');
            if (!order) {
                setLoading(false);
                return;
            }

            // Create PhonePe order
            const phonePeOrder = await api.post('/payments/phonepe/create-order', {
                orderId: order.id,
                amount: finalTotal
            });

            if (phonePeOrder.success && phonePeOrder.redirectUrl) {
                // Redirect to PhonePe payment page
                window.location.href = phonePeOrder.redirectUrl;
            } else {
                setError(phonePeOrder.message || 'Failed to create PhonePe payment');
                setLoading(false);
            }
        } catch (err) {
            console.error('PhonePe error:', err);
            setError(err.message || 'Failed to initiate PhonePe payment');
            setLoading(false);
        }
    };

    // PayPal handler
    const handlePayPalPayment = async () => {
        setLoading(true);
        setError('');

        try {
            // First create order in our system
            const order = await createOrder('PAYPAL');
            if (!order) {
                setLoading(false);
                return;
            }

            // Create PayPal order
            const paypalOrder = await api.post('/payments/paypal/create-order', {
                orderId: order.id,
                amount: (finalTotal / 83).toFixed(2), // Convert INR to USD (approximate)
                currency: 'USD'
            });

            if (paypalOrder.id) {
                // Find the approval URL
                const approvalUrl = paypalOrder.links?.find(link => link.rel === 'approve')?.href;
                if (approvalUrl) {
                    // Store order info for callback
                    localStorage.setItem('paypalOrderInfo', JSON.stringify({
                        orderId: order.id,
                        paypalOrderId: paypalOrder.id
                    }));
                    // Redirect to PayPal
                    window.location.href = approvalUrl;
                } else {
                    setError('Failed to get PayPal approval URL');
                    setLoading(false);
                }
            } else {
                setError(paypalOrder.message || 'Failed to create PayPal order');
                setLoading(false);
            }
        } catch (err) {
            console.error('PayPal error:', err);
            setError(err.message || 'Failed to initiate PayPal payment');
            setLoading(false);
        }
    };

    // Handle payment based on selected method
    const handlePayment = async () => {
        switch (paymentMethod) {
            case 'razorpay':
                await handleRazorpayPayment();
                break;
            case 'phonepe':
                await handlePhonePePayment();
                break;
            case 'paypal':
                await handlePayPalPayment();
                break;
            case 'cod':
                await handleCODOrder();
                break;
            default:
                setError('Please select a payment method');
        }
    };

    const subtotal = total;
    const discount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
    const freeShippingThreshold = siteSettings?.freeShippingThreshold ?? 2000;
    const defaultShippingCost = siteSettings?.defaultShippingCost ?? 99;
    const shipping_cost = subtotal >= freeShippingThreshold ? 0 : defaultShippingCost;
    const finalTotal = subtotal - discount + shipping_cost;

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <>
                <Header />
                <main style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <ShoppingCart size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Your cart is empty</h1>
                        <Link href="/shop" style={{ color: '#4f46e5', fontWeight: 500 }}>Continue Shopping</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            {/* Razorpay Script */}
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('Razorpay SDK loaded');
                    setRazorpayReady(true);
                }}
                onError={(e) => {
                    console.error('Failed to load Razorpay SDK:', e);
                }}
            />

            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
                <div className="checkout-container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                    <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6b7280', marginBottom: '24px', textDecoration: 'none' }}>
                        <ArrowLeft size={20} /> Back to Cart
                    </Link>

                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>Checkout</h1>

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                            {error}
                        </div>
                    )}

                    <div className="checkout-grid">
                        {/* Left Column - Address & Payment */}
                        <div>
                            {/* Shipping Address */}
                            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={20} /> Shipping Address
                                </h2>

                                {!loadingAddresses && savedAddresses.length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                            <button
                                                onClick={() => setUseNewAddress(false)}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '8px',
                                                    border: useNewAddress ? '1px solid #d1d5db' : '2px solid #4f46e5',
                                                    background: useNewAddress ? 'white' : '#e0e7ff',
                                                    color: useNewAddress ? '#6b7280' : '#4f46e5',
                                                    fontWeight: 500, cursor: 'pointer'
                                                }}
                                            >
                                                Saved Addresses
                                            </button>
                                            <button
                                                onClick={() => setUseNewAddress(true)}
                                                style={{
                                                    padding: '8px 16px', borderRadius: '8px',
                                                    border: !useNewAddress ? '1px solid #d1d5db' : '2px solid #4f46e5',
                                                    background: !useNewAddress ? 'white' : '#e0e7ff',
                                                    color: !useNewAddress ? '#6b7280' : '#4f46e5',
                                                    fontWeight: 500, cursor: 'pointer'
                                                }}
                                            >
                                                New Address
                                            </button>
                                        </div>

                                        {!useNewAddress && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {savedAddresses.map(addr => (
                                                    <label
                                                        key={addr.id}
                                                        style={{
                                                            display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px',
                                                            border: selectedAddressId === addr.id ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                                                            borderRadius: '12px', cursor: 'pointer',
                                                            background: selectedAddressId === addr.id ? '#f5f3ff' : 'white'
                                                        }}
                                                    >
                                                        <input
                                                            type="radio" name="savedAddress"
                                                            checked={selectedAddressId === addr.id}
                                                            onChange={() => setSelectedAddressId(addr.id)}
                                                            style={{ marginTop: '4px' }}
                                                        />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                                {addr.label === 'Home' ? <Home size={16} color="#4f46e5" /> :
                                                                    addr.label === 'Work' ? <Building size={16} color="#4f46e5" /> :
                                                                        <MapPinned size={16} color="#4f46e5" />}
                                                                <span style={{ fontWeight: 600 }}>{addr.label}</span>
                                                                {addr.isDefault && (
                                                                    <span style={{ fontSize: '11px', background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: '10px' }}>Default</span>
                                                                )}
                                                            </div>
                                                            <p style={{ fontSize: '14px', color: '#374151' }}>{addr.name}</p>
                                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{addr.address}, {addr.city}, {addr.state} {addr.zip}</p>
                                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{addr.phone}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(useNewAddress || savedAddresses.length === 0) && (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Full Name *</label>
                                            <input type="text" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} required
                                                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Address *</label>
                                            <input type="text" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} required placeholder="Street address"
                                                style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                                        </div>
                                        <div className="form-row">
                                            <div>
                                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>City *</label>
                                                <input type="text" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} required
                                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>State *</label>
                                                <input type="text" value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} required
                                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div>
                                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>PIN Code *</label>
                                                <input type="text" value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} required
                                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Phone *</label>
                                                <input type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} required
                                                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={20} /> Payment Method
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* Razorpay */}
                                    {(siteSettings?.paymentMethods?.razorpay ?? true) && (
                                        <label style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                            border: paymentMethod === 'razorpay' ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                                            borderRadius: '12px', cursor: 'pointer',
                                            background: paymentMethod === 'razorpay' ? '#f5f3ff' : 'white'
                                        }}>
                                            <input type="radio" name="paymentMethod" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                                                <img src={razorpayIcon.src} alt="Razorpay" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600 }}>Razorpay</p>
                                                <p style={{ fontSize: '14px', color: '#6b7280' }}>Cards, UPI, Wallets, Net Banking</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <img src="https://cdn.razorpay.com/static/assets/pay_methods_branding/rounded.svg" alt="Payment methods" style={{ height: '24px' }} onError={(e) => e.target.style.display = 'none'} />
                                            </div>
                                        </label>
                                    )}

                                    {/* PhonePe */}
                                    {(siteSettings?.paymentMethods?.phonepe ?? true) && (
                                        <label style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                            border: paymentMethod === 'phonepe' ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                                            borderRadius: '12px', cursor: 'pointer',
                                            background: paymentMethod === 'phonepe' ? '#f5f3ff' : 'white'
                                        }}>
                                            <input type="radio" name="paymentMethod" checked={paymentMethod === 'phonepe'} onChange={() => setPaymentMethod('phonepe')} />
                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                                                <img src={phonepeIcon.src} alt="PhonePe" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600 }}>PhonePe</p>
                                                <p style={{ fontSize: '14px', color: '#6b7280' }}>UPI, Cards, Wallet</p>
                                            </div>
                                            <div style={{
                                                background: '#5f259f',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: 600
                                            }}>
                                                PhonePe
                                            </div>
                                        </label>
                                    )}

                                    {/* PayPal */}
                                    {(siteSettings?.paymentMethods?.paypal ?? true) && (
                                        <label style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                            border: paymentMethod === 'paypal' ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                                            borderRadius: '12px', cursor: 'pointer',
                                            background: paymentMethod === 'paypal' ? '#f5f3ff' : 'white'
                                        }}>
                                            <input type="radio" name="paymentMethod" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                                                <img src={paypalIcon.src} alt="PayPal" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600 }}>PayPal</p>
                                                <p style={{ fontSize: '14px', color: '#6b7280' }}>Pay securely with PayPal</p>
                                            </div>
                                            <div style={{
                                                background: '#003087',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: 600
                                            }}>
                                                PayPal
                                            </div>
                                        </label>
                                    )}

                                    {/* Cash on Delivery */}
                                    {(siteSettings?.paymentMethods?.cod ?? true) && (
                                        <label style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
                                            border: paymentMethod === 'cod' ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                                            borderRadius: '12px', cursor: 'pointer',
                                            background: paymentMethod === 'cod' ? '#f5f3ff' : 'white'
                                        }}>
                                            <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                            <div style={{ width: '40px', height: '40px', background: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Banknote size={20} color="white" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600 }}>Cash on Delivery</p>
                                                <p style={{ fontSize: '14px', color: '#6b7280' }}>Pay when your order is delivered</p>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Coupon */}
                            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag size={20} /> Have a coupon?
                                </h2>

                                {appliedCoupon ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#d1fae5', padding: '12px 16px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Check size={18} color="#059669" />
                                            <span style={{ fontWeight: 600, color: '#059669' }}>{appliedCoupon.code}</span>
                                            <span style={{ color: '#059669' }}>- {formatPrice(discount)} off</span>
                                        </div>
                                        <button onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <X size={18} color="#059669" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Enter coupon code"
                                                style={{ flex: 1, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                            />
                                            <button
                                                type="button"
                                                id="apply-coupon-btn"
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading}
                                                style={{ padding: '12px 24px', background: '#111827', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: couponLoading ? 0.5 : 1 }}
                                            >
                                                {couponLoading ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '8px', marginBottom: '16px' }}>{couponError}</p>}

                                        {/* Available Coupons Suggestions */}
                                        {availableCoupons.length > 0 && (
                                            <div style={{ marginTop: '20px' }}>
                                                <p style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Coupons</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {availableCoupons.map(coupon => (
                                                        <div
                                                            key={coupon.id}
                                                            onClick={() => {
                                                                setCouponCode(coupon.code);
                                                                // Auto trigger apply
                                                                setTimeout(() => {
                                                                    const btn = document.getElementById('apply-coupon-btn');
                                                                    if (btn) btn.click();
                                                                }, 0);
                                                            }}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                padding: '12px', border: '1px dashed #d1d5db', borderRadius: '10px',
                                                                cursor: 'pointer', transition: 'all 0.2s',
                                                                background: couponCode === coupon.code ? '#f5f3ff' : 'white',
                                                                borderColor: couponCode === coupon.code ? '#4f46e5' : '#d1d5db'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4f46e5'}
                                                            onMouseLeave={(e) => {
                                                                if (couponCode !== coupon.code) e.currentTarget.style.borderColor = '#d1d5db';
                                                            }}
                                                        >
                                                            <div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{coupon.code}</span>
                                                                    {coupon.firstOrderOnly && (
                                                                        <span style={{ fontSize: '10px', background: '#e0e7ff', color: '#4f46e5', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>1st Order Only</span>
                                                                    )}
                                                                </div>
                                                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                                    {coupon.discountType === 'percentage' ? `${Number(coupon.discountValue)}% Off` : `₹${Number(coupon.discountValue)} Off`}
                                                                    {coupon.minOrderValue ? ` • Min order ₹${Number(coupon.minOrderValue)}` : ''}
                                                                </p>
                                                            </div>
                                                            <span style={{ fontSize: '13px', color: '#4f46e5', fontWeight: 600 }}>Apply</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div>
                            <div className="order-summary-card">
                                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Order Summary</h2>

                                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '24px' }}>
                                    {items.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#f3f4f6', flexShrink: 0, overflow: 'hidden' }}>
                                                {item.images?.[0] ? (
                                                    <img src={getImageUrl(item.images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : '📦'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</p>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>Qty: {item.quantity}</p>
                                            </div>
                                            <p style={{ fontWeight: 600 }}>{formatPrice(Number(item.salePrice || item.price) * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#6b7280' }}>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#059669' }}>
                                            <span>Discount</span>
                                            <span>-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ color: '#6b7280' }}>Shipping</span>
                                        <span style={{ color: shipping_cost === 0 ? '#059669' : 'inherit' }}>
                                            {shipping_cost === 0 ? 'Free' : formatPrice(shipping_cost)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                        <span>Total</span>
                                        <span>{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={loading || (paymentMethod === 'razorpay' && !razorpayReady)}
                                    style={{
                                        width: '100%', padding: '16px', marginTop: '24px',
                                        background: paymentMethod === 'razorpay'
                                            ? 'linear-gradient(135deg, #072654, #3395FF)'
                                            : paymentMethod === 'phonepe'
                                                ? 'linear-gradient(135deg, #5f259f, #8b3dbd)'
                                                : paymentMethod === 'paypal'
                                                    ? 'linear-gradient(135deg, #003087, #009cde)'
                                                    : 'linear-gradient(135deg, #059669, #047857)',
                                        color: 'white', border: 'none',
                                        borderRadius: '12px', fontWeight: 600, fontSize: '16px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                border: '2px solid white',
                                                borderTopColor: 'transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                            Processing...
                                        </>
                                    ) : paymentMethod === 'razorpay' ? (
                                        <>
                                            <CreditCard size={20} />
                                            Pay with Razorpay
                                        </>
                                    ) : paymentMethod === 'phonepe' ? (
                                        <>
                                            <Smartphone size={20} />
                                            Pay with PhonePe
                                        </>
                                    ) : paymentMethod === 'paypal' ? (
                                        <>
                                            <Globe size={20} />
                                            Pay with PayPal
                                        </>
                                    ) : (
                                        <>
                                            <Banknote size={20} />
                                            Place Order (COD)
                                        </>
                                    )}
                                </button>

                                <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
                                    Free shipping on orders over {formatPrice(freeShippingThreshold)}
                                </p>

                                {/* Security badges */}
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#6b7280', fontSize: '12px' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        Secure Payment • 256-bit SSL Encryption
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Spinner animation */}
            <style jsx global>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .checkout-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 32px 16px 64px;
                }

                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 32px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .order-summary-card {
                    background: white;
                    border-radius: 16px;
                    padding: 28px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: 1px solid rgba(229, 231, 235, 0.6);
                    position: sticky;
                    top: 130px;
                }

                @media (max-width: 1024px) {
                    .checkout-grid {
                        grid-template-columns: 1fr 340px;
                        gap: 24px;
                    }
                }

                @media (max-width: 900px) {
                    .checkout-grid {
                        grid-template-columns: 1fr;
                    }

                    .order-summary-card {
                        position: static;
                        margin-top: 0;
                    }
                    
                    /* Move summary to bottom on tablet/mobile but keep it visible */
                    .checkout-grid > div:last-child {
                        order: 2;
                    }
                    .checkout-grid > div:first-child {
                        order: 1;
                    }
                }

                @media (max-width: 640px) {
                    .checkout-container {
                        padding: 16px 12px 40px;
                    }
                    
                    .checkout-container h1 {
                        font-size: 24px !important;
                        margin-bottom: 20px !important;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                    
                    .order-summary-card {
                        padding: 20px;
                    }
                    
                    .payment-method-card {
                        flex-direction: column;
                        align-items: flex-start !important;
                    }
                }
            `}</style>
        </>
    );
}
