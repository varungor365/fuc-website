'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  PhotoIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface UGCItem {
  id: string;
  type: 'photo' | 'video' | 'review' | 'testimonial';
  content: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  product: {
    name: string;
    id: string;
  };
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  submittedAt: string;
  rating?: number;
}

const mockUGC: UGCItem[] = [
  {
    id: 'UGC-001',
    type: 'photo',
    content: 'Amazing AI-generated hoodie! The design is so unique and the quality is fantastic.',
    user: {
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      verified: true
    },
    product: {
      name: 'AI-Generated Streetwear Hoodie',
      id: 'PROD-001'
    },
    metrics: {
      likes: 245,
      comments: 12,
      shares: 8,
      views: 1520
    },
    status: 'featured',
    submittedAt: '2024-01-15',
    rating: 5
  },
  {
    id: 'UGC-002',
    type: 'review',
    content: 'Perfect fit and amazing design. The AI creativity is mind-blowing!',
    user: {
      name: 'Alex Johnson',
      verified: false
    },
    product: {
      name: 'Custom Graphic T-Shirt',
      id: 'PROD-002'
    },
    metrics: {
      likes: 89,
      comments: 5,
      shares: 3,
      views: 456
    },
    status: 'approved',
    submittedAt: '2024-01-14',
    rating: 4
  },
  {
    id: 'UGC-003',
    type: 'video',
    content: 'Unboxing my new AI fashion order! Love the packaging and quality.',
    user: {
      name: 'Mike Rodriguez',
      verified: true
    },
    product: {
      name: 'Vintage Denim Jacket',
      id: 'PROD-003'
    },
    metrics: {
      likes: 156,
      comments: 23,
      shares: 15,
      views: 2890
    },
    status: 'pending',
    submittedAt: '2024-01-13'
  }
];

export default function UGCPage() {
  const [ugcItems, setUGCItems] = useState<UGCItem[]>(mockUGC);
  const [selectedItem, setSelectedItem] = useState<UGCItem | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const statuses = ['all', 'pending', 'approved', 'rejected', 'featured'];
  const types = ['all', 'photo', 'video', 'review', 'testimonial'];

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      featured: 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon className="h-5 w-5" />;
      case 'video':
        return <PhotoIcon className="h-5 w-5" />;
      case 'review':
        return <StarIcon className="h-5 w-5" />;
      case 'testimonial':
        return <ChatBubbleLeftIcon className="h-5 w-5" />;
      default:
        return <PhotoIcon className="h-5 w-5" />;
    }
  };

  const updateItemStatus = (itemId: string, newStatus: UGCItem['status']) => {
    setUGCItems(ugcItems.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const filteredItems = ugcItems.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesStatus && matchesType;
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
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="h-8 w-8 text-teal-600" />
                  <h1 className="text-3xl font-bold text-gray-900">User Generated Content</h1>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Manage customer photos, videos, and reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* UGC Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <PhotoIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{ugcItems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CheckIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{ugcItems.filter(item => item.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{ugcItems.reduce((sum, item) => sum + item.metrics.likes, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{ugcItems.reduce((sum, item) => sum + item.metrics.views, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* UGC Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'photo' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'video' ? 'bg-green-100 text-green-600' :
                      item.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.user.name}</p>
                      {item.user.verified && (
                        <span className="inline-flex items-center text-xs text-blue-600">
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{item.content}</p>

                {item.rating && (
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${i < item.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{item.rating}/5</span>
                  </div>
                )}

                <div className="text-sm text-gray-600 mb-4">
                  Product: <span className="font-medium">{item.product.name}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 mb-4">
                  <div className="text-center">
                    <HeartIcon className="h-4 w-4 mx-auto mb-1" />
                    {item.metrics.likes}
                  </div>
                  <div className="text-center">
                    <ChatBubbleLeftIcon className="h-4 w-4 mx-auto mb-1" />
                    {item.metrics.comments}
                  </div>
                  <div className="text-center">
                    <EyeIcon className="h-4 w-4 mx-auto mb-1" />
                    {item.metrics.views}
                  </div>
                  <div className="text-center">
                    <PhotoIcon className="h-4 w-4 mx-auto mb-1" />
                    {item.metrics.shares}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-1 text-gray-400 hover:text-teal-600"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateItemStatus(item.id, 'approved')}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'rejected')}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UGC Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Content Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Content</h4>
                <p className="text-gray-700">{selectedItem.content}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">User Information</h4>
                <p><span className="font-medium">Name:</span> {selectedItem.user.name}</p>
                <p><span className="font-medium">Verified:</span> {selectedItem.user.verified ? 'Yes' : 'No'}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Engagement Metrics</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Likes</p>
                    <p className="font-semibold">{selectedItem.metrics.likes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Comments</p>
                    <p className="font-semibold">{selectedItem.metrics.comments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="font-semibold">{selectedItem.metrics.views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shares</p>
                    <p className="font-semibold">{selectedItem.metrics.shares}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedItem.status !== 'featured' && (
                <button
                  onClick={() => {
                    updateItemStatus(selectedItem.id, 'featured');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
                >
                  Feature Content
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}