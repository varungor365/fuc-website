'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  ArrowRight,
  Star,
  MessageCircle,
  Download,
  Share2,
  AlertCircle,
  PhoneCall
} from 'lucide-react';

interface TrackingEvent {
  id: string;
  status: string;
  timestamp: string;
  location?: { city: string; state: string; country: string };
  description: string;
  automated: boolean;
}

interface Order {
  id: string;
  status: string;
  tracking_timeline: TrackingEvent[];
  estimated_delivery?: string;
  actual_delivery?: string;
  trackingNumber: string;
  shipping_carrier: string;
  priority: string;
  items: any[];
  total: number;
  customerEmail: string;
  shippingAddress: any;
  current_location?: { city: string; state: string; country: string; lat: number; lng: number };
  delivery_attempts: number;
  signature_required: boolean;
  external_tracking_url?: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'production', label: 'In Production', icon: Package },
  { key: 'quality_check', label: 'Quality Check', icon: CheckCircle },
  { key: 'packaging', label: 'Packaging', icon: Package },
  { key: 'ready_to_ship', label: 'Ready to Ship', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
];

const carrierLogos = {
  fedex: '/carrier-logos/fedex.png',
  ups: '/carrier-logos/ups.png',
  dhl: '/carrier-logos/dhl.png',
  usps: '/carrier-logos/usps.png',
  local_delivery: '/carrier-logos/local.png'
};

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    
    // Setup real-time updates
    const socket = new WebSocket(`ws://localhost:1337`);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.orderId === params.orderId) {
        setOrder(prev => prev ? { ...prev, ...data } : null);
      }
    };

    return () => socket.close();
  }, [params.orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`);
      if (!response.ok) throw new Error('Order not found');
      
      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600',
      confirmed: 'text-blue-600',
      processing: 'text-purple-600',
      production: 'text-orange-600',
      quality_check: 'text-indigo-600',
      packaging: 'text-pink-600',
      ready_to_ship: 'text-cyan-600',
      shipped: 'text-blue-600',
      in_transit: 'text-blue-600',
      out_for_delivery: 'text-green-600',
      delivered: 'text-green-600',
      cancelled: 'text-red-600',
      returned: 'text-red-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      standard: { color: 'bg-gray-100 text-gray-800', label: 'Standard' },
      express: { color: 'bg-blue-100 text-blue-800', label: 'Express' },
      overnight: { color: 'bg-red-100 text-red-800', label: 'Overnight' }
    };
    return badges[priority as keyof typeof badges] || badges.standard;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600">{error || 'The order you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();
  const priorityBadge = getPriorityBadge(order.priority);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">Tracking Number: {order.trackingNumber}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge.color}`}>
                {priorityBadge.label}
              </span>
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={carrierLogos[order.shipping_carrier as keyof typeof carrierLogos]} 
                alt={order.shipping_carrier}
                className="w-8 h-8"
              />
              <div>
                <p className="font-medium">{order.shipping_carrier.toUpperCase()}</p>
                <p className="text-sm text-gray-600">Shipping Carrier</p>
              </div>
            </div>

            {order.estimated_delivery && (
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">
                    {new Date(order.estimated_delivery).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                </div>
              </div>
            )}

            {order.current_location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">
                    {order.current_location.city}, {order.current_location.state}
                  </p>
                  <p className="text-sm text-gray-600">Current Location</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-6">Order Progress</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
            <motion.div 
              className="absolute left-4 top-8 w-0.5 bg-black"
              initial={{ height: 0 }}
              animate={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Status Steps */}
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center gap-4"
                  >
                    <motion.div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                        isCompleted 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-blue-600 font-medium"
                        >
                          Current Status
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Detailed Timeline */}
        {order.tracking_timeline && order.tracking_timeline.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-semibold mb-6">Detailed Timeline</h2>
            
            <div className="space-y-4">
              {order.tracking_timeline
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(event.status).replace('text-', 'bg-')}`} />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-900">{event.description}</p>
                        <span className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {event.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location.city}, {event.location.state}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-6">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                <img 
                  src={item.image || '/placeholder-product.jpg'} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                  <p className="font-medium text-gray-900">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total: ₹{order.total}</span>
              {order.status === 'delivered' && (
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Leave Review
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Chat Support</p>
                <p className="text-sm text-gray-600">Get instant help</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PhoneCall className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-gray-600">+91 XXX-XXX-XXXX</p>
              </div>
            </button>

            {order.external_tracking_url && (
              <a 
                href={order.external_tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Truck className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium">Carrier Tracking</p>
                  <p className="text-sm text-gray-600">View on carrier site</p>
                </div>
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Share Tracking</h3>
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  Copy Tracking Link
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  Send via Email
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  Share on WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
