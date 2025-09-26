import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - FASHUN.CO | Legal Terms',
  description: 'Read FASHUN.CO\'s terms and conditions for using our website and purchasing our premium streetwear products.',
  keywords: 'terms and conditions, legal terms, FASHUN.CO terms of service'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-gray-300 text-lg mb-8">
            Last updated: September 26, 2025
          </p>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Welcome to FASHUN.CO. These Terms and Conditions ("Terms") govern your use of our website and the purchase 
            of products from us. By accessing our website or making a purchase, you agree to be bound by these Terms.
          </p>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">2. Products and Services</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>All products are subject to availability</li>
              <li>We reserve the right to discontinue any product at any time</li>
              <li>Product colors may vary slightly from those shown on your monitor</li>
              <li>We strive to display accurate product information but cannot guarantee it is always complete or current</li>
              <li>We reserve the right to limit quantities of products purchased</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">3. Ordering and Payment</h2>
            
            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Order Acceptance</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>All orders are subject to acceptance by FASHUN.CO</li>
              <li>We may refuse or cancel any order for any reason</li>
              <li>Order confirmation does not guarantee product availability</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Payment Terms</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Payment is required at the time of purchase</li>
              <li>We accept major credit cards, debit cards, and digital payment methods</li>
              <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">4. Shipping and Delivery</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>We ship to addresses within India</li>
              <li>Shipping costs and delivery times are provided at checkout</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to you upon delivery to the shipping address</li>
              <li>We are not responsible for delays caused by shipping carriers or customs</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">5. Returns and Exchanges</h2>
            
            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Return Policy</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Items may be returned within 7 days of delivery</li>
              <li>Items must be unworn, unwashed, with original tags attached</li>
              <li>Items must be in original packaging</li>
              <li>Some items (intimate apparel, personalized items) are not returnable</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Exchange Policy</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Exchanges are subject to product availability</li>
              <li>Size exchanges are free within 7 days</li>
              <li>Color/style exchanges may incur additional charges</li>
              <li>Original shipping costs are non-refundable</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">6. User Accounts</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must provide accurate and current information</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">7. Intellectual Property</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>All content on this website is owned by FASHUN.CO or our licensors</li>
              <li>You may not reproduce, distribute, or create derivative works without permission</li>
              <li>Our trademarks and logos may not be used without written consent</li>
              <li>Product designs and artwork are protected by copyright and trademark laws</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">8. Prohibited Uses</h2>
            <p className="text-gray-300 mb-4">You may not use our website:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">9. Disclaimers</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Products are provided "as is" without warranties of any kind</li>
              <li>We do not guarantee that the website will be uninterrupted or error-free</li>
              <li>We are not responsible for technical issues or service interruptions</li>
              <li>Product images are for illustration purposes and may not represent exact colors or details</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">10. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              In no case shall FASHUN.CO, our directors, officers, employees, affiliates, agents, contractors, interns, 
              suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, 
              incidental, punitive, special, or consequential damages of any kind.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">11. Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify, defend, and hold harmless FASHUN.CO and our subsidiaries, affiliates, partners, 
              officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns, 
              and employees from any claim or demand made by any third party due to or arising out of your breach of these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">12. Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed and construed in accordance with the laws of India. Any disputes arising from 
              these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">13. Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated 
              revision date. Your continued use of the website following the posting of changes constitutes acceptance of those changes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">14. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 mb-2"><strong>Email:</strong> legal@fashun.co</p>
              <p className="text-gray-300 mb-2"><strong>Address:</strong> FASHUN.CO Legal Department</p>
              <p className="text-gray-300 mb-2">Mumbai, Maharashtra, India</p>
              <p className="text-gray-300"><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}