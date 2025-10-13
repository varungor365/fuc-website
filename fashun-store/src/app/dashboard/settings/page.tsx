'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  CogIcon,
  BellIcon,
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  KeyIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: {
    key: string;
    label: string;
    type: 'toggle' | 'text' | 'select';
    value: any;
    options?: string[];
  }[];
}

const settingsData: SettingsSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Basic store configuration and preferences',
    icon: CogIcon,
    settings: [
      { key: 'storeName', label: 'Store Name', type: 'text', value: 'Fashun Store' },
      { key: 'storeDescription', label: 'Store Description', type: 'text', value: 'AI-Powered Fashion Platform' },
      { key: 'timezone', label: 'Timezone', type: 'select', value: 'UTC-5', options: ['UTC-8', 'UTC-5', 'UTC+0', 'UTC+8'] },
      { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'toggle', value: false }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure email and system notifications',
    icon: BellIcon,
    settings: [
      { key: 'emailNotifications', label: 'Email Notifications', type: 'toggle', value: true },
      { key: 'orderAlerts', label: 'New Order Alerts', type: 'toggle', value: true },
      { key: 'lowStockAlerts', label: 'Low Stock Alerts', type: 'toggle', value: true },
      { key: 'customerReviews', label: 'Customer Review Notifications', type: 'toggle', value: false }
    ]
  },
  {
    id: 'ai',
    title: 'AI Configuration',
    description: 'Manage AI models and generation settings',
    icon: ShieldCheckIcon,
    settings: [
      { key: 'primaryAIProvider', label: 'Primary AI Provider', type: 'select', value: 'freepik', options: ['freepik', 'huggingface', 'replicate'] },
      { key: 'aiGenerationLimit', label: 'Daily AI Generation Limit', type: 'text', value: '500' },
      { key: 'autoModeration', label: 'Auto Content Moderation', type: 'toggle', value: true },
      { key: 'qualityCheck', label: 'AI Quality Check', type: 'toggle', value: true }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Security and authentication settings',
    icon: ShieldCheckIcon,
    settings: [
      { key: 'twoFactorAuth', label: 'Two-Factor Authentication', type: 'toggle', value: false },
      { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'text', value: '60' },
      { key: 'passwordPolicy', label: 'Strong Password Policy', type: 'toggle', value: true },
      { key: 'loginAttempts', label: 'Max Login Attempts', type: 'text', value: '5' }
    ]
  }
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsSection[]>(settingsData);
  const [activeTab, setActiveTab] = useState('general');

  const updateSetting = (sectionId: string, settingKey: string, newValue: any) => {
    setSettings(settings.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            settings: section.settings.map(setting =>
              setting.key === settingKey ? { ...setting, value: newValue } : setting
            )
          }
        : section
    ));
  };

  const activeSection = settings.find(section => section.id === activeTab);

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
                  <CogIcon className="h-8 w-8 text-gray-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Configure your store and platform settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {settings.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === section.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              {activeSection && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeSection.title}</h2>
                    <p className="text-gray-600">{activeSection.description}</p>
                  </div>

                  <div className="space-y-6">
                    {activeSection.settings.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between py-4 border-b border-gray-200">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{setting.label}</h3>
                        </div>
                        <div>
                          {setting.type === 'toggle' ? (
                            <button
                              onClick={() => updateSetting(activeSection.id, setting.key, !setting.value)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.value ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          ) : setting.type === 'select' ? (
                            <select
                              value={setting.value}
                              onChange={(e) => updateSetting(activeSection.id, setting.key, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {setting.options?.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={setting.value}
                              onChange={(e) => updateSetting(activeSection.id, setting.key, e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Reset to Defaults
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}