import React, { useState } from 'react';
import { Zap, ShieldCheck, Mail, User, ShoppingCart } from 'lucide-react';
import { Product, Settings } from '../types';
import { CheckoutModal } from './CheckoutModal';

interface StorefrontProps {
  products: Product[];
  settings: Settings;
  onOrderSubmit: (product: Product, details: { name: string; email: string }) => void;
  onAdminClick: () => void;
}

export function Storefront({ products, settings, onOrderSubmit, onAdminClick }: StorefrontProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 flex flex-col items-center justify-center text-center px-4">
        {/* Abstract background effect */}
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-zinc-950 to-zinc-950"></div>
        
        <div className="z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase">Original Access</h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8">Premium Microsoft Office Keys & Accounts</p>
          <button 
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded font-bold tracking-wider uppercase transition-colors"
          >
            Browse Products &rarr;
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 border-l-4 border-l-red-600">
          <Zap className="text-red-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2 text-yellow-500">Instant Delivery</h3>
          <p className="text-zinc-400">Get your keys within 24 hours</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 border-l-4 border-l-red-600">
          <ShieldCheck className="text-red-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2 text-yellow-500">Authentic Keys</h3>
          <p className="text-zinc-400">100% genuine Microsoft products</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 border-l-4 border-l-red-600">
          <Mail className="text-red-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2 text-yellow-500">Email Support</h3>
          <p className="text-zinc-400">Order confirmation via email</p>
        </div>
      </div>

      {/* Products */}
      <div id="products" className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-8">Our Products</h2>
        <div className="space-y-8">
          {products.map(product => (
            <div key={product.id} className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="text-red-500" size={24} />
                    <span className="text-cyan-400 font-mono text-sm uppercase tracking-wider">{product.type}</span>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500">{product.name}</h3>
                  <p className="text-zinc-400 text-sm">{product.description}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="text-3xl font-bold text-red-500">₹{product.price}</div>
                <div className="text-cyan-400 text-sm font-mono">{product.stock} in stock</div>
              </div>
              <button 
                onClick={() => setSelectedProduct(product)}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'ORDER NOW' : 'OUT OF STOCK'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-zinc-600 border-t border-zinc-900 mt-12">
        <p>&copy; 2026 OriginalAccess. All rights reserved.</p>
        <button onClick={onAdminClick} className="text-xs mt-2 hover:text-zinc-400">Admin Login</button>
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
