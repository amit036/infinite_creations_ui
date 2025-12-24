import { api } from '../../../services/api';
import ProductClient from './ProductClient';
import { getImageUrl } from '../../../utils/helpers';

// Dynamic metadata generation for link previews (WhatsApp, Insta, etc.)
export async function generateMetadata({ params }) {
    const { slug } = await params;

    try {
        // Fetch product data for metadata
        // Note: This runs on the server (Vercel Edge/Serverless)
        const product = await api.get(`/products/${slug}`).catch(() => null);

        if (!product) {
            console.error(`Metadata fetch failed for slug: ${slug}`);
            return {
                title: 'Product Details | Infinite Creations',
                description: 'Explore our premium handpicked products.'
            };
        }

        const title = `${product.name} | Infinite Creations`;
        const description = product.description
            ? product.description.substring(0, 160)
            : `Buy ${product.name} at the best price on Infinite Creations. Premium quality guaranteed.`;

        // Ensure we have a valid absolute image URL
        let imageUrl = 'https://infinite-creations-ui.vercel.app/og-image.png';
        if (product.images?.[0]) {
            const rawImg = product.images[0];
            imageUrl = rawImg.startsWith('http') ? rawImg : `${api.API_URL || 'https://infinite-creations-backend.onrender.com'}${rawImg}`;
        }

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url: `https://infinite-creations-ui.vercel.app/product/${slug}`,
                siteName: 'Infinite Creations',
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
                type: 'article',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        console.error('Metadata generation error:', error);
        return {
            title: 'Infinite Creations',
            description: 'Explore our premium products.'
        };
    }
}

export default async function Page({ params }) {
    const { slug } = await params;
    let product = null;

    try {
        // Prefetch data on the server
        product = await api.get(`/products/${slug}`);
    } catch (error) {
        console.error('Product fetch error:', error);
    }

    return <ProductClient initialProduct={product} />;
}
