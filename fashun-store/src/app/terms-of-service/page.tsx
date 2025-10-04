'use client'

import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
  InformationCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function TermsOfServicePage() {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: DocumentTextIcon,
      content: [
        'By accessing and using our website, you accept and agree to be bound by these terms',
        'These terms apply to all visitors, users, and customers',
        'If you do not agree to these terms, please do not use our services',
        'Continued use of the website constitutes acceptance of any updated terms'
      ]
    },
    {
      id: 'products-services',
      title: 'Products and Services',
      icon: BuildingOffice2Icon,
      content: [
        'We reserve the right to refuse service to anyone for any reason',
        'Product descriptions and pricing are subject to change without notice',
        'We do not warrant that product descriptions are accurate or complete',
        'Colors and appearance may vary from product images on your device',
        'All sales are final unless otherwise stated in our return policy',
        'Limited quantities available - first come, first served basis'
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: UserGroupIcon,
      content: [
        'You must be at least 18 years old to create an account',
        'You are responsible for maintaining account confidentiality',
        'You must provide accurate and complete information',
        'One account per person - multiple accounts may result in suspension',
        'We reserve the right to terminate accounts that violate our terms',
        'Account holders are liable for all activities under their account'
      ]
    },
    {
      id: 'payment-terms',
      title: 'Payment Terms',
      icon: CurrencyRupeeIcon,
      content: [
        'Payment is required at the time of purchase',
        'We accept major credit cards, debit cards, and digital wallets',
        'All prices are in Indian Rupees (INR) unless otherwise specified',
        'Additional charges may apply for international transactions',
        'Refunds will be processed according to our return policy',
        'We reserve the right to refuse or cancel orders for any reason'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: ScaleIcon,
      content: [
        'All website content is owned by FASHUN or licensed to us',
        'You may not reproduce, distribute, or create derivative works',
        'Our trademarks and logos are protected intellectual property',
        'User-generated content grants us license to use, modify, and display',
        'We respect third-party intellectual property rights',
        'Report any copyright infringement to our designated agent'
      ]
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses',
      icon: ExclamationTriangleIcon,
      content: [
        'No illegal, fraudulent, or unauthorized activities',
        'No harassment, abuse, or harmful content',
        'No spam, phishing, or malicious software',
        'No unauthorized access to our systems or other users\' accounts',
        'No interference with website operation or security features',
        'No commercial use without express written permission'
      ]
    }
  ]

  const lastUpdated = "January 1, 2024"

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ScaleIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Terms of
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. 
              By using FASHUN, you agree to these terms and conditions.
            </p>
            <div className="mt-6 text-primary-300 text-sm">
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-start">
              <InformationCircleIcon className="w-8 h-8 text-accent-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to FASHUN</h2>
                <div className="text-primary-200 space-y-4">
                  <p>
                    These Terms of Service ("Terms") govern your use of the FASHUN website, 
                    mobile application, and related services (collectively, the "Service") 
                    operated by FASHUN ("us," "we," or "our").
                  </p>
                  <p>
                    Our Service allows you to browse, purchase, and interact with our streetwear 
                    products and community. By accessing or using our Service, you agree to be 
                    bound by these Terms and our Privacy Policy.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you and FASHUN. 
                    Please read them carefully and contact us if you have any questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-12 mb-16">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-accent-500/20 rounded-full p-3 mr-4">
                    <IconComponent className="w-6 h-6 text-accent-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start text-primary-200">
                      <div className="w-2 h-2 bg-accent-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Shipping and Returns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-accent-500/20 rounded-full p-3 mr-4">
                <GlobeAltIcon className="w-6 h-6 text-accent-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Shipping and Returns</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-accent-400 mb-3">Shipping Terms</h3>
                <ul className="space-y-2 text-primary-200 text-sm">
                  <li>• Shipping costs are calculated at checkout</li>
                  <li>• We are not responsible for shipping delays beyond our control</li>
                  <li>• Risk of loss passes to you upon delivery</li>
                  <li>• International shipping may incur additional duties and taxes</li>
                  <li>• Delivery times are estimates and not guarantees</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent-400 mb-3">Return Policy</h3>
                <ul className="space-y-2 text-primary-200 text-sm">
                  <li>• 30-day return window from delivery date</li>
                  <li>• Items must be unworn with original tags</li>
                  <li>• Customer responsible for return shipping costs</li>
                  <li>• Refunds processed within 5-7 business days</li>
                  <li>• Sale items and custom orders are final sale</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimers and Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/20 rounded-3xl p-8">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Disclaimers and Limitations</h2>
                <div className="text-primary-200 space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Service Availability</h3>
                    <p className="text-sm">
                      We do not guarantee that our service will be available at all times. 
                      We may suspend or discontinue any part of our service without notice.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Limitation of Liability</h3>
                    <p className="text-sm">
                      Our liability is limited to the maximum extent permitted by law. We are 
                      not liable for any indirect, incidental, or consequential damages.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Warranty Disclaimer</h3>
                    <p className="text-sm">
                      Our service is provided "as is" without warranties of any kind, either 
                      express or implied, including but not limited to merchantability or fitness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-accent-500/20 rounded-full p-3 mr-4">
                <ScaleIcon className="w-6 h-6 text-accent-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Governing Law and Disputes</h2>
            </div>
            <div className="text-primary-200 space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising from these terms or your use of our service shall be subject 
                to the exclusive jurisdiction of the courts in Mumbai, India.
              </p>
              <p>
                We encourage resolving disputes through direct communication. If a dispute cannot 
                be resolved amicably, we may pursue alternative dispute resolution methods including 
                mediation or arbitration before resorting to litigation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Changes to Terms */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Changes to Terms</h2>
            <div className="text-primary-200 space-y-4">
              <p>
                We reserve the right to update these Terms at any time. Changes will be effective 
                immediately upon posting to the website. Your continued use of our service after 
                changes constitutes acceptance of the new terms.
              </p>
              <p>
                For significant changes, we will provide notice through email, website banner, 
                or other prominent means. We recommend reviewing these Terms periodically to 
                stay informed of any updates.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center">
            <EnvelopeIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification 
              on any provision, please contact our legal team.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <EnvelopeIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Legal Team</h3>
                <p className="text-primary-300 text-sm">legal@fashun.co</p>
              </div>
              
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <BuildingOffice2Icon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Registered Office</h3>
                <p className="text-primary-300 text-sm">
                  Mumbai, Maharashtra<br />
                  India
                </p>
              </div>
              
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <ScaleIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Compliance</h3>
                <p className="text-primary-300 text-sm">
                  CIN: U74999MH2024PTC123456<br />
                  GST: 27XXXXX1234X1ZX
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-glass">
                Contact Legal Team
              </button>
              <button className="btn btn-ghost text-white border-white/30 hover:bg-white/10">
                Download Terms (PDF)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}