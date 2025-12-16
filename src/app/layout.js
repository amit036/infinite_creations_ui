"use client";

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <title>Infinite Creations - Premium Online Store</title>
        <meta name="description" content="Discover premium products at unbeatable prices" />
      </head>
      <body style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: '#f9fafb',
        color: '#111827',
        minHeight: '100vh',
        margin: 0
      }} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
