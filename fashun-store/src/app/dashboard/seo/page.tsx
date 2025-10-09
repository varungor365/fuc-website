'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SEOPage {
  id: string;
  url: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  score: number;
  traffic: number;
  position: number;
  issues: string[];
  lastUpdated: string;
}

const mockSEOPages: SEOPage[] = [
  {
    id: 'SEO-001',
    url: '/',
    title: 'Fashun Store - AI-Powered Fashion Platform',
    metaDescription: 'Discover unique AI-generated fashion designs. Create custom streetwear with our advanced AI technology.',
    keywords: ['AI fashion', 'custom streetwear', 'personalized clothing', 'fashion AI'],
    score: 92,
    traffic: 15420,
    position: 3,
    issues: [],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'SEO-002',
    url: '/customize',
    title: 'AI Design Studio - Create Custom Fashion',
    metaDescription: 'Use our AI-powered design studio to create unique fashion pieces tailored to your style.',
    keywords: ['AI design', 'custom fashion', 'design studio', 'personalized style'],
    score: 78,
    traffic: 8960,
    position: 7,
    issues: ['Missing alt tags on images', 'Page load speed could be improved'],
    lastUpdated: '2024-01-14'
  }
];

export default function SEOPage() {
  const [seoPages] = useState<SEOPage[]>(mockSEOPages);
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const avgScore = seoPages.reduce((sum, page) => sum + page.score, 0) / seoPages.length;
  const totalTraffic = seoPages.reduce((sum, page) => sum + page.traffic, 0);

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
                  <MagnifyingGlassIcon className="h-8 w-8 text-cyan-600" />
                  <h1 className="text-3xl font-bold text-gray-900">SEO Tools</h1>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Optimize your site for search engines
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEO Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">{avgScore.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
                <p className="text-2xl font-bold text-gray-900">{(totalTraffic / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pages Indexed</p>
                <p className="text-2xl font-bold text-gray-900">{seoPages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Issues Found</p>
                <p className="text-2xl font-bold text-gray-900">{seoPages.reduce((sum, page) => sum + page.issues.length, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Pages */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Page Performance</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {seoPages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(page.score)}`}>
                        {page.score}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{page.title}</h4>
                        <p className="text-sm text-gray-600">{page.url}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{page.metaDescription}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {page.keywords.slice(0, 4).map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{page.traffic.toLocaleString()}</p>
                      <p className="text-gray-500">Traffic</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">#{page.position}</p>
                      <p className="text-gray-500">Position</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{page.issues.length}</p>
                      <p className="text-gray-500">Issues</p>
                    </div>
                    <button
                      onClick={() => setSelectedPage(page)}
                      className="p-2 text-gray-400 hover:text-cyan-600"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {page.issues.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-red-600 mb-2">Issues:</h5>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {page.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Detail Modal */}
      {selectedPage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">SEO Details - {selectedPage.title}</h3>
              <button
                onClick={() => setSelectedPage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Page Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">URL:</span> {selectedPage.url}</p>
                  <p><span className="font-medium">SEO Score:</span> {selectedPage.score}</p>
                  <p><span className="font-medium">Position:</span> #{selectedPage.position}</p>
                  <p><span className="font-medium">Traffic:</span> {selectedPage.traffic.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Meta Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Title:</span> {selectedPage.title}</p>
                  <p><span className="font-medium">Description:</span> {selectedPage.metaDescription}</p>
                  <div>
                    <span className="font-medium">Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPage.keywords.map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedPage(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-medium hover:bg-cyan-700">
                Optimize Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}