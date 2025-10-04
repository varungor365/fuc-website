'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bug, 
  Zap, 
  Clock, 
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  ExternalLink,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface ErrorEvent {
  id: string;
  message: string;
  stack: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  source: 'frontend' | 'backend' | 'api';
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  count: number;
  lastOccurrence: string;
  resolved: boolean;
  tags: string[];
}

interface ErrorStats {
  total: number;
  resolved: number;
  unresolved: number;
  critical: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const ErrorMonitoring: React.FC = () => {
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<ErrorEvent[]>([]);
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    resolved: 0,
    unresolved: 0,
    critical: 0,
    trend: 'stable',
    trendPercentage: 0
  });
  
  const [filters, setFilters] = useState({
    level: 'all' as 'all' | 'error' | 'warning' | 'info',
    source: 'all' as 'all' | 'frontend' | 'backend' | 'api',
    resolved: 'all' as 'all' | 'resolved' | 'unresolved',
    search: ''
  });

  const [loading, setLoading] = useState(true);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  useEffect(() => {
    fetchErrors();
    const interval = setInterval(fetchErrors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [errors, filters]);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      
      // Mock error data
      const mockErrors: ErrorEvent[] = [
        {
          id: '1',
          message: 'TypeError: Cannot read property \'map\' of undefined',
          stack: 'TypeError: Cannot read property \'map\' of undefined\n    at ProductGrid.jsx:45:12\n    at Array.map\n    at ProductGrid',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          level: 'error',
          source: 'frontend',
          userId: 'user123',
          sessionId: 'sess_abc123',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          url: '/products',
          count: 15,
          lastOccurrence: new Date().toISOString(),
          resolved: false,
          tags: ['react', 'products', 'null-reference']
        },
        {
          id: '2',
          message: 'Payment processing failed: Invalid card number',
          stack: 'PaymentError: Invalid card number\n    at processPayment\n    at checkout.js:123',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          level: 'error',
          source: 'api',
          sessionId: 'sess_def456',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
          url: '/checkout',
          count: 8,
          lastOccurrence: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
          resolved: false,
          tags: ['payment', 'stripe', 'validation']
        },
        {
          id: '3',
          message: 'Database connection timeout',
          stack: 'ConnectionTimeoutError: Connection timed out after 5000ms\n    at Database.connect\n    at server.js:89',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          level: 'warning',
          source: 'backend',
          sessionId: 'sess_ghi789',
          userAgent: 'Internal Server Request',
          url: '/api/products',
          count: 3,
          lastOccurrence: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          resolved: true,
          tags: ['database', 'timeout', 'performance']
        }
      ];

      setErrors(mockErrors);
      
      // Calculate stats
      const totalErrors = mockErrors.length;
      const resolvedErrors = mockErrors.filter(e => e.resolved).length;
      const unresolvedErrors = totalErrors - resolvedErrors;
      const criticalErrors = mockErrors.filter(e => e.level === 'error' && !e.resolved).length;

      setStats({
        total: totalErrors,
        resolved: resolvedErrors,
        unresolved: unresolvedErrors,
        critical: criticalErrors,
        trend: 'down',
        trendPercentage: 12.5
      });

    } catch (error) {
      console.error('Failed to fetch errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...errors];

    if (filters.level !== 'all') {
      filtered = filtered.filter(error => error.level === filters.level);
    }

    if (filters.source !== 'all') {
      filtered = filtered.filter(error => error.source === filters.source);
    }

    if (filters.resolved !== 'all') {
      filtered = filtered.filter(error => 
        filters.resolved === 'resolved' ? error.resolved : !error.resolved
      );
    }

    if (filters.search) {
      filtered = filtered.filter(error =>
        error.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        error.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    setFilteredErrors(filtered);
  };

  const toggleErrorResolution = (errorId: string) => {
    setErrors(prev => prev.map(error =>
      error.id === errorId ? { ...error, resolved: !error.resolved } : error
    ));
  };

  const getLevelIcon = (level: ErrorEvent['level']) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Bug className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLevelColor = (level: ErrorEvent['level']) => {
    switch (level) {
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getSourceIcon = (source: ErrorEvent['source']) => {
    switch (source) {
      case 'frontend':
        return '🖥️';
      case 'backend':
        return '⚙️';
      case 'api':
        return '🔌';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
            <Bug className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Error Monitoring</h2>
            <p className="text-gray-400">Real-time error tracking and resolution</p>
          </div>
        </div>
        
        <button
          onClick={fetchErrors}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 
                   text-white rounded-lg transition-all duration-200 border border-white/10"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bug className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Errors</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <div className={`flex items-center text-xs ${
                  stats.trend === 'down' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${stats.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stats.trendPercentage}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 text-sm font-medium">Critical</p>
              <p className="text-2xl font-bold text-white">{stats.critical}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 text-sm font-medium">Unresolved</p>
              <p className="text-2xl font-bold text-white">{stats.unresolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 text-sm font-medium">Resolved</p>
              <p className="text-2xl font-bold text-white">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filters:</span>
          </div>

          <select
            value={filters.level}
            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value as any }))}
            className="px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Info</option>
          </select>

          <select
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value as any }))}
            className="px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="all">All Sources</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="api">API</option>
          </select>

          <select
            value={filters.resolved}
            onChange={(e) => setFilters(prev => ({ ...prev, resolved: e.target.value as any }))}
            className="px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-white text-sm
                     focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="all">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search errors..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-accent-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Errors List */}
      <div className="space-y-4">
        {filteredErrors.map(error => (
          <div
            key={error.id}
            className={`bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-200 ${
              error.resolved 
                ? 'border-green-500/30 bg-green-500/5' 
                : error.level === 'error' 
                  ? 'border-red-500/30 bg-red-500/5' 
                  : 'border-white/10'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getLevelIcon(error.level)}
                    <h3 className="text-lg font-semibold text-white line-clamp-1">
                      {error.message}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(error.level)}`}>
                      {error.level.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span>{getSourceIcon(error.source)}</span>
                      {error.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(error.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      {error.count} occurrences
                    </span>
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {error.url}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleErrorResolution(error.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      error.resolved
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                    }`}
                  >
                    {error.resolved ? 'Resolved' : 'Mark Resolved'}
                  </button>

                  <button
                    onClick={() => setExpandedError(expandedError === error.id ? null : error.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                             rounded-lg transition-all duration-200"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      expandedError === error.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {error.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Expanded Details */}
              {expandedError === error.id && (
                <div className="border-t border-white/10 pt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Stack Trace</h4>
                    <pre className="bg-black/20 p-4 rounded-lg border border-white/10 text-sm text-gray-300 
                                   font-mono overflow-x-auto whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Session Details</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>Session ID: <code className="text-white">{error.sessionId}</code></div>
                        {error.userId && (
                          <div>User ID: <code className="text-white">{error.userId}</code></div>
                        )}
                        <div>Last Occurrence: <code className="text-white">{formatTimestamp(error.lastOccurrence)}</code></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Environment</h4>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>URL: <code className="text-white">{error.url}</code></div>
                        <div>User Agent: <code className="text-white text-xs">{error.userAgent}</code></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredErrors.length === 0 && (
        <div className="text-center py-12">
          <Bug className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            {errors.length === 0 ? 'No errors found' : 'No errors match your filters'}
          </p>
          <p className="text-gray-500 text-sm">
            {errors.length === 0 ? 'Your application is running smoothly!' : 'Try adjusting your filters'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorMonitoring;