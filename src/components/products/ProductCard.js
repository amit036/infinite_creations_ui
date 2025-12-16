"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../services/api';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.price);
    const displayPrice = hasDiscount ? product.salePrice : product.price;
    const discount = hasDiscount
        ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)
        : 0;

    const imageUrl = product.images?.[0]
        ? (product.images[0].startsWith('http') ? product.images[0] : `${API_URL}${product.images[0]}`)
        : null;

    return (
        <div className="product-card card-shadow group">
            <Link href={`/product/${product.slug}`}>
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="product-image w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">📦</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hasDiscount && (
                            <span className="badge badge-sale">-{discount}%</span>
                        )}
                        {product.featured && (
                            <span className="badge badge-featured">Featured</span>
                        )}
                    </div>

                    {/* Quick Add */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="absolute bottom-3 right-3 p-3 bg-white rounded-full shadow-lg 
                       opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0
                       transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </Link>

            <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    {product.category?.name || 'Product'}
                </p>
                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            ${Number(displayPrice).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                            Only {product.stock} left
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="text-xs text-red-500 font-medium">Out of stock</span>
                    )}
                </div>
            </div>
        </div>
    );
}
