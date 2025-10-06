'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, Settings, LogOut, Edit } from 'lucide-react';
import { MedusaCustomerService } from '@/services/medusa';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      const customerData = await MedusaCustomerService.retrieve();
      setCustomer(customerData);
      setFormData({
        first_name: customerData.first_name || '',
        last_name: customerData.last_name || '',
        email: customerData.email || '',
        phone: customerData.phone || ''
      });

      const ordersData = await MedusaCustomerService.listOrders();
      setOrders(ordersData);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await MedusaCustomerService.update(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      loadCustomerData();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_id');
    localStorage.removeItem('customer_email');
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-600">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="font-semibold">{customer?.first_name} {customer?.last_name}</h3>
                <p className="text-sm text-gray-600">{customer?.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'orders', label: 'Orders', icon: Package },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <button
                      onClick={() => editing ? handleUpdateProfile() : setEditing(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      {editing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editing}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <button
                        onClick={() => router.push('/collections/all')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold">Order #{order.display_id}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {order.fulfillment_status}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <img
                                  src={item.thumbnail || '/placeholder.png'}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">₹{(item.total / 100).toFixed(2)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t flex justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-purple-600">₹{(order.total / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                  
                  {customer?.shipping_addresses?.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No saved addresses</p>
                      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customer?.shipping_addresses?.map((address: any) => (
                        <div key={address.id} className="border rounded-lg p-6">
                          <p className="font-semibold mb-2">{address.first_name} {address.last_name}</p>
                          <p className="text-sm text-gray-600">{address.address_1}</p>
                          {address.address_2 && <p className="text-sm text-gray-600">{address.address_2}</p>}
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.province} {address.postal_code}
                          </p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Your wishlist is empty</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
