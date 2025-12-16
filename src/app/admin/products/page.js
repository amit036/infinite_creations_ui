"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Upload, X, Image } from 'lucide-react';
import { api, API_URL } from '../../../services/api';
import { formatPrice, getImageUrl } from '../../../utils/helpers';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [page, search]);

    async function loadCategories() {
        try {
            const res = await api.get('/categories');
            setCategories(res || []);
        } catch (e) { console.error(e); }
    }

    async function loadProducts() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '10');
            params.set('includeInactive', 'true');
            if (search) params.set('search', search);

            const res = await api.get(`/products?${params.toString()}`);
            setProducts(res?.data || []);
            setMeta(res?.meta || { total: 0, totalPages: 1 });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function toggleStatus(product) {
        try {
            await api.patch(`/products/${product.id}`, { active: !product.active });
            loadProducts();
        } catch (e) {
            alert('Failed to update status');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            loadProducts();
        } catch (e) {
            alert('Failed to delete product');
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Products</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>{meta.total} products total</p>
                </div>
                <button
                    onClick={() => { setEditProduct(null); setShowModal(true); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 20px', background: '#4f46e5', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ position: 'relative', maxWidth: '320px' }}>
                    <Search size={20} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        style={{
                            width: '100%', padding: '12px 12px 12px 44px',
                            border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none'
                        }}
                    />
                </div>
            </div>

            {/* Products Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: '#6b7280' }}>
                        No products found
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Product</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Price</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Stock</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '8px',
                                                background: '#f3f4f6', overflow: 'hidden', flexShrink: 0
                                            }}>
                                                {product.images?.[0] ? (
                                                    <img src={getImageUrl(product.images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 500, color: '#111827' }}>{product.name}</p>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>{product.images?.length || 0} images</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: '#6b7280' }}>{product.category?.name || '-'}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(product.price)}</span>
                                        {product.salePrice && (
                                            <span style={{ fontSize: '12px', color: '#059669', marginLeft: '8px' }}>
                                                Sale: {formatPrice(product.salePrice)}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                                            background: product.stock > 10 ? '#d1fae5' : product.stock > 0 ? '#fef3c7' : '#fee2e2',
                                            color: product.stock > 10 ? '#059669' : product.stock > 0 ? '#b45309' : '#dc2626'
                                        }}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                                            <button
                                                onClick={() => toggleStatus(product)}
                                                style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                                                    background: product.active ? '#d1fae5' : '#fee2e2',
                                                    color: product.active ? '#059669' : '#dc2626',
                                                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                                                }}
                                            >
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                                                {product.active ? 'Active' : 'Inactive'}
                                            </button>
                                            {product.featured && (
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                                    background: '#e0e7ff', color: '#4f46e5',
                                                    border: '1px solid #c7d2fe'
                                                }}>
                                                    ⭐ Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button
                                                onClick={() => { setEditProduct(product); setShowModal(true); }}
                                                style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <Edit size={16} color="#6b7280" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} color="#dc2626" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{
                                    width: '36px', height: '36px', borderRadius: '8px',
                                    border: 'none', fontWeight: 500, cursor: 'pointer',
                                    background: p === page ? '#4f46e5' : '#f3f4f6',
                                    color: p === page ? 'white' : '#6b7280'
                                }}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <ProductModal
                    product={editProduct}
                    categories={categories}
                    onClose={() => setShowModal(false)}
                    onSave={() => { setShowModal(false); loadProducts(); }}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function ProductModal({ product, categories, onClose, onSave }) {
    const [form, setForm] = useState({
        name: product?.name || '',
        slug: product?.slug || '',
        description: product?.description || '',
        price: product?.price || '',
        salePrice: product?.salePrice || '',
        stock: product?.stock || 0,
        categoryId: product?.categoryId || '',
        featured: product?.featured || false,
        active: product?.active ?? true,
        images: product?.images || [],
    });
    const [uploadingImages, setUploadingImages] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_URL}/products/upload-images`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok && data.images) {
                setForm(prev => ({ ...prev, images: [...prev.images, ...data.images] }));
            } else {
                alert(data.message || 'Failed to upload images');
            }
        } catch (error) {
            alert('Failed to upload images');
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...form,
                price: parseFloat(form.price),
                salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
                stock: parseInt(form.stock),
                categoryId: form.categoryId || null,
            };

            if (product) {
                await api.patch(`/products/${product.id}`, data);
            } else {
                await api.post('/products', data);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
        }}>
            <div style={{
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '640px',
                maxHeight: '90vh', overflow: 'auto'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                        {product ? 'Edit Product' : 'Add Product'}
                    </h2>
                    <button onClick={onClose} style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {error && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Images */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                Product Images
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                                {form.images.map((img, index) => (
                                    <div key={index} style={{
                                        position: 'relative', width: '80px', height: '80px',
                                        borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb'
                                    }}>
                                        <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{
                                                position: 'absolute', top: '4px', right: '4px',
                                                width: '20px', height: '20px', borderRadius: '50%',
                                                background: '#dc2626', color: 'white', border: 'none',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImages}
                                    style={{
                                        width: '80px', height: '80px', borderRadius: '8px',
                                        border: '2px dashed #d1d5db', background: '#f9fafb',
                                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '4px'
                                    }}
                                >
                                    {uploadingImages ? (
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>...</span>
                                    ) : (
                                        <>
                                            <Upload size={20} color="#9ca3af" />
                                            <span style={{ fontSize: '10px', color: '#6b7280' }}>Upload</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>or enter image URLs:</p>
                            <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const url = e.target.value.trim();
                                        if (url) {
                                            setForm(prev => ({ ...prev, images: [...prev.images, url] }));
                                            e.target.value = '';
                                        }
                                    }
                                }}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginTop: '8px' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value, slug: product ? form.slug : generateSlug(e.target.value) })}
                                required
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Slug *</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Price (₹) *</label>
                                <input
                                    type="number"
                                    step="1"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Sale Price (₹)</label>
                                <input
                                    type="number"
                                    step="1"
                                    value={form.salePrice}
                                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Stock *</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Category</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', background: 'white' }}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '14px', color: '#374151' }}>Featured Product</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.active}
                                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '14px', color: '#374151' }}>Active (Visible to users)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
                                background: '#4f46e5', color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 600, opacity: loading ? 0.5 : 1
                            }}
                        >
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
