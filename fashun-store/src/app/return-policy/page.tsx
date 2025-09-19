import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return Policy - FUC! Fashion | Easy Returns & Exchanges',
  description: 'Learn about our hassle-free return and exchange policy for FUC! Fashion products.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Return Policy
          </h1>
          <p className="text-xl text-primary-300">
            Hassle-free returns and exchanges for your complete satisfaction
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Return Window</h2>
              <div className="bg-primary-900 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">Standard Items</h3>
                    <ul className="text-primary-300 space-y-2">
                      <li>• 30 days from delivery</li>
                      <li>• Items must be unworn</li>
                      <li>• Original tags attached</li>
                      <li>• Original packaging required</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-accent-400 mb-3">Custom Designs</h3>
                    <ul className="text-primary-300 space-y-2">
                      <li>• 7 days from delivery</li>
                      <li>• Only for manufacturing defects</li>
                      <li>• Quality issues covered</li>
                      <li>• Print errors eligible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Return Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-2">1</div>
                  <h3 className="text-white font-semibold mb-2">Initiate Return</h3>
                  <p className="text-primary-300 text-sm">
                    Login to your account and select the item to return
                  </p>
                </div>
                <div className="bg-primary-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-2">2</div>
                  <h3 className="text-white font-semibold mb-2">Pack Item</h3>
                  <p className="text-primary-300 text-sm">
                    Securely pack the item with all original accessories
                  </p>
                </div>
                <div className="bg-primary-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-2">3</div>
                  <h3 className="text-white font-semibold mb-2">Schedule Pickup</h3>
                  <p className="text-primary-300 text-sm">
                    Our delivery partner will collect the package
                  </p>
                </div>
                <div className="bg-primary-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent-400 mb-2">4</div>
                  <h3 className="text-white font-semibold mb-2">Get Refund</h3>
                  <p className="text-primary-300 text-sm">
                    Receive your refund within 3-5 business days
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Return Conditions</h2>
              <div className="text-primary-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Eligible for Return</h3>
                    <ul className="space-y-2">
                      <li>✅ Unworn items with tags</li>
                      <li>✅ Items in original packaging</li>
                      <li>✅ Defective or damaged items</li>
                      <li>✅ Wrong size or color</li>
                      <li>✅ Items that don&apos;t match description</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Not Eligible for Return</h3>
                    <ul className="space-y-2">
                      <li>❌ Worn or washed items</li>
                      <li>❌ Items without original tags</li>
                      <li>❌ Damaged by customer</li>
                      <li>❌ Custom designs (unless defective)</li>
                      <li>❌ Items returned after 30 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Exchange Policy</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We offer free exchanges for size and color changes within the return window.
                </p>
                <div className="bg-primary-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Exchange Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-accent-400 mb-2">Size Exchange</h4>
                      <ul className="space-y-1">
                        <li>• Free size changes</li>
                        <li>• Same product only</li>
                        <li>• Subject to availability</li>
                        <li>• No additional shipping cost</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent-400 mb-2">Color Exchange</h4>
                      <ul className="space-y-1">
                        <li>• Available color options</li>
                        <li>• Same design and size</li>
                        <li>• Free exchange service</li>
                        <li>• Quick processing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Refund Process</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  Refunds are processed once we receive and inspect the returned item.
                </p>
                <div className="bg-primary-900 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-primary-800">
                        <th className="text-left p-4 text-white">Payment Method</th>
                        <th className="text-left p-4 text-white">Refund Time</th>
                        <th className="text-left p-4 text-white">Processing Fee</th>
                      </tr>
                    </thead>
                    <tbody className="text-primary-300">
                      <tr>
                        <td className="p-4">UPI / Digital Wallet</td>
                        <td className="p-4">1-2 business days</td>
                        <td className="p-4 text-accent-400">Free</td>
                      </tr>
                      <tr className="bg-primary-800">
                        <td className="p-4">Credit/Debit Card</td>
                        <td className="p-4">3-5 business days</td>
                        <td className="p-4 text-accent-400">Free</td>
                      </tr>
                      <tr>
                        <td className="p-4">Cash on Delivery</td>
                        <td className="p-4">5-7 business days</td>
                        <td className="p-4 text-accent-400">Free</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Quality Guarantee</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We stand behind the quality of our products. If you&apos;re not satisfied, we&apos;ll make it right.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Quality Promise</h3>
                    <p className="text-accent-400">100% satisfaction guarantee on all products</p>
                  </div>
                  <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Free Returns</h3>
                    <p className="text-accent-400">No questions asked return policy</p>
                  </div>
                  <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Quick Resolution</h3>
                    <p className="text-accent-400">Fast processing and refunds</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Damaged Items</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  If you receive a damaged or defective item, we&apos;ll resolve it immediately at no cost to you.
                </p>
                <div className="bg-primary-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What to Do</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-accent-400 font-semibold mr-3">1.</span>
                      <span>Take photos of the damaged item and packaging</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-400 font-semibold mr-3">2.</span>
                      <span>Contact our support team within 48 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-400 font-semibold mr-3">3.</span>
                      <span>We&apos;ll arrange immediate replacement or full refund</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-400 font-semibold mr-3">4.</span>
                      <span>No need to return the damaged item</span>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">International Returns</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  International return policies will be available when we launch global shipping.
                </p>
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4">
                  <p className="text-accent-400">
                    🌍 Coming Soon: International return and exchange services with prepaid return labels!
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Need Help?</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  Our customer service team is here to help with returns, exchanges, and any questions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-900 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Email Support</h3>
                    <p>returns@fashun.co.in</p>
                    <p className="text-sm text-primary-400 mt-1">24-hour response</p>
                  </div>
                  <div className="bg-primary-900 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Phone Support</h3>
                    <p>+91 98765 43210</p>
                    <p className="text-sm text-primary-400 mt-1">Mon-Sat: 9 AM - 7 PM</p>
                  </div>
                  <div className="bg-primary-900 rounded-lg p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                    <p>Available on website</p>
                    <p className="text-sm text-primary-400 mt-1">Instant support</p>
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
