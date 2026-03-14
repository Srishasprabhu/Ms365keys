export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  type: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  product: Product;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  date: string;
}

export interface Settings {
  paymentQrUrl: string;
}
