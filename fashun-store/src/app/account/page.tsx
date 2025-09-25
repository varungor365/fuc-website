export default function AccountPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login */}
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-300">
                  <input type="checkbox" className="mr-2 rounded bg-gray-800 border-gray-700" />
                  Remember me
                </label>
                <a href="#" className="text-yellow-400 hover:text-yellow-300 text-sm">Forgot password?</a>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-400 transition-all"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* Register */}
          <div className="bg-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="flex items-start text-gray-300">
                  <input type="checkbox" className="mr-2 mt-1 rounded bg-gray-800 border-gray-700" required />
                  <span className="text-sm">I agree to the <a href="#" className="text-yellow-400 hover:text-yellow-300">Terms & Conditions</a> and <a href="#" className="text-yellow-400 hover:text-yellow-300">Privacy Policy</a></span>
                </label>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-400 transition-all"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Create an Account?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">Faster Checkout</h3>
              <p className="text-gray-400">Save your details for lightning-fast purchases</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-white mb-2">Order Tracking</h3>
              <p className="text-gray-400">Track your orders and view purchase history</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-lg font-semibold text-white mb-2">Exclusive Offers</h3>
              <p className="text-gray-400">Get access to member-only deals and early drops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}