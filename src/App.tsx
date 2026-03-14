import React, { useState } from 'react';
import { Storefront } from './components/Storefront';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Chatbot } from './components/Chatbot';
import { useStore } from './lib/store';
import { Product } from './types';
import { auth } from './firebase';

export default function App() {
  const [view, setView] = useState<'store' | 'admin-login' | 'admin-dashboard'>('store');
  const { products, addProduct, updateProduct, deleteProduct, orders, addOrder, updateOrder, settings, updateSettings } = useStore();

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

  const handleLogout = async () => {
    await auth.signOut();
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
          onLogin={() => setView('admin-dashboard')} 
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
