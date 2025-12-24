"use client";

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FileText, Scale, AlertCircle, Info } from 'lucide-react';

export default function TermsOfService() {
    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: '40px', paddingBottom: '80px' }}>
                <div className="page-container" style={{ maxWidth: '800px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px', background: '#fff7ed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                                color: '#ea580c'
                            }}>
                                <Scale size={32} />
                            </div>
                            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>Terms of Service</h1>
                            <p style={{ color: '#6b7280' }}>Last updated: December 24, 2025</p>
                        </div>

                        <div className="prose" style={{ color: '#374151', lineHeight: '1.8' }}>
                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Info size={20} color="#ea580c" /> 1. Agreement to Terms
                                </h2>
                                <p>
                                    By accessing or using the Infinite Creations website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                                </p>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={20} color="#ea580c" /> 2. Use License
                                </h2>
                                <p>Permission is granted to temporarily download one copy of the materials on Infinite Creations' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                                <ul style={{ marginLeft: '20px', marginTop: '12px' }}>
                                    <li>Modify or copy the materials.</li>
                                    <li>Use the materials for any commercial purpose.</li>
                                    <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                                    <li>Remove any copyright or other proprietary notations from the materials.</li>
                                </ul>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <AlertCircle size={20} color="#ea580c" /> 3. Disclaimer
                                </h2>
                                <p>
                                    The materials on Infinite Creations' website are provided on an 'as is' basis. Infinite Creations makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                </p>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>4. Limitations</h2>
                                <p>
                                    In no event shall Infinite Creations or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Infinite Creations' website.
                                </p>
                            </section>

                            <section style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>5. Product Accuracy</h2>
                                <p>
                                    The materials appearing on Infinite Creations' website could include technical, typographical, or photographic errors. Infinite Creations does not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials contained on its website at any time without notice.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>6. Governing Law</h2>
                                <p>
                                    These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
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
