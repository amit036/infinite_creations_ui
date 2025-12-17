export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api', '/profile', '/checkout', '/payment'],
            },
        ],
        sitemap: 'https://infinite-creations-ui.vercel.app//sitemap.xml',
    };
}
