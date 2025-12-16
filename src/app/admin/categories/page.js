"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCategories();
        } catch (e) {
            alert('Failed to delete category. Make sure no products are using it.');
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Categories</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>{categories.length} categories total</p>
                </div>
                <button
                    onClick={() => { setEditCategory(null); setShowModal(true); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 20px', background: '#4f46e5', color: 'white',
                        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: '#6b7280' }}>
                        No categories found. Create your first category!
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '24px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '24px'
                                }}>
                                    📁
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => { setEditCategory(category); setShowModal(true); }}
                                        style={{ padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Edit size={16} color="#6b7280" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} color="#dc2626" />
                                    </button>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                                {category.name}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                /{category.slug}
                            </p>
                            {category.description && (
                                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                    {category.description}
                                </p>
                            )}
                            <div style={{
                                padding: '8px 12px', background: '#f3f4f6', borderRadius: '6px',
                                display: 'inline-block', fontSize: '14px', color: '#6b7280'
                            }}>
                                {category._count?.products || 0} products
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CategoryModal
                    category={editCategory}
                    onClose={() => setShowModal(false)}
                    onSave={() => { setShowModal(false); loadCategories(); }}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function CategoryModal({ category, onClose, onSave }) {
    const [form, setForm] = useState({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (category) {
                await api.patch(`/categories/${category.id}`, form);
            } else {
                await api.post('/categories', form);
            }
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to save category');
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
                background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>
                        {category ? 'Edit Category' : 'Add Category'}
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
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value, slug: category ? form.slug : generateSlug(e.target.value) })}
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
                            {loading ? 'Saving...' : category ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
