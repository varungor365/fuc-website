'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, HelpCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
          <p className="text-xl text-gray-600 mb-8">
            We couldn't process your payment. Please try again.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-red-800 mb-2">Common Issues:</h3>
            <ul className="text-left text-sm text-red-700 space-y-2">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details</li>
              <li>• Payment gateway timeout</li>
              <li>• Bank declined the transaction</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/checkout')}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Cart
            </button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600 mb-4">Need help?</p>
            <button
              onClick={() => router.push('/contact')}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center mx-auto"
            >
              <HelpCircle className="w-5 h-5 mr-2" />
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
