import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy - FUC! Fashion | Delivery Information',
  description: 'Learn about our shipping policies, delivery times, and shipping costs for FUC! Fashion orders.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Shipping Policy
          </h1>
          <p className="text-xl text-primary-300">
            Fast, reliable delivery for your FUC! Fashion orders
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Shipping Methods & Times</h2>
              <div className="bg-primary-900 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">Standard Delivery</h3>
                    <ul className="text-primary-300 space-y-2">
                      <li>• 3-5 business days</li>
                      <li>• Free on orders above ₹1,999</li>
                      <li>• ₹99 for orders below ₹1,999</li>
                      <li>• Track your package online</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">Express Delivery</h3>
                    <ul className="text-primary-300 space-y-2">
                      <li>• 1-2 business days</li>
                      <li>• ₹199 flat rate</li>
                      <li>• Available in major cities</li>
                      <li>• Priority processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Processing Time</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  All orders are processed within 1-2 business days. Orders are not shipped or delivered 
                  on weekends or holidays.
                </p>
                <div className="bg-primary-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Custom Design Items</h3>
                  <p className="text-primary-300">
                    Custom designed products require additional 2-3 business days for printing and 
                    quality checks before shipping.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Shipping Locations</h2>
              <div className="text-primary-300 space-y-4">
                <p>We currently ship to all locations within India.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Major Cities</h3>
                    <ul className="space-y-1">
                      <li>• Mumbai, Delhi, Bangalore</li>
                      <li>• Chennai, Kolkata, Hyderabad</li>
                      <li>• Pune, Ahmedabad, Jaipur</li>
                      <li>• Express delivery available</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Other Locations</h3>
                    <ul className="space-y-1">
                      <li>• All PIN codes covered</li>
                      <li>• Standard delivery only</li>
                      <li>• 3-7 business days</li>
                      <li>• Remote areas may take longer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Order Tracking</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  Once your order ships, you&apos;ll receive a tracking number via email and SMS to monitor 
                  your package&apos;s progress.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Real-time tracking updates</li>
                  <li>Email and SMS notifications</li>
                  <li>Track in your account dashboard</li>
                  <li>Delivery confirmation photos</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Shipping Costs</h2>
              <div className="bg-primary-900 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-800">
                      <th className="text-left p-4 text-white">Order Value</th>
                      <th className="text-left p-4 text-white">Standard Shipping</th>
                      <th className="text-left p-4 text-white">Express Shipping</th>
                    </tr>
                  </thead>
                  <tbody className="text-primary-300">
                    <tr>
                      <td className="p-4">Below ₹1,999</td>
                      <td className="p-4">₹99</td>
                      <td className="p-4">₹199</td>
                    </tr>
                    <tr className="bg-primary-800">
                      <td className="p-4">₹1,999 and above</td>
                      <td className="p-4 text-accent-400 font-semibold">FREE</td>
                      <td className="p-4">₹199</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Delivery Issues</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  If you experience any issues with your delivery, please contact our customer support 
                  team immediately.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Common Issues</h3>
                    <ul className="space-y-2">
                      <li>• Package not delivered</li>
                      <li>• Damaged package</li>
                      <li>• Wrong address delivery</li>
                      <li>• Delivery delays</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Our Response</h3>
                    <ul className="space-y-2">
                      <li>• 24-hour investigation</li>
                      <li>• Replacement or refund</li>
                      <li>• Expedited resolution</li>
                      <li>• Compensation for delays</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">International Shipping</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  International shipping is currently not available but will be launched soon. 
                  Sign up for notifications to be the first to know!
                </p>
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4">
                  <p className="text-accent-400">
                    🌍 Coming Soon: Global shipping to 50+ countries with express delivery options!
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  Have questions about shipping? Our customer support team is here to help!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-900 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Email</h3>
                    <p>shipping@fashun.co.in</p>
                  </div>
                  <div className="bg-primary-900 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Phone</h3>
                    <p>+91 98765 43210</p>
                  </div>
                  <div className="bg-primary-900 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Hours</h3>
                    <p>Mon-Sat: 9 AM - 7 PM</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
