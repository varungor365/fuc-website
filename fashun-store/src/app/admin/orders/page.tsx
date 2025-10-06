'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import medusaClient from '@/lib/medusa-client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadOrders();
    const channel = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, customer:customers(*)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    loadOrders();
  }

  async function updateTracking(orderId: string, trackingId: string, carrier: string) {
    await supabase.from('orders').update({
      tracking_id: trackingId,
      carrier,
      status: 'shipped'
    }).eq('id', orderId);
    loadOrders();
  }

  async function cancelOrder(orderId: string) {
    if (!confirm('Cancel this order?')) return;
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
    loadOrders();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-green-500';
      case 'delivered': return 'bg-green-700';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Order Management</h1>
          <button
            onClick={loadOrders}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading orders...</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-gray-400">{order.customer?.email}</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold">₹{order.total}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Items</p>
                    <p className="font-bold">{order.items?.length || 0} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tracking ID</p>
                    <p className="font-bold">{order.tracking_id || 'Not shipped'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Carrier</p>
                    <p className="font-bold">{order.carrier || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-4 py-2 bg-white/10 rounded border border-white/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Add Tracking
                  </button>

                  <button
                    onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add Tracking Information</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateTracking(
                  selectedOrder.id,
                  formData.get('tracking_id') as string,
                  formData.get('carrier') as string
                );
                setSelectedOrder(null);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Tracking ID</label>
                    <input
                      name="tracking_id"
                      required
                      className="w-full px-4 py-2 bg-white/10 rounded border border-white/20"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Carrier</label>
                    <select
                      name="carrier"
                      required
                      className="w-full px-4 py-2 bg-white/10 rounded border border-white/20"
                    >
                      <option value="">Select carrier</option>
                      <option value="delhivery">Delhivery</option>
                      <option value="bluedart">Blue Dart</option>
                      <option value="dtdc">DTDC</option>
                      <option value="fedex">FedEx</option>
                      <option value="dhl">DHL</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
