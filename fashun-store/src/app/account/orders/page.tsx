'use client';

import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AccountOrdersPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    {
      id: 'ORD-2025-001',
      date: '2025-09-15',
      status: 'delivered',
      total: 289.99,
      items: 3,
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2025-09-17',
      products: [
        { name: 'Oversized Graphic Hoodie', quantity: 1, price: 89.99, image: '/api/placeholder/80/80' },
        { name: 'Distressed Denim Jeans', quantity: 1, price: 129.99, image: '/api/placeholder/80/80' },
        { name: 'Platform Sneakers', quantity: 1, price: 159.99, image: '/api/placeholder/80/80' }
      ]
    },
    {
      id: 'ORD-2025-002',
      date: '2025-09-12',
      status: 'shipped',
      total: 179.99,
      items: 2,
      trackingNumber: 'TRK987654321',
      estimatedDelivery: '2025-09-18',
      products: [
        { name: 'Minimalist T-Shirt', quantity: 2, price: 39.99, image: '/api/placeholder/80/80' },
        { name: 'Classic Denim Jacket', quantity: 1, price: 99.99, image: '/api/placeholder/80/80' }
      ]
    },
    {
      id: 'ORD-2025-003',
      date: '2025-09-10',
      status: 'processing',
      total: 249.99,
      items: 1,
      trackingNumber: null,
      estimatedDelivery: '2025-09-20',
      products: [
        { name: 'Designer Leather Jacket', quantity: 1, price: 249.99, image: '/api/placeholder/80/80' }
      ]
    },
    {
      id: 'ORD-2025-004',
      date: '2025-09-08',
      status: 'cancelled',
      total: 89.99,
      items: 1,
      trackingNumber: null,
      estimatedDelivery: null,
      products: [
        { name: 'Vintage Band Tee', quantity: 1, price: 89.99, image: '/api/placeholder/80/80' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <Package className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/account" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Account
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Link
                href="/collections/all"
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{order.id}</h3>
                        <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${order.total}</p>
                        <p className="text-gray-600 text-sm">{order.items} item{order.items > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Tracking Number</p>
                          <p className="text-gray-600">{order.trackingNumber}</p>
                        </div>
                        {order.estimatedDelivery && (
                          <div className="mt-2 sm:mt-0">
                            <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                            <p className="text-gray-600">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Products */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-gray-600">Quantity: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {order.status === 'shipped' && (
                      <Link
                        href={`/track-order?tracking=${order.trackingNumber}`}
                        className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Track Package
                      </Link>
                    )}
                    {order.status === 'delivered' && (
                      <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Write Review
                      </button>
                    )}
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Order Details
                    </button>
                    {order.status === 'processing' && (
                      <button className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountOrdersPage;