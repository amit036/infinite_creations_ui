// Format price in INR
import { API_URL } from '../services/api';
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

// Get image URL (handles local and remote)
export const getImageUrl = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `${API_URL}${img}`;
};
