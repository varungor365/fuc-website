import { Metadata } from 'next'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Contact Us - FUC! Fashion | Get in Touch',
  description: 'Contact FUC! fashion team. Get support, ask questions, or share feedback. We\'re here to help with your fashion needs.',
}

const contactInfo = [
  {
    icon: MapPinIcon,
    title: 'Visit Our Studio',
    details: ['123 Fashion Street', 'Mumbai, Maharashtra 400001', 'India'],
    color: 'text-blue-400'
  },
  {
    icon: PhoneIcon,
    title: 'Call Us',
    details: ['+91 98765 43210', 'Mon - Sat: 9 AM - 7 PM', 'Customer Support'],
    color: 'text-green-400'
  },
  {
    icon: EnvelopeIcon,
    title: 'Email Us',
    details: ['hello@fashun.co.in', 'support@fashun.co.in', 'We reply within 24 hours'],
    color: 'text-purple-400'
  },
  {
    icon: ClockIcon,
    title: 'Business Hours',
    details: ['Monday - Friday: 9 AM - 8 PM', 'Saturday: 10 AM - 6 PM', 'Sunday: Closed'],
    color: 'text-orange-400'
  }
]

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard delivery takes 3-5 business days within India. Express delivery is available for 1-2 business days.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all items in original condition with tags attached.'
  },
  {
    question: 'How does the AI Designer Tool work?',
    answer: 'Our AI tool uses advanced algorithms to generate unique designs based on your text descriptions. Simply describe what you want, and watch the magic happen!'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship within India only. International shipping will be available soon.'
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes! You\'ll receive a tracking number via email once your order ships. You can also track orders in your account dashboard.'
  }
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-accent-400">Touch</span>
          </h1>
          <p className="text-xl text-primary-300 max-w-3xl mx-auto">
            Have questions? Want to collaborate? Or just want to say hi? 
            We&apos;d love to hear from you. Here&apos;s how you can reach us.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-primary-900 rounded-xl p-8 text-center hover:bg-primary-800 transition-colors">
              <div className={`w-16 h-16 ${info.color} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-6`}>
                <info.icon className={`h-8 w-8 ${info.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{info.title}</h3>
              <div className="space-y-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-primary-300">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form & FAQ */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div>
            <div className="bg-primary-900 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-accent-400" />
                <h2 className="text-3xl font-bold text-white">Send us a Message</h2>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Subject</label>
                  <select className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-400">
                    <option value="">Choose a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="feedback">Feedback</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full bg-primary-800 border border-primary-700 rounded-lg px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-accent-500 hover:bg-accent-600 text-black font-semibold py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <QuestionMarkCircleIcon className="h-8 w-8 text-accent-400" />
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="bg-primary-900 rounded-lg p-6 hover:bg-primary-800 transition-colors group"
                >
                  <summary className="cursor-pointer text-white font-semibold text-lg flex items-center justify-between">
                    {faq.question}
                    <span className="text-accent-400 group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-primary-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
              
              <div className="bg-primary-900 rounded-lg p-6 text-center">
                <p className="text-primary-300 mb-4">
                  Still have questions? We&apos;re here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="mailto:support@fashun.co.in"
                    className="bg-accent-500 hover:bg-accent-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Email Support
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="bg-primary-800 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors border border-primary-600"
                  >
                    Call Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Additional Info */}
        <div className="py-16 bg-primary-900 rounded-2xl px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Connect With Us</h2>
          <p className="text-primary-300 mb-8 max-w-2xl mx-auto">
            Follow us on social media for the latest updates, behind-the-scenes content, 
            and exclusive previews of upcoming collections.
          </p>
          
          <div className="flex justify-center gap-6 mb-8">
            {[
              { name: 'Instagram', icon: '📸', href: '#' },
              { name: 'Twitter', icon: '🐦', href: '#' },
              { name: 'Facebook', icon: '📘', href: '#' },
              { name: 'YouTube', icon: '📹', href: '#' },
              { name: 'TikTok', icon: '🎵', href: '#' }
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-12 h-12 bg-primary-800 hover:bg-accent-500 rounded-full flex items-center justify-center text-2xl transition-colors group"
                title={social.name}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">For Press & Media</h3>
              <p className="text-primary-300 text-sm">
                Media inquiries and press kit requests: 
                <a href="mailto:press@fashun.co.in" className="text-accent-400 hover:text-accent-300 ml-1">
                  press@fashun.co.in
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Wholesale & B2B</h3>
              <p className="text-primary-300 text-sm">
                Bulk orders and business partnerships: 
                <a href="mailto:wholesale@fashun.co.in" className="text-accent-400 hover:text-accent-300 ml-1">
                  wholesale@fashun.co.in
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Careers</h3>
              <p className="text-primary-300 text-sm">
                Join our team and shape the future of fashion: 
                <a href="mailto:careers@fashun.co.in" className="text-accent-400 hover:text-accent-300 ml-1">
                  careers@fashun.co.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
