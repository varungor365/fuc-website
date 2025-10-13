'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadDashboardData();
    
    // Real-time subscription
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/admin/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      router.push('/');
    }
  };

  const loadDashboardData = async () => {
    try {
      // Get total orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount');
      
      const revenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Get total customers
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, profiles(display_name, email)')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalOrders: ordersCount || 0,
        totalRevenue: revenue,
        totalCustomers: customersCount || 0,
        totalProducts: 0,
        recentOrders: recentOrders || [],
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toFixed(2)}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Total Customers</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalCustomers}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">Products</div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalProducts}</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/customers" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="font-semibold">Customers</div>
          </Link>
          
          <Link href="/admin/analytics" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📊</div>
            <div className="font-semibold">Analytics</div>
          </Link>
          
          <Link href="/admin/marketing" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📢</div>
            <div className="font-semibold">Marketing</div>
          </Link>
          
          <Link href="/admin/inventory" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📦</div>
            <div className="font-semibold">Inventory</div>
          </Link>
          
          <Link href="/admin/ugc" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">📸</div>
            <div className="font-semibold">UGC</div>
          </Link>
          
          <Link href="/admin/seo" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-semibold">SEO Tools</div>
          </Link>
          
          <Link href="/admin/settings" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center">
            <div className="text-4xl mb-2">⚙️</div>
            <div className="font-semibold">Settings</div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer_email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{order.total_amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
