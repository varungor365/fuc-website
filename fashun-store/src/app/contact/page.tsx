export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions? Need help with your order? Want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Subject</label>
                <select className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Product Question</option>
                  <option>Partnership/Collaboration</option>
                  <option>Returns & Exchanges</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none" 
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-black w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                    📧
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400">hello@fashun.co.in</p>
                    <p className="text-gray-400">support@fashun.co.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-black w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                    📞
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                    <p className="text-gray-400">+91 98765 43210</p>
                    <p className="text-gray-500 text-sm">Mon-Fri, 10 AM - 7 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-black w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                    📍
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Office</h3>
                    <p className="text-gray-400">Fashion Hub District</p>
                    <p className="text-gray-400">Mumbai, Maharashtra 400001</p>
                    <p className="text-gray-400">India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400 text-black w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                    💬
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Social Media</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-900 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Quick Help</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-1">Order Tracking</h4>
                  <p className="text-gray-400 text-sm">Track your order status and delivery updates</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Size Guide</h4>
                  <p className="text-gray-400 text-sm">Find your perfect fit with our sizing chart</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Returns</h4>
                  <p className="text-gray-400 text-sm">Easy 30-day return policy</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Shipping</h4>
                  <p className="text-gray-400 text-sm">Free shipping on orders over ₹2,999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}