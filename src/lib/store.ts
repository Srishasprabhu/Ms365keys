import { useState, useEffect } from 'react';
import { Product, Order, Settings } from '../types';

const defaultProducts: Product[] = [
  { 
    id: '1', 
    name: 'Microsoft 365 Personal', 
    description: 'Lifetime subscription for personal use', 
    price: 2, 
    stock: 10, 
    category: 'Microsoft 365', 
    type: 'Account' 
  },
  { 
    id: '2', 
    name: 'Office 2024 Professional', 
    description: 'Lifetime key for 1 PC', 
    price: 5, 
    stock: 50, 
    category: 'Office', 
    type: 'Key' 
  },
];

const defaultSettings: Settings = {
  paymentQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePaymentLink',
};

export function useStore() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);

  return { products, setProducts, orders, setOrders, settings, setSettings };
}
