'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
  ShoppingBagIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteCategory: string;
  };
  recentOrders: {
    id: string;
    date: string;
    total: number;
    status: string;
  }[];
  preferences: {
    size: string[];
    colors: string[];
    styles: string[];
  };
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  reviews: number;
  rating: number;
  aiGeneratedDesigns: number;
}

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-08-15',
    lastActive: '2024-01-15',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    stats: {
      totalOrders: 12,
      totalSpent: 1247.89,
      averageOrderValue: 103.99,
      favoriteCategory: 'Streetwear'
    },
    recentOrders: [
      { id: 'ORD-001247', date: '2024-01-15', total: 159.97, status: 'processing' },
      { id: 'ORD-001198', date: '2024-01-08', total: 89.99, status: 'delivered' },
      { id: 'ORD-001156', date: '2023-12-22', total: 234.50, status: 'delivered' }
    ],
    preferences: {
      size: ['M', 'L'],
      colors: ['Black', 'Navy', 'Gray'],
      styles: ['Streetwear', 'Casual', 'Minimalist']
    },
    loyaltyTier: 'Gold',
    reviews: 8,
    rating: 4.7,
    aiGeneratedDesigns: 3
  },
  {
    id: 'CUST-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 987-6543',
    joinDate: '2023-11-20',
    lastActive: '2024-01-14',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    },
    stats: {
      totalOrders: 8,
      totalSpent: 542.35,
      averageOrderValue: 67.79,
      favoriteCategory: 'Denim'
    },
    recentOrders: [
      { id: 'ORD-001246', date: '2024-01-14', total: 129.99, status: 'shipped' },
      { id: 'ORD-001201', date: '2024-01-05', total: 45.99, status: 'delivered' }
    ],
    preferences: {
      size: ['S', 'M'],
      colors: ['Blue', 'White', 'Pink'],
      styles: ['Vintage', 'Casual', 'Boho']
    },
    loyaltyTier: 'Silver',
    reviews: 5,
    rating: 4.9,
    aiGeneratedDesigns: 1
  },
  {
    id: 'CUST-003',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@email.com',
    joinDate: '2023-06-10',
    lastActive: '2024-01-13',
    location: {
      city: 'Miami',
      state: 'FL',
      country: 'USA'
    },
    stats: {
      totalOrders: 15,
      totalSpent: 2156.78,
      averageOrderValue: 143.79,
      favoriteCategory: 'T-Shirts'
    },
    recentOrders: [
      { id: 'ORD-001245', date: '2024-01-13', total: 169.96, status: 'delivered' },
      { id: 'ORD-001203', date: '2024-01-06', total: 89.99, status: 'delivered' },
      { id: 'ORD-001178', date: '2023-12-28', total: 299.97, status: 'delivered' }
    ],
    preferences: {
      size: ['L', 'XL'],
      colors: ['Black', 'Red', 'Green'],
      styles: ['Graphic', 'Streetwear', 'Sports']
    },
    loyaltyTier: 'Platinum',
    reviews: 12,
    rating: 4.5,
    aiGeneratedDesigns: 5
  },
  {
    id: 'CUST-004',
    name: 'Emma Williams',
    email: 'emma.williams@email.com',
    phone: '+1 (555) 456-7890',
    joinDate: '2024-01-05',
    lastActive: '2024-01-15',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    },
    stats: {
      totalOrders: 2,
      totalSpent: 74.97,
      averageOrderValue: 37.49,
      favoriteCategory: 'Tops'
    },
    recentOrders: [
      { id: 'ORD-001244', date: '2024-01-15', total: 49.98, status: 'pending' },
      { id: 'ORD-001209', date: '2024-01-07', total: 24.99, status: 'delivered' }
    ],
    preferences: {
      size: ['XS', 'S'],
      colors: ['Pink', 'Purple', 'White'],
      styles: ['Minimalist', 'Cute', 'Trendy']
    },
    loyaltyTier: 'Bronze',
    reviews: 1,
    rating: 5.0,
    aiGeneratedDesigns: 0
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortField, setSortField] = useState('lastActive');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const tiers = ['all', 'Bronze', 'Silver', 'Gold', 'Platinum'];

  const getLoyaltyBadge = (tier: string) => {
    const badgeClasses = {
      Bronze: 'bg-orange-100 text-orange-800',
      Silver: 'bg-gray-100 text-gray-800',
      Gold: 'bg-yellow-100 text-yellow-800',
      Platinum: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[tier as keyof typeof badgeClasses]}`}>
        {tier}
      </span>
    );
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter === 'all' || customer.loyaltyTier === tierFilter;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Customer];
      let bValue: any = b[sortField as keyof Customer];
      
      if (sortField === 'totalSpent' || sortField === 'totalOrders') {
        aValue = a.stats[sortField as keyof typeof a.stats];
        bValue = b.stats[sortField as keyof typeof b.stats];
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  <ChevronLeftIcon className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage customer relationships and insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredAndSortedCustomers.length} customers
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average CLV</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(customers.reduce((sum, c) => sum + c.stats.totalSpent, 0) / customers.length).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.reduce((sum, c) => sum + c.stats.totalOrders, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tiers.map(tier => (
                  <option key={tier} value={tier}>
                    {tier === 'all' ? 'All Tiers' : `${tier} Tier`}
                  </option>
                ))}
              </select>
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortField(field);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lastActive-desc">Last Active (Recent)</option>
                <option value="lastActive-asc">Last Active (Oldest)</option>
                <option value="totalSpent-desc">Highest Spender</option>
                <option value="totalSpent-asc">Lowest Spender</option>
                <option value="totalOrders-desc">Most Orders</option>
                <option value="totalOrders-asc">Fewest Orders</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedCustomers.length} customers found
            </div>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAndSortedCustomers.map((customer) => (
              <div key={customer.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {customer.location.city}, {customer.location.state}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Joined {new Date(customer.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{customer.stats.totalOrders}</p>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">${customer.stats.totalSpent.toFixed(0)}</p>
                      <p className="text-xs text-gray-500">Spent</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{customer.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{customer.reviews} reviews</p>
                    </div>
                    <div>
                      {getLoyaltyBadge(customer.loyaltyTier)}
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Favorite Category</p>
                    <p className="text-sm text-gray-900">{customer.stats.favoriteCategory}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Avg Order Value</p>
                    <p className="text-sm text-gray-900">${customer.stats.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Last Active</p>
                    <p className="text-sm text-gray-900">{new Date(customer.lastActive).toLocaleDateString()}</p>
                  </div>
                </div>

                {customer.aiGeneratedDesigns > 0 && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <span className="mr-1">✨</span>
                      {customer.aiGeneratedDesigns} AI Design{customer.aiGeneratedDesigns > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Customer Profile - {selectedCustomer.name}</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-2xl">
                        {selectedCustomer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{selectedCustomer.name}</h4>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                      {selectedCustomer.phone && <p className="text-gray-600">{selectedCustomer.phone}</p>}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Location:</span> {selectedCustomer.location.city}, {selectedCustomer.location.state}, {selectedCustomer.location.country}</p>
                    <p><span className="font-medium">Joined:</span> {new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Last Active:</span> {new Date(selectedCustomer.lastActive).toLocaleDateString()}</p>
                    <p><span className="font-medium">Loyalty Tier:</span> {getLoyaltyBadge(selectedCustomer.loyaltyTier)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold mb-3">Preferences</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Sizes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCustomer.preferences.size.map((size, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Colors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCustomer.preferences.colors.map((color, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Styles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCustomer.preferences.styles.map((style, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats and Orders */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.stats.totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">${selectedCustomer.stats.totalSpent.toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">${selectedCustomer.stats.averageOrderValue.toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Avg Order</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center">
                      <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="text-2xl font-bold text-yellow-600">{selectedCustomer.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedCustomer.reviews} Reviews</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-4">Recent Orders</h5>
                  <div className="space-y-3">
                    {selectedCustomer.recentOrders.map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}