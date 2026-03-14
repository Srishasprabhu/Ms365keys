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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
          <h2 className="text-xl font-bold text-red-500 uppercase tracking-wider">Complete your order</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <p className="text-zinc-400 text-sm mb-6 text-center">Fill in your details to proceed with the purchase</p>
          
          {error && (
            <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-3 rounded mb-6 text-sm flex items-center gap-2">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          <div className="border border-zinc-800 rounded p-4 mb-6 bg-zinc-900">
            <div className="text-zinc-400 text-sm">{product.name}</div>
            <div className="text-3xl font-bold text-red-500 mt-1">₹{product.price}</div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-yellow-500 mb-1">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-red-900/50 rounded p-3 text-white focus:outline-none focus:border-red-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-yellow-500 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-red-900/50 rounded p-3 text-white focus:outline-none focus:border-red-500"
                placeholder="john@example.com"
              />
            </div>
          </form>

          <div className="mt-8 border border-red-900/50 rounded p-6 text-center bg-zinc-900/50">
            <h3 className="text-yellow-500 font-bold mb-4 uppercase tracking-wider text-sm">Scan to Pay</h3>
            
            {settings.upiId ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 inline-block rounded-xl mb-4 shadow-lg">
                  <QRCodeSVG value={upiLink} size={160} level="H" includeMargin={false} />
                </div>
                {isMobile && (
                  <a 
                    href={upiLink}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors mb-4"
                  >
                    <Smartphone size={20} />
                    Pay via UPI App
                  </a>
                )}
                <p className="text-zinc-500 text-xs">Scan using GPay, PhonePe, or Paytm</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-white p-2 inline-block rounded mb-4">
                  <img src={settings.paymentQrUrl} alt="Payment QR Code" className="w-32 h-32 object-contain" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+QR')} />
                </div>
                <p className="text-zinc-500 text-xs">Scan this QR code to complete payment</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <button 
            form="checkout-form"
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold uppercase tracking-wider transition-colors"
          >
            Confirm Order
          </button>
          <p className="text-zinc-500 text-xs text-center mt-3 flex items-center justify-center gap-1">
            <Clock size={12} /> Your product will be delivered to your email within 24 hours after payment verification.
          </p>
        </div>
      </div>
    </div>
  );
}
