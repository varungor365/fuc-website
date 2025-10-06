'use client';

import { useState } from 'react';
import { trackOrder } from '@/lib/medusa-client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Track Your Order</h1>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1 px-6 py-4 bg-white/10 rounded-lg border border-white/20 text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {tracking && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Order Status</h2>

            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {getStatusSteps(tracking.status).map((step, index) => (
                  <div key={step.name} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        step.completed ? 'bg-green-500' : 'bg-gray-700'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <p className="mt-2 text-sm capitalize">{step.name}</p>
                    </div>
                    {index < 3 && (
                      <div className={`absolute top-6 left-1/2 w-full h-1 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {tracking.trackingNumber && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Tracking Number:</span>
                  <span className="font-bold">{tracking.trackingNumber}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-gray-400">Carrier:</span>
                  <span className="font-bold capitalize">{tracking.carrier}</span>
                </div>

                {tracking.trackingUrl && (
                  <a
                    href={tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-center"
                  >
                    Track on {tracking.carrier} Website →
                  </a>
                )}
              </div>
            )}

            {!tracking.trackingNumber && tracking.status === 'pending' && (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Your order is being processed. Tracking information will be available soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
