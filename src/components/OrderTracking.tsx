import React, { useState } from 'react';
import { Search, ArrowLeft, Package, CheckCircle, Clock, LogIn } from 'lucide-react';
import { Order } from '../types';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface OrderTrackingProps {
  orders: Order[];
  onBack: () => void;
  userEmail: string | null;
}

export function OrderTracking({ orders, onBack, userEmail }: OrderTrackingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060714] text-white font-sans selection:bg-purple-500/30 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-200/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Back to Store
        </button>

        <div className="bg-[#0F1123] border border-indigo-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-900/20">
          <h2 className="text-3xl font-bold text-white mb-2">Track Your Order</h2>
          <p className="text-indigo-200/70 mb-8">Sign in with your email address to check the status of your purchases.</p>

          {!userEmail ? (
            <div className="text-center py-8">
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  <span className="font-bold">!</span> {error}
                </div>
              )}
              <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(107,70,193,0.3)] flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                <LogIn size={20} /> {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6 bg-[#060714] p-4 rounded-xl border border-indigo-500/20">
                <span className="text-indigo-200/70">Signed in as: <strong className="text-white">{userEmail}</strong></span>
                <button onClick={() => auth.signOut()} className="text-sm text-red-400 hover:text-red-300 transition-colors">Sign out</button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-indigo-200/50 bg-[#060714] rounded-2xl border border-indigo-500/10">
                  No orders found for this email address.
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-[#060714] border border-indigo-500/20 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{order.product?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-indigo-200/50 mt-1">Order ID: {order.id || 'Unknown'}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider ${
                        order.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        order.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {order.status || 'PENDING'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-indigo-200/70 border-t border-indigo-500/10 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-purple-400" />
                        ₹{order.price || 0}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-purple-400" />
                        {order.date ? new Date(order.date).toLocaleDateString() : 'Unknown Date'}
                      </div>
                    </div>

                    {order.status === 'DELIVERED' && order.deliveredKey && (
                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle size={14} /> Your Key / Account Details
                        </div>
                        <div className="font-mono text-white break-all">
                          {order.deliveredKey}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
