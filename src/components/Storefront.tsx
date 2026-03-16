import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Mail, User, ShoppingCart, Phone, Timer, Activity } from 'lucide-react';
import { Product, Settings } from '../types';
import { CheckoutModal } from './CheckoutModal';

interface StorefrontProps {
  products: Product[];
  settings: Settings;
  onOrderSubmit: (product: Product, details: { name: string; email: string }) => void;
  onAdminClick: () => void;
  onTrackOrderClick: () => void;
  onClientLoginClick: () => void;
}

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft('Ended');
        clearInterval(interval);
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
      <Timer size={14} />
      <span>{timeLeft}</span>
    </div>
  );
};

export function Storefront({ products, settings, onOrderSubmit, onAdminClick, onTrackOrderClick, onClientLoginClick }: StorefrontProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Other')))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || 'Other') === selectedCategory);

  return (
    <div className="min-h-screen bg-[#060714] text-white font-sans selection:bg-purple-500/30">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 flex flex-col items-center justify-center text-center px-4">
        {/* Abstract background effect */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#060714] to-[#060714]"></div>
        
        <div className="z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Original Access</h1>
          <p className="text-xl md:text-2xl text-indigo-200/80 mb-10">Premium Microsoft Office Keys & Accounts</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-4 rounded-full font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(107,70,193,0.4)]"
            >
              Browse Products &rarr;
            </button>
            <button 
              onClick={onTrackOrderClick}
              className="bg-[#0F1123] border border-indigo-500/30 hover:border-purple-500/50 text-white px-10 py-4 rounded-full font-semibold tracking-wide transition-all"
            >
              Track Order
            </button>
            <button 
              onClick={onClientLoginClick}
              className="bg-[#0F1123] border border-indigo-500/30 hover:border-purple-500/50 text-white px-10 py-4 rounded-full font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <User size={18} />
              Client Login
            </button>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="w-full bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-indigo-900/20 border-y border-indigo-500/10 py-3 overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] items-center gap-8 text-sm text-indigo-200/80">
          <span className="flex items-center gap-2"><Activity size={16} className="text-purple-400" /> ⚡ John D. just bought Netflix Premium</span>
          <span className="flex items-center gap-2"><Activity size={16} className="text-purple-400" /> ⚡ Sarah M. just bought Office 365</span>
          <span className="flex items-center gap-2"><Activity size={16} className="text-purple-400" /> ⚡ Alex K. just bought Spotify Premium</span>
          <span className="flex items-center gap-2"><Activity size={16} className="text-purple-400" /> ⚡ Mike R. just bought Windows 11 Pro</span>
          <span className="flex items-center gap-2"><Activity size={16} className="text-purple-400" /> ⚡ John D. just bought Netflix Premium</span>
          <span className="flex items-center gap-2"><Activity size={16} className="text-purple-400" /> ⚡ Sarah M. just bought Office 365</span>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0F1123] p-8 rounded-3xl border border-indigo-500/10 hover:border-purple-500/30 transition-colors group">
          <Zap className="text-purple-400 mb-5 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold mb-2 text-white">Instant Delivery</h3>
          <p className="text-indigo-200/60">Get your keys within 24 hours</p>
        </div>
        <div className="bg-[#0F1123] p-8 rounded-3xl border border-indigo-500/10 hover:border-purple-500/30 transition-colors group">
          <ShieldCheck className="text-purple-400 mb-5 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold mb-2 text-white">Authentic Keys</h3>
          <p className="text-indigo-200/60">100% genuine Microsoft products</p>
        </div>
        <div className="bg-[#0F1123] p-8 rounded-3xl border border-indigo-500/10 hover:border-purple-500/30 transition-colors group">
          <Mail className="text-purple-400 mb-5 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold mb-2 text-white">Email Support</h3>
          <p className="text-indigo-200/60">Order confirmation via email</p>
        </div>
      </div>

      {/* Products */}
      <div id="products" className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">Explore Products</h2>
        
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                selectedCategory === cat 
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(107,70,193,0.4)]' 
                  : 'bg-[#0F1123] border border-indigo-500/20 text-indigo-200/70 hover:border-purple-500/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-[#0F1123] rounded-3xl border border-indigo-500/10 p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(107,70,193,0.15)]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-purple-300 font-medium text-xs tracking-wide bg-purple-500/20 px-3 py-1 rounded-full">{product.type}</span>
                    {product.flashSaleEnd && <CountdownTimer targetDate={product.flashSaleEnd} />}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                  <p className="text-indigo-200/60 text-sm mt-2 line-clamp-2">{product.description}</p>
                </div>
              </div>
              <div className="flex justify-between items-end mt-8">
                <div>
                  <div className="text-sm text-indigo-200/50 mb-1">Current Price</div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">₹{product.price}</div>
                </div>
                <div className="text-indigo-300 text-xs font-medium bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                  {product.stock} in stock
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(product)}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(107,70,193,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={18} />
                {product.stock > 0 ? 'Place Order' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-10 text-indigo-200/50 border-t border-indigo-500/10 mt-12 bg-[#060714]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 text-sm text-indigo-200/70">
          <div className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer">
            <Mail size={18} className="text-purple-500" />
            <a href="mailto:srishasprabhu@gmail.com">srishasprabhu@gmail.com</a>
          </div>
          <div className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer">
            <Phone size={18} className="text-purple-500" />
            <a href="tel:+917337872234">+91 73378 72234</a>
          </div>
        </div>
        <p>&copy; 2026 OriginalAccess. All rights reserved.</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button onClick={onTrackOrderClick} className="text-xs hover:text-purple-400 transition-colors">Track Order</button>
          <span className="text-indigo-500/30">|</span>
          <button onClick={onAdminClick} className="text-xs hover:text-purple-400 transition-colors">Admin Login</button>
        </div>
      </footer>

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onSubmit={(details) => {
            onOrderSubmit(selectedProduct, details);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
