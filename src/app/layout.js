import { Providers } from './providers';
import './globals.css';

// SEO Metadata - This is the Next.js 14+ way to handle SEO
export const metadata = {
  metadataBase: new URL('https://infinite-creations-ui.vercel.app/'),
  title: {
    default: 'Infinite Creations - Premium Online Store',
    template: '%s | Infinite Creations'
  },
  description: 'Discover premium quality products at unbeatable prices. Shop electronics, clothing, home & living, and accessories with free shipping on orders over ₹2,000.',
  keywords: ['online shopping', 'premium products', 'electronics', 'clothing', 'home decor', 'accessories', 'India', 'ecommerce'],
  authors: [{ name: 'Infinite Creations' }],
  creator: 'Infinite Creations',
  publisher: 'Infinite Creations',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://infinite-creations-ui.vercel.app/',
    siteName: 'Infinite Creations',
    title: 'Infinite Creations - Premium Online Store',
    description: 'Discover premium quality products at unbeatable prices. Shop electronics, clothing, home & living, and accessories.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Infinite Creations - Premium Online Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infinite Creations - Premium Online Store',
    description: 'Discover premium quality products at unbeatable prices.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// Viewport configuration
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b4b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};



export default function RootLayout({ children }) {
  // JSON-LD structured data for rich search results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Infinite Creations',
    description: 'Premium Online Store - Discover quality products at unbeatable prices',
    url: 'https://infinite-creations-ui.vercel.app/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://infinite-creations-ui.vercel.app//shop?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Infinite Creations',
    url: 'https://infinite-creations-ui.vercel.app/',
    logo: 'https://infinite-creations-ui.vercel.app//logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi']
    },
    sameAs: []
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: '#f9fafb',
        color: '#111827',
        minHeight: '100vh',
        margin: 0
      }} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
