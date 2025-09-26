import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges - FASHUN.CO | Easy Returns Policy',
  description: 'Learn about FASHUN.CO\'s hassle-free returns and exchange policy. 7-day returns, free size exchanges, and more.',
  keywords: 'FASHUN.CO returns, exchange policy, return process, size exchange'
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Returns & Exchanges
        </h1>
        
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            We want you to love your FASHUN.CO purchase! If you're not completely satisfied, we've made returns 
            and exchanges as easy as possible.
          </p>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Return Policy</h2>
            
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-6 border border-green-500/30 mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-green-400">7-Day Return Window</h3>
              <p className="text-gray-300">
                You have 7 days from the date of delivery to initiate a return. Items must be in original condition 
                with tags attached and in original packaging.
              </p>
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">What Can Be Returned?</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Unworn items with original tags attached</li>
              <li>Items in original packaging</li>
              <li>Items without damage, stains, or odors</li>
              <li>Non-personalized/customized items</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">What Cannot Be Returned?</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Intimate apparel and undergarments</li>
              <li>Personalized or customized items</li>
              <li>Items purchased with special discounts (unless defective)</li>
              <li>Items worn, washed, or damaged by customer</li>
              <li>Items without original tags or packaging</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Exchange Policy</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4 text-pink-400">Size Exchange</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>FREE</strong> within 7 days</li>
                  <li>• Subject to stock availability</li>
                  <li>• Same style and color only</li>
                  <li>• Original shipping costs non-refundable</li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-2xl font-semibold mb-4 text-pink-400">Style/Color Exchange</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Different style or color</li>
                  <li>• Price difference applies if any</li>
                  <li>• Shipping charges may apply</li>
                  <li>• Subject to availability</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">How to Return/Exchange</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Initiate Return</h3>
                  <p className="text-gray-300 mb-2">
                    Log into your account and go to "My Orders" or contact our customer support team.
                  </p>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-sm text-gray-400">
                      <strong>Email:</strong> returns@fashun.co<br/>
                      <strong>Phone:</strong> +91-XXXX-XXXXXX
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Pack Your Item</h3>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Place item in original packaging</li>
                    <li>• Ensure all tags are attached</li>
                    <li>• Include original invoice/receipt</li>
                    <li>• Add return/exchange form (if provided)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Ship It Back</h3>
                  <p className="text-gray-300 mb-2">
                    Use the prepaid return label (if provided) or ship at your own cost to our returns address.
                  </p>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-sm text-gray-400">
                      <strong>Returns Address:</strong><br/>
                      FASHUN.CO Returns Department<br/>
                      [Complete Address]<br/>
                      Mumbai, Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">Processing</h3>
                  <p className="text-gray-300">
                    Once we receive your return, we'll inspect the item and process your refund or exchange within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Refund Information</h2>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Refund Timeline</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                <li>• <strong>Net Banking:</strong> 5-7 business days</li>
                <li>• <strong>Digital Wallets:</strong> 3-5 business days</li>
                <li>• <strong>UPI:</strong> 3-5 business days</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">What Gets Refunded?</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Product price (minus any applicable deductions)</li>
              <li>Taxes paid on the product</li>
              <li><strong>Note:</strong> Original shipping charges are non-refundable unless the item was defective</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Store Credit Option</h3>
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-white/10">
              <p className="text-gray-300">
                Choose store credit and get an additional 10% bonus! Store credits never expire and can be used 
                for any future purchases.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Defective/Damaged Items</h2>
            
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Received a Defective Item?</h3>
              <p className="text-gray-300 mb-4">
                If you receive a defective or damaged item, contact us immediately. We'll arrange for a replacement 
                or full refund at no cost to you.
              </p>
              
              <h4 className="text-lg font-semibold mb-2 text-red-300">What to do:</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Contact us within 48 hours of delivery</li>
                <li>• Take photos of the defective item</li>
                <li>• Keep all original packaging</li>
                <li>• We'll provide a prepaid return label</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Return Shipping</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-pink-400">Customer Initiated Returns</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Customer pays return shipping</li>
                  <li>• Use recommended courier partners</li>
                  <li>• Get tracking number for safety</li>
                  <li>• Insure high-value items</li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-4 text-pink-400">Defective/Wrong Item</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• <strong>FREE</strong> return shipping</li>
                  <li>• Prepaid return label provided</li>
                  <li>• Priority processing</li>
                  <li>• Full refund or replacement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Size Guide Tips</h2>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                <strong>Avoid returns by choosing the right size!</strong>
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Check our detailed size chart for each product</li>
                <li>• Measure yourself with a tape measure</li>
                <li>• Consider the fit (slim, regular, oversized)</li>
                <li>• Read customer reviews for fit insights</li>
                <li>• Contact us if you're unsure about sizing</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">FAQ</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-pink-400">Can I return items bought during a sale?</h3>
                <p className="text-gray-300">
                  Yes, sale items can be returned within 7 days unless specifically mentioned as "Final Sale" 
                  or "No Returns" on the product page.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-pink-400">What if I ordered multiple items but want to return only some?</h3>
                <p className="text-gray-300">
                  You can return individual items from your order. Refunds will be processed only for the 
                  returned items, and shipping charges (if any) will be adjusted proportionally.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-pink-400">Can I exchange for a different product altogether?</h3>
                <p className="text-gray-300">
                  Yes! You can exchange for any product of equal or higher value. If the new product costs more, 
                  you'll need to pay the difference. If it costs less, we'll refund the difference.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Need Help?</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 mb-4">
                Our customer support team is here to help with your returns and exchanges.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 mb-2"><strong>Email:</strong> returns@fashun.co</p>
                  <p className="text-gray-300 mb-2"><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
                </div>
                <div>
                  <p className="text-gray-300 mb-2"><strong>Hours:</strong> Monday - Saturday</p>
                  <p className="text-gray-300 mb-2"><strong>Time:</strong> 10:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}