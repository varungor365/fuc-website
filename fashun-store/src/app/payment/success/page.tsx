'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Mail, Download } from 'lucide-react';
import { MedusaOrderService } from '@/services/medusa';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await MedusaOrderService.retrieve(orderId!);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block"
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          {order && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-bold text-lg">#{order.display_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg text-purple-600">₹{(order.total / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium text-green-600">Paid</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 rounded-lg p-6">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">Check your inbox for order details</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Processing</h3>
              <p className="text-sm text-gray-600">We're preparing your order</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <Truck className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Shipping</h3>
              <p className="text-sm text-gray-600">Delivery in 3-5 business days</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/track-order')}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Track Order
            </button>
            <button
              onClick={() => router.push('/collections/all')}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>

        {order && order.items && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mt-8"
          >
            <h2 className="text-2xl font-bold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.thumbnail || '/placeholder.png'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.variant?.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.total / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(order.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{(order.shipping_total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{(order.tax_total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-purple-600">₹{(order.total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
