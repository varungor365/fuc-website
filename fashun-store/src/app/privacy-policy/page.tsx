import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - FUC! Fashion | Your Data Protection',
  description: 'Learn how FUC! Fashion protects your privacy and handles your personal information. Our comprehensive privacy policy.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-primary-300">
            Last updated: December 2024
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Design uploads and custom artwork</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <div className="text-primary-300 space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer service and support</li>
                  <li>Send you order confirmations and shipping updates</li>
                  <li>Improve our products and services</li>
                  <li>Personalize your shopping experience</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to outside parties 
                  except as described in this policy:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Service providers who assist in our operations</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Shipping companies for order delivery</li>
                  <li>Legal requirements or to protect our rights</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits</li>
                  <li>Access controls and authentication</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
              <div className="text-primary-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your browsing experience, 
                  analyze site traffic, and personalize content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <div className="text-primary-300 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none space-y-2">
                  <li>Email: privacy@fashun.co.in</li>
                  <li>Phone: +91 98765 43210</li>
                  <li>Address: 123 Fashion Street, Mumbai, Maharashtra 400001</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-12 p-6 bg-primary-900 rounded-lg">
          <p className="text-primary-300 text-sm">
            This privacy policy is effective as of December 2024 and will remain in effect except with 
            respect to any changes in its provisions in the future, which will be in effect immediately 
            after being posted on this page.
          </p>
        </div>
      </div>
    </div>
  )
}
