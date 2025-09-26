import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - FASHUN.CO | Your Privacy Matters',
  description: 'Read FASHUN.CO\'s privacy policy to understand how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, FASHUN.CO privacy'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-gray-300 text-lg mb-8">
            Last updated: September 26, 2025
          </p>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            At FASHUN.CO, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
            website or make a purchase from us.
          </p>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Information We Collect</h2>
            
            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Personal Information</h3>
            <p className="text-gray-300 mb-6">
              When you create an account, make a purchase, or interact with our services, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Name and contact information (email, phone, address)</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Order history and preferences</li>
              <li>Size and fit preferences</li>
              <li>Account credentials and profile information</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-4 text-pink-400">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>IP address and browser information</li>
              <li>Device information and operating system</li>
              <li>Website usage patterns and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Provide customer service and support</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Personalize your shopping experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Information Sharing</h2>
            <p className="text-gray-300 mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
              <li>Analytics providers to help us understand website usage</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Business partners in case of merger, acquisition, or sale (with proper notice)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Data Security</h2>
            <p className="text-gray-300 mb-6">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through certified providers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and employee training</li>
              <li>Data backup and recovery procedures</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Your Rights</h2>
            <p className="text-gray-300 mb-6">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Cookies Policy</h2>
            <p className="text-gray-300 mb-6">
              We use cookies and similar technologies to enhance your browsing experience:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
              <li><strong>Marketing Cookies:</strong> Used to show you relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, 
              comply with legal obligations, resolve disputes, and enforce our agreements. Account information is typically 
              retained for 7 years after account closure, while marketing data may be retained until you opt-out.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">International Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
              safeguards are in place to protect your data in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by 
              posting the new policy on our website and updating the "Last updated" date. Your continued use of our 
              services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 mb-2"><strong>Email:</strong> privacy@fashun.co</p>
              <p className="text-gray-300 mb-2"><strong>Address:</strong> FASHUN.CO Privacy Team</p>
              <p className="text-gray-300 mb-2">Mumbai, Maharashtra, India</p>
              <p className="text-gray-300"><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}