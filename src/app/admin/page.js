"use client";

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, FolderTree, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        categories: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [productsRes, ordersRes, categoriesRes] = await Promise.all([
                    api.get('/products?limit=1'),
                    api.get('/orders?limit=5'),
                    api.get('/categories'),
                ]);

                setStats({
                    products: productsRes?.meta?.total || 0,
                    orders: ordersRes?.meta?.total || 0,
                    categories: categoriesRes?.length || 0,
                    revenue: ordersRes?.data?.reduce((sum, o) => sum + Number(o.totalAmount), 0) || 0
                });
                setRecentOrders(ordersRes?.data || []);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const statCards = [
        { label: 'Total Products', value: stats.products, icon: Package, color: '#4f46e5', bg: '#e0e7ff' },
        { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: '#059669', bg: '#d1fae5' },
        { label: 'Categories', value: stats.categories, icon: FolderTree, color: '#d97706', bg: '#fef3c7' },
        { label: 'Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: IndianRupee, color: '#dc2626', bg: '#fee2e2' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            PENDING: { bg: '#fef3c7', text: '#b45309' },
            CONFIRMED: { bg: '#dbeafe', text: '#1d4ed8' },
            SHIPPED: { bg: '#e0e7ff', text: '#4f46e5' },
            DELIVERED: { bg: '#d1fae5', text: '#059669' },
            CANCELLED: { bg: '#fee2e2', text: '#dc2626' },
        };
        return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Dashboard</h1>
                <p style={{ color: '#6b7280', marginTop: '4px' }}>Welcome back! Here's an overview of your store.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {statCards.map((stat, i) => (
                    <div key={i} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{stat.label}</p>
                                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{stat.value}</p>
                            </div>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px',
                                background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Recent Orders</h2>
                    <a href="/admin/orders" style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none', fontSize: '14px' }}>View All</a>
                </div>

                {recentOrders.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                        No orders yet
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb' }}>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Order</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Customer</th>
                                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => {
                                const statusStyle = getStatusColor(order.status);
                                return (
                                    <tr key={order.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ fontWeight: 500, color: '#111827' }}>{order.orderNumber}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ color: '#6b7280' }}>{order.customer?.name || order.shippingName}</span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                                                background: statusStyle.bg, color: statusStyle.text
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                                            ₹{Number(order.totalAmount).toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
