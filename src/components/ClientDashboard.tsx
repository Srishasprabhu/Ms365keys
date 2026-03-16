import React from 'react';
import { LogOut, Package, ArrowLeft, Key } from 'lucide-react';
import { Order } from '../types';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface ClientDashboardProps {
  orders: Order[];
  onBack: () => void;
  onLogout: () => void;
}

export function ClientDashboard({ orders, onBack, onLogout }: ClientDashboardProps) {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#060714] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Store
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-indigo-200/60 text-sm">{auth.currentUser?.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-[#0a0b1a] rounded-2xl border border-indigo-500/20 overflow-hidden shadow-2xl shadow-indigo-500/10">
          <div className="p-6 border-b border-indigo-500/20 flex items-center gap-3">
            <Package className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold">Order History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#060714] text-indigo-200/60 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium border-b border-indigo-500/20">Date</th>
                  <th className="p-4 font-medium border-b border-indigo-500/20">Product</th>
                  <th className="p-4 font-medium border-b border-indigo-500/20">Price</th>
                  <th className="p-4 font-medium border-b border-indigo-500/20">Status</th>
                  <th className="p-4 font-medium border-b border-indigo-500/20">Delivery Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/10">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-indigo-200/40">
                      You haven't placed any orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="p-4 text-indigo-200">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="p-4 font-medium">{order.product?.name || 'Unknown Product'}</td>
                      <td className="p-4 text-indigo-300">₹{order.price}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          order.status === 'DELIVERED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {order.status === 'DELIVERED' && order.deliveredKey ? (
                          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                            <Key className="w-4 h-4" />
                            <span className="font-mono text-sm">{order.deliveredKey}</span>
                          </div>
                        ) : (
                          <span className="text-indigo-200/40 text-sm italic">
                            {order.status === 'PENDING' ? 'Awaiting processing...' : 'Not available'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
