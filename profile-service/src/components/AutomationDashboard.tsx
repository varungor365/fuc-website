'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CogIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  UserPlusIcon,
  QrCodeIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface AutomationStats {
  last24Hours: Record<string, number>;
  totalProcessed: number;
  timestamp: string;
}

interface AutomationLog {
  id: string;
  type: string;
  user_id?: string;
  details: any;
  created_at: string;
}

interface AutomationConfig {
  qrCodeGeneration: boolean;
  profileAutoCreation: boolean;
  phygitalOrderProcessing: boolean;
  analyticsTracking: boolean;
}

export default function AutomationDashboard() {
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [config, setConfig] = useState<AutomationConfig>({
    qrCodeGeneration: true,
    profileAutoCreation: true,
    phygitalOrderProcessing: true,
    analyticsTracking: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingAutomation, setIsTestingAutomation] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    fetchAutomationData();
    const interval = setInterval(fetchAutomationData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAutomationData = async () => {
    try {
      // Fetch automation status and stats
      const statusResponse = await fetch('/api/automation/trigger?action=status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setStats(statusData.stats);
        setConfig(statusData.config);
      }

      // Fetch recent logs
      const logsResponse = await fetch('/api/automation/trigger?action=logs');
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.logs);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching automation data:', error);
      setIsLoading(false);
    }
  };

  const runAutomationTest = async () => {
    setIsTestingAutomation(true);
    setTestResults(null);

    try {
      const response = await fetch('/api/automation/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test_automation'
        })
      });

      const result = await response.json();
      setTestResults(result);
      
      // Refresh data after test
      fetchAutomationData();
    } catch (error) {
      console.error('Error running automation test:', error);
      setTestResults({
        success: false,
        error: 'Test execution failed'
      });
    } finally {
      setIsTestingAutomation(false);
    }
  };

  const triggerManualAction = async (action: string, data: any = {}) => {
    setSelectedAction(action);

    try {
      const response = await fetch('/api/automation/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          data
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success message and refresh data
        fetchAutomationData();
      } else {
        console.error('Manual action failed:', result.error);
      }
    } catch (error) {
      console.error('Error triggering manual action:', error);
    } finally {
      setSelectedAction(null);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'qr_generated': return <QrCodeIcon className="w-5 h-5 text-blue-400" />;
      case 'profile_created': return <UserPlusIcon className="w-5 h-5 text-green-400" />;
      case 'order_processed': return <ShoppingBagIcon className="w-5 h-5 text-purple-400" />;
      case 'email_sent': return <DocumentDuplicateIcon className="w-5 h-5 text-yellow-400" />;
      default: return <CogIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Automation Dashboard</h2>
          <p className="text-purple-300">Fetching system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Automation Dashboard</h1>
          <p className="text-purple-300">Monitor and manage automated processes</p>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <QrCodeIcon className="w-8 h-8 text-blue-400" />
              <div className={`p-2 rounded-full ${config.qrCodeGeneration ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {config.qrCodeGeneration ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-medium mb-1">QR Generation</h3>
            <p className="text-gray-400 text-sm">
              {config.qrCodeGeneration ? 'Active' : 'Disabled'}
            </p>
            <div className="mt-3 text-2xl font-bold text-white">
              {stats?.last24Hours?.qr_generated || 0}
            </div>
            <p className="text-gray-400 text-xs">Last 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <UserPlusIcon className="w-8 h-8 text-green-400" />
              <div className={`p-2 rounded-full ${config.profileAutoCreation ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {config.profileAutoCreation ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-medium mb-1">Profile Creation</h3>
            <p className="text-gray-400 text-sm">
              {config.profileAutoCreation ? 'Active' : 'Disabled'}
            </p>
            <div className="mt-3 text-2xl font-bold text-white">
              {stats?.last24Hours?.profile_created || 0}
            </div>
            <p className="text-gray-400 text-xs">Last 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <ShoppingBagIcon className="w-8 h-8 text-purple-400" />
              <div className={`p-2 rounded-full ${config.phygitalOrderProcessing ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {config.phygitalOrderProcessing ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-medium mb-1">Order Processing</h3>
            <p className="text-gray-400 text-sm">
              {config.phygitalOrderProcessing ? 'Active' : 'Disabled'}
            </p>
            <div className="mt-3 text-2xl font-bold text-white">
              {stats?.last24Hours?.order_processed || 0}
            </div>
            <p className="text-gray-400 text-xs">Last 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-yellow-400" />
              <div className={`p-2 rounded-full ${config.analyticsTracking ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {config.analyticsTracking ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
            <h3 className="text-white font-medium mb-1">Analytics Tracking</h3>
            <p className="text-gray-400 text-sm">
              {config.analyticsTracking ? 'Active' : 'Disabled'}
            </p>
            <div className="mt-3 text-2xl font-bold text-white">
              {stats?.totalProcessed || 0}
            </div>
            <p className="text-gray-400 text-xs">Total processed</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.button
            onClick={runAutomationTest}
            disabled={isTestingAutomation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTestingAutomation ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Testing Automation...
              </>
            ) : (
              <>
                <BoltIcon className="w-5 h-5" />
                Run Automation Test
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => triggerManualAction('cleanup_automation_logs')}
            disabled={selectedAction === 'cleanup_automation_logs'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedAction === 'cleanup_automation_logs' ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Cleaning Logs...
              </>
            ) : (
              <>
                <DocumentDuplicateIcon className="w-5 h-5" />
                Clean Up Logs
              </>
            )}
          </motion.button>

          <motion.button
            onClick={fetchAutomationData}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Refresh Data
          </motion.button>
        </div>

        {/* Test Results */}
        <AnimatePresence>
          {testResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className={`bg-white/10 backdrop-blur-sm rounded-xl border p-6 ${
                testResults.success ? 'border-green-500/50' : 'border-red-500/50'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {testResults.success ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  ) : (
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  )}
                  <h3 className="text-white font-medium">
                    Automation Test {testResults.success ? 'Passed' : 'Failed'}
                  </h3>
                </div>
                
                {testResults.success ? (
                  <div className="space-y-3">
                    <p className="text-gray-300">{testResults.message}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">Profile Creation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">QR Generation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">Order Processing</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-300">Test failed: {testResults.error}</p>
                    {testResults.details && (
                      <p className="text-gray-400 text-sm mt-2">{testResults.details}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Activity Logs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No recent automation activity</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  {getActionIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium capitalize">
                        {log.type.replace('_', ' ')}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {log.details?.message || `Automated ${log.type} action`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm ${log.details?.success !== false ? 'text-green-400' : 'text-red-400'}`}>
                      {log.details?.success !== false ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}