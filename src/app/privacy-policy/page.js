"use client";

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '40px', paddingBottom: '80px' }}>
                <div className="page-container" style={{ maxWidth: '800px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px', background: '#eef2ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                                color: '#4f46e5'
                            }}>
                                <Shield size={32} />
                            </div>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Privacy Policy</h1>
                            <p style={{ color: '#6b7280' }}>Last updated: December 24, 2025</p>
                        </div>

                        <div className="prose" style={{ color: '#374151', lineHeight: '1.8' }}>
                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={20} color="#4f46e5" /> 1. Overview
                                </h2>
                                <p>
                                    At Infinite Creations, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={20} color="#4f46e5" /> 2. Data We Collect
                                </h2>
                                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                                <ul style={{ marginLeft: '20px', marginTop: '12px' }}>
                                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                    <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                    <li><strong>Financial Data:</strong> includes payment card details (processed securely via our payment gateways).</li>
                                    <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                                </ul>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Lock size={20} color="#4f46e5" /> 3. How We Use Your Data
                                </h2>
                                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                                <ul style={{ marginLeft: '20px', marginTop: '12px' }}>
                                    <li>To register you as a new customer.</li>
                                    <li>To process and deliver your order.</li>
                                    <li>To manage our relationship with you.</li>
                                    <li>To improve our website, products/services, marketing or customer relationships.</li>
                                </ul>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>4. Data Security</h2>
                                <p>
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>5. Contact Us</h2>
                                <p>
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                                    <br />
                                    <strong>Email:</strong> support@infinitecreations.com
                                    <br />
                                    <strong>Phone:</strong> +91 1800-123-4567
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style jsx>{`
                @media (max-width: 640px) {
                    main {
                        padding-top: 20px !important;
                    }
                    div[style*="padding: 48px"] {
                        padding: 30px 20px !important;
                        border-radius: 16px !important;
                    }
                    h1 {
                        font-size: 28px !important;
                    }
                }
            `}</style>
        </>
    );
}
