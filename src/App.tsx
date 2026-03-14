import React, { useState } from 'react';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Chatbot } from './components/Chatbot';
import { useStore } from './lib/store';
import { Product } from './types';

export default function App() {
  const [view, setView] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  const { products, setProducts, orders, setOrders, settings, setSettings } = useStore();

  const handleOrderSubmit = (product: Product, details: { name: string; email: string }) => {
    const newOrder = {
      id: crypto.randomUUID(),
      customerName: details.name,
      email: details.email,
      product,
      price: product.price,
      status: 'PENDING' as const,
      date: new Date().toISOString()
    };
    setOrders([...orders, newOrder]);
    
    // Decrease stock
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
    
    alert('Order placed successfully! Please check your email.');
  };

  return (
    <>
      {view === 'store' && (
        <>
          <Storefront 
            products={products} 
            settings={settings} 
            onOrderSubmit={handleOrderSubmit} 
            onAdminClick={() => setView('admin-login')} 
          />
          <Chatbot />
        </>
      )}
      {view === 'admin-login' && (
        <AdminLogin 
          onLogin={() => setView('admin-dashboard')} 
          onBack={() => setView('store')} 
        />
      )}
      {view === 'admin-dashboard' && (
        <AdminDashboard 
          products={products} setProducts={setProducts}
          orders={orders} setOrders={setOrders}
          settings={settings} setSettings={setSettings}
          onLogout={() => setView('store')}
        />
      )}
    </>
  );
}
