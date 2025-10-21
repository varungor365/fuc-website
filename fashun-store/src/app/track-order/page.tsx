'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { OrderTracking } from '@/components/ui/order-tracking';
import { OrderState } from '@/components/ui/order-state';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  async function handleTrack() {
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError(null);

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (order) {
      setTracking({
        status: order.status,
        trackingNumber: order.tracking_id,
        carrier: order.carrier,
        trackingUrl: getTrackingUrl(order.carrier, order.tracking_id)
      });
    } else {
      setError('Order not found');
    }

    setLoading(false);
  }

  function getTrackingUrl(carrier: string, trackingId: string) {
    const urls: Record<string, string> = {
      delhivery: `https://www.delhivery.com/track/package/${trackingId}`,
      bluedart: `https://www.bluedart.com/tracking/${trackingId}`,
      dtdc: `https://www.dtdc.in/tracking/${trackingId}`,
      fedex: `https://www.fedex.com/fedextrack/?trknbr=${trackingId}`,
      dhl: `https://www.dhl.com/in-en/home/tracking.html?tracking-id=${trackingId}`
    };
    return urls[carrier] || '#';
  }

  const getStatusSteps = (status: string) => {
    const statusMap: Record<string, Array<{ title: string; description: string; date?: string; status: 'completed' | 'current' | 'pending' }>> = {
      pending: [
        { title: 'Order Placed', description: 'Your order has been confirmed', status: 'completed' },
        { title: 'Processing', description: 'Preparing your items', status: 'current' },
        { title: 'Shipped', description: 'Out for delivery', status: 'pending' },
        { title: 'Delivered', description: 'Package delivered', status: 'pending' },
      ],
      processing: [
        { title: 'Order Placed', description: 'Your order has been confirmed', status: 'completed' },
        { title: 'Processing', description: 'Preparing your items', status: 'completed' },
        { title: 'Shipped', description: 'Out for delivery', status: 'current' },
        { title: 'Delivered', description: 'Package delivered', status: 'pending' },
      ],
      shipped: [
        { title: 'Order Placed', description: 'Your order has been confirmed', status: 'completed' },
        { title: 'Processing', description: 'Preparing your items', status: 'completed' },
        { title: 'Shipped', description: 'Out for delivery', status: 'completed' },
        { title: 'Delivered', description: 'Package delivered', status: 'current' },
      ],
      delivered: [
        { title: 'Order Placed', description: 'Your order has been confirmed', status: 'completed' },
        { title: 'Processing', description: 'Preparing your items', status: 'completed' },
        { title: 'Shipped', description: 'Out for delivery', status: 'completed' },
        { title: 'Delivered', description: 'Package delivered', status: 'completed' },
      ],
    };

    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Track Your Order
        </motion.h1>

        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1 px-6 py-4 bg-white/10 rounded-xl border border-white/20 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
            />
            <motion.button
              onClick={handleTrack}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl font-bold text-lg disabled:opacity-50 shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Tracking...' : 'Track'}
            </motion.button>
          </div>

          {error && (
            <motion.div 
              className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-xl text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {tracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Order State Card */}
            <OrderState
              status={tracking.status as any}
              orderNumber={orderId}
              estimatedDelivery={tracking.estimatedDelivery}
            />

            {/* Order Tracking Steps */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 text-center">Order Journey</h2>
              <OrderTracking steps={getStatusSteps(tracking.status).map((step, index) => ({
                id: `step-${index}`,
                ...step
              }))} />
            </div>

            {tracking.trackingNumber && (
              <div className="space-y-4 mt-8">
                <motion.div 
                  className="flex justify-between items-center p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-gray-300 text-lg">Tracking Number:</span>
                  <span className="font-bold text-xl">{tracking.trackingNumber}</span>
                </motion.div>

                <motion.div 
                  className="flex justify-between items-center p-6 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-gray-300 text-lg">Carrier:</span>
                  <span className="font-bold text-xl capitalize">{tracking.carrier}</span>
                </motion.div>

                {tracking.trackingUrl && (
                  <motion.a
                    href={tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-center text-lg shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Track on {tracking.carrier} Website →
                  </motion.a>
                )}
              </div>
            )}

            {!tracking.trackingNumber && tracking.status === 'pending' && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-400 text-lg">
                  Your order is being processed. Tracking information will be available soon.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
