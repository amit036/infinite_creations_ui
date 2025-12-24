import { api } from '../../../services/api';
import ProductClient from './ProductClient';
import { getImageUrl } from '../../../utils/helpers';

// Dynamic metadata generation for link previews (WhatsApp, Insta, etc.)
export async function generateMetadata({ params }) {
    const { slug } = await params;

    try {
        // Fetch product data for metadata
        const product = await api.get(`/products/${slug}`);

        if (!product) {
            return {
                title: 'Product Not Found',
                description: 'The requested product could not be found.'
            };
        }

        const title = `${product.name} | Infinite Creations`;
        const description = product.description
            ? product.description.substring(0, 160)
            : `Buy ${product.name} at the best price on Infinite Creations.`;

        const imageUrl = product.images?.[0]
            ? getImageUrl(product.images[0])
            : 'https://infinite-creations-ui.vercel.app/og-image.png';

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
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
                type: 'website',
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
            title: 'Product Details',
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
