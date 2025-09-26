import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery - FASHUN.CO | Fast & Reliable Shipping',
  description: 'Learn about FASHUN.CO\'s shipping policies, delivery times, and shipping costs for our premium streetwear collection across India.',
  keywords: 'FASHUN.CO shipping, delivery policy, shipping costs, delivery times India'
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Shipping & Delivery
        </h1>
        
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            We're committed to getting your premium streetwear to you quickly and safely. Here's everything you need 
            to know about our shipping and delivery process.
          </p>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Shipping Options</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4 text-pink-400">Standard Shipping</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Delivery: 3-5 business days</li>
                  <li>• Cost: ₹99 (Free on orders above ₹999)</li>
                  <li>• Available: Pan-India</li>
                  <li>• Tracking: Yes</li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4 text-pink-400">Express Shipping</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Delivery: 1-2 business days</li>
                  <li>• Cost: ₹199</li>
                  <li>• Available: Major cities</li>
                  <li>• Tracking: Yes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Processing Time</h2>
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-6 border border-white/10">
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Order Processing:</strong> 1-2 business days</li>
                <li>• <strong>Custom/Personalized Items:</strong> 3-5 business days</li>
                <li>• <strong>Pre-order Items:</strong> As specified on product page</li>
                <li>• <strong>Sale/Clearance Items:</strong> 2-3 business days</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Delivery Areas</h2>
            
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-pink-400">Express Delivery Cities</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300">Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, Ahmedabad</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Standard Delivery</h3>
            <p className="text-gray-300 mb-4">
              We deliver to all serviceable pin codes across India through our trusted shipping partners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Shipping Costs</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-white/10 rounded-lg overflow-hidden">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Order Value</th>
                    <th className="px-6 py-4 text-left font-semibold">Standard Shipping</th>
                    <th className="px-6 py-4 text-left font-semibold">Express Shipping</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-t border-white/10">
                    <td className="px-6 py-4">Below ₹999</td>
                    <td className="px-6 py-4">₹99</td>
                    <td className="px-6 py-4">₹199</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="px-6 py-4">₹999 - ₹2999</td>
                    <td className="px-6 py-4 text-green-400">FREE</td>
                    <td className="px-6 py-4">₹199</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="px-6 py-4">Above ₹2999</td>
                    <td className="px-6 py-4 text-green-400">FREE</td>
                    <td className="px-6 py-4">₹99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Order Tracking</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-pink-400">How to Track Your Order</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>You'll receive an email with tracking information once your order ships</li>
                <li>Log into your FASHUN.CO account and visit "My Orders"</li>
                <li>Click on the order you want to track</li>
                <li>Use the tracking number on the shipping partner's website</li>
                <li>Get real-time updates on your order status</li>
              </ol>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Delivery Process</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Order Confirmation</h3>
                  <p className="text-gray-300">You'll receive an order confirmation email immediately after purchase.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Processing</h3>
                  <p className="text-gray-300">Our team carefully picks, packs, and prepares your order for shipping.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Shipped</h3>
                  <p className="text-gray-300">You'll receive tracking information once your package is with our shipping partner.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Delivered</h3>
                  <p className="text-gray-300">Your order arrives at your doorstep. Signature may be required for high-value orders.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Special Delivery Instructions</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Please provide a complete and accurate delivery address</li>
              <li>Include apartment/flat number and nearby landmarks</li>
              <li>Ensure someone is available to receive the package</li>
              <li>Orders above ₹5000 may require signature confirmation</li>
              <li>We'll attempt delivery up to 3 times before returning to our facility</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Shipping Restrictions</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <ul className="text-gray-300 space-y-2">
                <li>• We currently ship only within India</li>
                <li>• Some remote locations may have extended delivery times</li>
                <li>• COD available in select cities (orders above ₹500)</li>
                <li>• Heavy items may incur additional shipping charges</li>
                <li>• During festivals/sales, delivery times may be extended</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Delivery Issues</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-pink-400">What if my package is delayed?</h3>
              <p className="text-gray-300 mb-4">
                If your package is significantly delayed beyond the expected delivery date, please contact our 
                customer support team. We'll investigate and provide updates on your shipment.
              </p>
              
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Damaged or Lost Packages</h3>
              <p className="text-gray-300">
                In the rare event that your package arrives damaged or goes missing, contact us within 48 hours 
                of the expected delivery date. We'll work with our shipping partners to resolve the issue quickly.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              Have questions about shipping or need help with your order? We're here to help!
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 mb-2"><strong>Email:</strong> shipping@fashun.co</p>
              <p className="text-gray-300 mb-2"><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
              <p className="text-gray-300 mb-2"><strong>Hours:</strong> Monday - Saturday, 10:00 AM - 7:00 PM IST</p>
              <p className="text-gray-300"><strong>WhatsApp:</strong> Available for order updates and support</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}