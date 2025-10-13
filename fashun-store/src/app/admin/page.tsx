'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    // Check admin auth
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/admin/login');
    }
    
    // Load stats
    loadStats();
  }, []);

  const loadStats = async () => {
    // Mock data - replace with real API calls
    setStats({
      totalOrders: 156,
      totalRevenue: 45230,
      totalProducts: 48,
      totalUsers: 892,
      pendingReviews: 12,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" />
          <StatCard title="Revenue" value={`$${stats.totalRevenue}`} icon="💰" />
          <StatCard title="Products" value={stats.totalProducts} icon="👕" />
          <StatCard title="Users" value={stats.totalUsers} icon="👥" />
          <StatCard title="Pending Reviews" value={stats.pendingReviews} icon="⭐" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard 
            title="Manage Products" 
            description="Add, edit, or remove products"
            link="/admin/products"
          />
          <ActionCard 
            title="Manage Reviews" 
            description="Approve or reject product reviews"
            link="/admin/reviews"
          />
          <ActionCard 
            title="View Orders" 
            description="Track and manage customer orders"
            link="/admin/orders"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

function ActionCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <a href={link} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}
