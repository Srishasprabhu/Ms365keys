import { useState, useEffect } from 'react';
import { Product, Order, Settings } from '../types';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const defaultSettings: Settings = {
  paymentQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePaymentLink',
  upiId: '',
  upiName: '',
};

export function useStore(isAdmin: boolean = false) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (error) => console.error("Error fetching products:", error));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      }
    }, (error) => console.error("Error fetching settings:", error));

    let unsubOrders: () => void = () => {};

    if (isAdmin) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      }, (error) => console.error("Error fetching orders:", error));
    }

    return () => {
      unsubProducts();
      unsubSettings();
      unsubOrders();
    };
  }, [isAdmin]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), product);
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), product);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const addOrder = async (order: Omit<Order, 'id'>) => {
    await addDoc(collection(db, 'orders'), order);
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    await updateDoc(doc(db, 'orders', id), order);
  };

  const updateSettings = async (newSettings: Settings) => {
    await setDoc(doc(db, 'settings', 'global'), newSettings);
  };

  return { 
    products, addProduct, updateProduct, deleteProduct, 
    orders, addOrder, updateOrder, 
    settings, updateSettings 
  };
}
