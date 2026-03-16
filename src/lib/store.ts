import { useState, useEffect } from 'react';
import { Product, Order, Settings } from '../types';
import { db } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (operationType !== OperationType.LIST && operationType !== OperationType.GET) {
    throw new Error(JSON.stringify(errInfo));
  }
}

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
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    let unsubOrders: () => void = () => {};

    if (isAdmin) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
    }

    return () => {
      unsubProducts();
      unsubSettings();
      unsubOrders();
    };
  }, [isAdmin]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      await addDoc(collection(db, 'orders'), order);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    try {
      await updateDoc(doc(db, 'orders', id), order);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
  };

  return { 
    products, addProduct, updateProduct, deleteProduct, 
    orders, addOrder, updateOrder, 
    settings, updateSettings 
  };
}
