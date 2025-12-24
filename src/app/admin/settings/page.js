"use client";

import { useEffect, useState } from 'react';
import { Save, Settings, Bell, Globe, CreditCard, Check, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [settings, setSettings] = useState({
        promoBarEnabled: true,
        promoBarMessage: '🎉 Free shipping on orders over ₹2,000 | Use code WELCOME10 for 10% off!',
        promoBarBgColor: '#1f2937',
        promoBarTextColor: '#ffffff',
        freeShippingThreshold: 2000,
        defaultShippingCost: 99,
        paymentMethods: {
            razorpay: true,
            phonepe: true,
            paypal: true,
            cod: true
        }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const data = await api.get('/settings');
            if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({
                    ...prev,
                    ...data
                }));
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/settings/bulk', { settings });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Site Settings</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>Configure your store settings</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 24px', background: saving ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: 'white', border: 'none', borderRadius: '10px',
                        fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                >
                    {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
            </div>

            {success && (
                <div style={{
                    background: '#d1fae5', color: '#059669', padding: '16px', borderRadius: '12px',
                    marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <Check size={20} /> Settings saved successfully!
                </div>
            )}

            {error && (
                <div style={{
                    background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '12px',
                    marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* Promo Bar Settings */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', background: '#e0e7ff', borderRadius: '10px' }}>
                        <Bell size={20} color="#4f46e5" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Promo Bar</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Configure the promotional banner at the top of your site</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                        <div>
                            <p style={{ fontWeight: 500, marginBottom: '4px' }}>Enable Promo Bar</p>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Show promotional message at the top of pages</p>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                            <input
                                type="checkbox"
                                checked={settings.promoBarEnabled}
                                onChange={(e) => setSettings({ ...settings, promoBarEnabled: e.target.checked })}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', inset: 0,
                                background: settings.promoBarEnabled ? '#4f46e5' : '#d1d5db',
                                borderRadius: '28px', transition: 'background 0.3s'
                            }}>
                                <span style={{
                                    position: 'absolute', height: '20px', width: '20px',
                                    left: settings.promoBarEnabled ? '28px' : '4px', bottom: '4px',
                                    background: 'white', borderRadius: '50%', transition: 'left 0.3s'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Promo Message</label>
                        <input
                            type="text"
                            value={settings.promoBarMessage}
                            onChange={(e) => setSettings({ ...settings, promoBarMessage: e.target.value })}
                            placeholder="Enter promotional message..."
                            style={{
                                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                                borderRadius: '10px', outline: 'none', fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Background Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="color"
                                    value={settings.promoBarBgColor}
                                    onChange={(e) => setSettings({ ...settings, promoBarBgColor: e.target.value })}
                                    style={{ width: '48px', height: '48px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    value={settings.promoBarBgColor}
                                    onChange={(e) => setSettings({ ...settings, promoBarBgColor: e.target.value })}
                                    style={{
                                        flex: 1, padding: '12px 16px', border: '1px solid #d1d5db',
                                        borderRadius: '10px', outline: 'none', fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Text Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <input
                                    type="color"
                                    value={settings.promoBarTextColor}
                                    onChange={(e) => setSettings({ ...settings, promoBarTextColor: e.target.value })}
                                    style={{ width: '48px', height: '48px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                />
                                <input
                                    type="text"
                                    value={settings.promoBarTextColor}
                                    onChange={(e) => setSettings({ ...settings, promoBarTextColor: e.target.value })}
                                    style={{
                                        flex: 1, padding: '12px 16px', border: '1px solid #d1d5db',
                                        borderRadius: '10px', outline: 'none', fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Preview</label>
                        <div style={{
                            background: settings.promoBarBgColor,
                            color: settings.promoBarTextColor,
                            padding: '12px 24px',
                            textAlign: 'center',
                            fontSize: '14px',
                            borderRadius: '8px'
                        }}>
                            {settings.promoBarMessage}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Settings */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', background: '#d1fae5', borderRadius: '10px' }}>
                        <Globe size={20} color="#059669" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Shipping</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Configure shipping costs and thresholds</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Free Shipping Threshold (₹)</label>
                        <input
                            type="number"
                            value={settings.freeShippingThreshold}
                            onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                            style={{
                                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                                borderRadius: '10px', outline: 'none', fontSize: '14px'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Default Shipping Cost (₹)</label>
                        <input
                            type="number"
                            value={settings.defaultShippingCost}
                            onChange={(e) => setSettings({ ...settings, defaultShippingCost: Number(e.target.value) })}
                            style={{
                                width: '100%', padding: '12px 16px', border: '1px solid #d1d5db',
                                borderRadius: '10px', outline: 'none', fontSize: '14px'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Payment Settings */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '10px' }}>
                        <CreditCard size={20} color="#d97706" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Payment Methods</h2>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Configure available payment methods</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {/* Razorpay */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#072654', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>RZ</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>Razorpay</p>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>Cards, UPI, NetBanking</p>
                            </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                            <input
                                type="checkbox"
                                checked={settings.paymentMethods?.razorpay ?? true}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    paymentMethods: { ...settings.paymentMethods, razorpay: e.target.checked }
                                })}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', inset: 0,
                                background: settings.paymentMethods?.razorpay ? '#4f46e5' : '#d1d5db',
                                borderRadius: '28px', transition: 'background 0.3s'
                            }}>
                                <span style={{
                                    position: 'absolute', height: '20px', width: '20px',
                                    left: settings.paymentMethods?.razorpay ? '28px' : '4px', bottom: '4px',
                                    background: 'white', borderRadius: '50%', transition: 'left 0.3s'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    {/* PhonePe */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#5f259f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>PP</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>PhonePe</p>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>UPI, Cards, Wallet</p>
                            </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                            <input
                                type="checkbox"
                                checked={settings.paymentMethods?.phonepe ?? true}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    paymentMethods: { ...settings.paymentMethods, phonepe: e.target.checked }
                                })}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', inset: 0,
                                background: settings.paymentMethods?.phonepe ? '#4f46e5' : '#d1d5db',
                                borderRadius: '28px', transition: 'background 0.3s'
                            }}>
                                <span style={{
                                    position: 'absolute', height: '20px', width: '20px',
                                    left: settings.paymentMethods?.phonepe ? '28px' : '4px', bottom: '4px',
                                    background: 'white', borderRadius: '50%', transition: 'left 0.3s'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    {/* PayPal */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#003087', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>PY</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>PayPal</p>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>International orders</p>
                            </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                            <input
                                type="checkbox"
                                checked={settings.paymentMethods?.paypal ?? true}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    paymentMethods: { ...settings.paymentMethods, paypal: e.target.checked }
                                })}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', inset: 0,
                                background: settings.paymentMethods?.paypal ? '#4f46e5' : '#d1d5db',
                                borderRadius: '28px', transition: 'background 0.3s'
                            }}>
                                <span style={{
                                    position: 'absolute', height: '20px', width: '20px',
                                    left: settings.paymentMethods?.paypal ? '28px' : '4px', bottom: '4px',
                                    background: 'white', borderRadius: '50%', transition: 'left 0.3s'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    {/* Cash on Delivery */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>₹</span>
                            </div>
                            <div>
                                <p style={{ fontWeight: 500 }}>Cash on Delivery</p>
                                <p style={{ fontSize: '14px', color: '#6b7280' }}>Pay when order is delivered</p>
                            </div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                            <input
                                type="checkbox"
                                checked={settings.paymentMethods?.cod ?? true}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    paymentMethods: { ...settings.paymentMethods, cod: e.target.checked }
                                })}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                                position: 'absolute', cursor: 'pointer', inset: 0,
                                background: settings.paymentMethods?.cod ? '#4f46e5' : '#d1d5db',
                                borderRadius: '28px', transition: 'background 0.3s'
                            }}>
                                <span style={{
                                    position: 'absolute', height: '20px', width: '20px',
                                    left: settings.paymentMethods?.cod ? '28px' : '4px', bottom: '4px',
                                    background: 'white', borderRadius: '50%', transition: 'left 0.3s'
                                }}></span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
