'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'web';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  conversions: number;
  ctr: number;
  roas: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: 'CAMP-001',
    name: 'AI Streetwear Collection Launch',
    type: 'email',
    status: 'active',
    budget: 5000,
    spent: 3240,
    conversions: 187,
    ctr: 3.0,
    roas: 5.2
  },
  {
    id: 'CAMP-002',
    name: 'Valentine\'s Day Special',
    type: 'social',
    status: 'active',
    budget: 8000,
    spent: 6420,
    conversions: 312,
    ctr: 3.2,
    roas: 4.5
  }
];

export default function MarketingPage() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
                  <MegaphoneIcon className="h-8 w-8 text-pink-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Manage campaigns and marketing automation
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">$22.5K</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Spent</p>
                <p className="text-2xl font-bold text-gray-900">$15.8K</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">499</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg ROAS</p>
                <p className="text-2xl font-bold text-gray-900">4.9x</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      campaign.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      campaign.type === 'sms' ? 'bg-green-100 text-green-600' :
                      campaign.type === 'social' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {campaign.type === 'email' ? <EnvelopeIcon className="h-5 w-5" /> :
                       campaign.type === 'sms' ? <DevicePhoneMobileIcon className="h-5 w-5" /> :
                       <UsersIcon className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{campaign.type} Campaign</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(campaign.status)}
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="p-2 text-gray-400 hover:text-pink-600"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Budget</p>
                    <p className="text-sm font-semibold text-gray-900">${campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Spent</p>
                    <p className="text-sm font-semibold text-gray-900">${campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">CTR</p>
                    <p className="text-sm font-semibold text-gray-900">{campaign.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">ROAS</p>
                    <p className="text-sm font-semibold text-gray-900">{campaign.roas}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Campaign Details - {selectedCampaign.name}</h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Performance</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Budget:</span> ${selectedCampaign.budget.toLocaleString()}</p>
                  <p><span className="font-medium">Spent:</span> ${selectedCampaign.spent.toLocaleString()}</p>
                  <p><span className="font-medium">Conversions:</span> {selectedCampaign.conversions}</p>
                  <p><span className="font-medium">ROAS:</span> {selectedCampaign.roas}x</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Campaign Info</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Type:</span> {selectedCampaign.type.charAt(0).toUpperCase() + selectedCampaign.type.slice(1)}</p>
                  <p><span className="font-medium">Status:</span> {getStatusBadge(selectedCampaign.status)}</p>
                  <p><span className="font-medium">CTR:</span> {selectedCampaign.ctr}%</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700">
                Edit Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}