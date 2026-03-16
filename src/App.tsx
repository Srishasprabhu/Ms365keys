import React, { useState } from 'react';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Chatbot } from './components/Chatbot';
import { OrderTracking } from './components/OrderTracking';
import { useStore } from './lib/store';
import { Product } from './types';

export default function App() {
  const [view, setView] = useState<'store' | 'admin-login' | 'admin-dashboard' | 'tracking'>('store');
  const [isAdmin, setIsAdmin] = useState(false);
  // We need to fetch orders even if not admin so users can track them.
  // In a real app, you'd have a specific endpoint to fetch orders by email instead of fetching all.
  const { products, addProduct, updateProduct, deleteProduct, orders, addOrder, updateOrder, settings, updateSettings } = useStore(true); // Temporarily set to true to allow tracking to read orders

  const handleOrderSubmit = async (product: Product, details: { name: string; email: string }) => {
    const newOrder = {
      customerName: details.name,
      email: details.email,
      product,
      price: product.price,
      status: 'PENDING' as const,
      date: new Date().toISOString()
    };
    await addOrder(newOrder);
    
    // Decrease stock
    await updateProduct(product.id, { stock: product.stock - 1 });
    
    // Send SMS Notification
    try {
      await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: details.name,
          productName: product.name,
          price: product.price
        })
      });
    } catch (error) {
      console.error('Failed to send SMS notification', error);
    }

    alert('Order placed successfully! Please check your email.');
  };

  const handleLogin = () => {
    setIsAdmin(true);
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setView('store');
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
            onTrackOrderClick={() => setView('tracking')}
          />
          <Chatbot />
        </>
      )}
      {view === 'tracking' && (
        <OrderTracking 
          orders={orders}
          onBack={() => setView('store')}
        />
      )}
      {view === 'admin-login' && (
        <AdminLogin 
          onLogin={handleLogin} 
          onBack={() => setView('store')} 
        />
      )}
      {view === 'admin-dashboard' && (
        <AdminDashboard 
          products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct}
          orders={orders} updateOrder={updateOrder}
          settings={settings} updateSettings={updateSettings}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
