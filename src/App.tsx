import React, { useState } from 'react';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Chatbot } from './components/Chatbot';
import { useStore } from './lib/store';
import { Product } from './types';

export default function App() {
  const [view, setView] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  const [isAdmin, setIsAdmin] = useState(false);
  const { products, addProduct, updateProduct, deleteProduct, orders, addOrder, updateOrder, settings, updateSettings } = useStore(isAdmin);

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
          />
          <Chatbot />
        </>
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
