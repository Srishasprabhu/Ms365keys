import React, { useState, useEffect } from 'react';
import { X, Clock, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Product, Settings } from '../types';

interface CheckoutModalProps {
  product: Product;
  settings: Settings;
  onClose: () => void;
  onSubmit: (details: { name: string; email: string }) => void;
}

export function CheckoutModal({ product, settings, onClose, onSubmit }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in all fields');
      return;
    }
    onSubmit({ name, email });
  };

  const upiLink = settings.upiId 
    ? `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiName || 'Merchant')}&am=${product.price}&cu=INR`
    : '';

  return (
    <div className="fixed inset-0 bg-[#060714]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1123] border border-indigo-500/20 rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] shadow-2xl shadow-purple-900/20">
        <div className="p-5 border-b border-indigo-500/10 flex justify-between items-center bg-[#0F1123]">
          <h2 className="text-xl font-bold text-white tracking-wide">Complete your order</h2>
          <button onClick={onClose} className="text-indigo-200/60 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-[#060714]">
          <p className="text-indigo-200/70 text-sm mb-6 text-center">Fill in your details to proceed with the purchase</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          <div className="border border-indigo-500/20 rounded-2xl p-4 mb-6 bg-[#0F1123]">
            <div className="text-indigo-200/70 text-sm">{product.name}</div>
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mt-1">₹{product.price}</div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-indigo-200 mb-1.5 font-medium">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-indigo-200 mb-1.5 font-medium">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </form>

          <div className="mt-8 border border-indigo-500/20 rounded-2xl p-6 text-center bg-[#0F1123]">
            <h3 className="text-white font-bold mb-4 tracking-wide text-sm">Scan to Pay</h3>
            
            {settings.upiId ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 inline-block rounded-2xl mb-4 shadow-[0_0_20px_rgba(107,70,193,0.2)]">
                  <QRCodeSVG value={upiLink} size={160} level="H" includeMargin={false} />
                </div>
                {isMobile && (
                  <a 
                    href={upiLink}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mb-4 shadow-[0_0_15px_rgba(107,70,193,0.3)]"
                  >
                    <Smartphone size={20} />
                    Pay via UPI App
                  </a>
                )}
                <p className="text-indigo-200/50 text-xs">Scan using GPay, PhonePe, or Paytm</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-white p-2 inline-block rounded-2xl mb-4 shadow-[0_0_20px_rgba(107,70,193,0.2)]">
                  <img src={settings.paymentQrUrl} alt="Payment QR Code" className="w-32 h-32 object-contain rounded-xl" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+QR')} />
                </div>
                <p className="text-indigo-200/50 text-xs">Scan this QR code to complete payment</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-indigo-500/10 bg-[#0F1123]">
          <button 
            form="checkout-form"
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(107,70,193,0.3)]"
          >
            Confirm Order
          </button>
          <p className="text-indigo-200/50 text-xs text-center mt-4 flex items-center justify-center gap-1.5">
            <Clock size={12} /> Your product will be delivered to your email within 24 hours after payment verification.
          </p>
        </div>
      </div>
    </div>
  );
}
