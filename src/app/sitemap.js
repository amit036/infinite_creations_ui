export default function sitemap() {
    const baseUrl = 'https://infinite-creations-ui.vercel.app/';

    // Static pages
    const staticPages = [
        '',
        '/shop',
        '/login',
        '/cart',
        '/checkout',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Category pages
    const categories = ['electronics', 'clothing', 'home-living', 'accessories'];
    const categoryPages = categories.map((category) => ({
        url: `${baseUrl}/shop?category=${category}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticPages, ...categoryPages];
}
