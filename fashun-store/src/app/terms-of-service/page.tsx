import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - FUC! Fashion | Legal Terms',
  description: 'Read our terms of service and conditions for using FUC! Fashion website and services.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-primary-300">
            Last updated: December 2024
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  By accessing and using FUC! Fashion website and services, you accept and agree to be 
                  bound by the terms and provision of this agreement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  Permission is granted to temporarily download one copy of FUC! Fashion materials for 
                  personal, non-commercial transitory viewing only.
                </p>
                <p>This license shall automatically terminate if you violate any of these restrictions.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <div className="text-primary-300 space-y-4">
                <p>When you create an account with us, you must provide accurate and complete information.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>You are responsible for safeguarding your password</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>You must notify us of any unauthorized use</li>
                  <li>We reserve the right to terminate accounts</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Products and Services</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  All products and services are subject to availability. We reserve the right to 
                  discontinue any product at any time.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Product descriptions are as accurate as possible</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Colors may vary due to monitor settings</li>
                  <li>Custom designs are final sale</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  The content, design, graphics, and other intellectual property on this site are 
                  protected by copyright and other laws.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>FUC! trademarks and logos are our property</li>
                  <li>User-generated content remains user&apos;s property</li>
                  <li>Users grant us license to use uploaded designs</li>
                  <li>Infringement will be pursued legally</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Payment Terms</h2>
              <div className="text-primary-300 space-y-4">
                <p>Payment is due at the time of order placement.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>We accept major credit cards and UPI</li>
                  <li>All prices are in Indian Rupees (INR)</li>
                  <li>Additional charges may apply for international orders</li>
                  <li>Payment processing is secured by our partners</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Shipping and Delivery</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We will make every effort to deliver products within the estimated timeframe, 
                  but delays may occur.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Shipping costs are calculated at checkout</li>
                  <li>Delivery times are estimates, not guarantees</li>
                  <li>Risk of loss transfers upon delivery</li>
                  <li>International shipping subject to customs</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Returns and Refunds</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  Returns are accepted within 30 days of delivery for eligible items in original condition.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Custom items are final sale</li>
                  <li>Return shipping costs are customer&apos;s responsibility</li>
                  <li>Refunds processed within 5-7 business days</li>
                  <li>Items must have original tags</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  FUC! Fashion shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  For questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li>Email: legal@fashun.co.in</li>
                  <li>Phone: +91 98765 43210</li>
                  <li>Address: 123 Fashion Street, Mumbai, Maharashtra 400001</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-12 p-6 bg-primary-900 rounded-lg">
          <p className="text-primary-300 text-sm">
            These terms of service are effective as of December 2024. We reserve the right to update 
            these terms at any time. Continued use of our services constitutes acceptance of any changes.
          </p>
        </div>
      </div>
    </div>
  )
}
