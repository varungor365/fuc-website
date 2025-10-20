'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  QrCodeIcon, 
  PencilIcon, 
  EyeIcon, 
  ArrowDownTrayIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface QRCodeManagerProps {
  username: string;
}

export default function QRCodeManager({ username }: QRCodeManagerProps) {
  const [qrSettings, setQrSettings] = useState<any>(null);
  const [customQrUrl, setCustomQrUrl] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadQRData = async () => {
      try {
        // Get user profile with QR settings
        const { data: profile } = await supabase
          .from('profiles')
          .select('qr_settings, custom_qr_url, qr_created_at')
          .eq('username', username)
          .single();

        if (profile) {
          setQrSettings(profile.qr_settings);
          setCustomQrUrl(profile.custom_qr_url);
        }

        // Get recent phygital orders
        const { data: orders } = await supabase
          .from('phygital_orders')
          .select(`
            id,
            status,
            created_at,
            qr_code_url,
            orders (
              product_name,
              size,
              color,
              quantity
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentOrders(orders || []);
      } catch (error) {
        console.error('Error loading QR data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQRData();
  }, [username]);

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${username}`;

  const generateDefaultQR = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="h-32 bg-white/10 rounded mb-4"></div>
          <div className="h-4 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Preview Card */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <QrCodeIcon className="w-6 h-6" />
            Your QR Code
          </h3>
          <Link
            href="/qr-customizer"
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Customize
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Display */}
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-2xl p-6 mb-4">
              {customQrUrl ? (
                <img 
                  src={customQrUrl} 
                  alt="Custom QR Code" 
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <img 
                  src={generateDefaultQR()} 
                  alt="Default QR Code" 
                  className="w-48 h-48 object-contain"
                />
              )}
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <EyeIcon className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          {/* QR Info */}
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Profile Link</h4>
              <div className="bg-white/10 rounded-lg p-3">
                <code className="text-purple-300 text-sm break-all">{profileUrl}</code>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Status</h4>
              <div className="flex items-center gap-2">
                {customQrUrl ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Custom QR Active</span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">Using Default QR</span>
                  </>
                )}
              </div>
            </div>

            {qrSettings && (
              <div>
                <h4 className="text-white font-medium mb-2">Customizations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Dot Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: qrSettings.dotsOptions?.color || '#000000' }}
                      />
                      <span className="text-white">{qrSettings.dotsOptions?.color || '#000000'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Background:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: qrSettings.backgroundOptions?.color || '#ffffff' }}
                      />
                      <span className="text-white">{qrSettings.backgroundOptions?.color || '#ffffff'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Dot Style:</span>
                    <span className="text-white capitalize">{qrSettings.dotsOptions?.type || 'square'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Phygital Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Recent Phygital Orders
          </h3>
          
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{order.orders?.product_name}</h4>
                    <p className="text-white/60 text-sm">
                      {order.orders?.size} • {order.orders?.color} • Qty: {order.orders?.quantity}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      order.status === 'printing' ? 'bg-yellow-500/20 text-yellow-400' :
                      order.status === 'shipped' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {order.qr_code_url && (
                        <QrCodeIcon className="w-3 h-3" />
                      )}
                      {order.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/qr-customizer"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <PencilIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">Customize QR Code</h4>
              <p className="text-white/60 text-sm">Change colors, style & logo</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl opacity-50">
            <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white font-medium">Order History</h4>
              <p className="text-white/60 text-sm">View all phygital purchases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}