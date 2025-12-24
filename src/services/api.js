export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const fetcher = async (url, options = {}) => {
    let token = null;
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Error' }));
            throw new Error(error.message || 'Something went wrong');
        }

        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const api = {
    get: (url) => fetcher(url, { method: 'GET' }),
    post: (url, body) => fetcher(url, { method: 'POST', body: JSON.stringify(body) }),
    patch: (url, body) => fetcher(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url) => fetcher(url, { method: 'DELETE' }),
};
