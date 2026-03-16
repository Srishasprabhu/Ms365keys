export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  type: string;
  flashSaleEnd?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  product: Product;
  price: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'DELIVERED';
  date: string;
  deliveredKey?: string;
}

export interface Settings {
  paymentQrUrl: string;
  upiId?: string;
  upiName?: string;
}
