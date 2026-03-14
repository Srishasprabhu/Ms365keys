import React, { useState } from 'react';
import { LogOut, Package, ShoppingBag, Settings as SettingsIcon, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Product, Order, Settings } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: (p: Product[]) => void;
  orders: Order[];
  setOrders: (o: Order[]) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onLogout: () => void;
}

export function AdminDashboard({ products, setProducts, orders, setOrders, settings, setSettings, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-red-500">Command Center</h1>
          <p className="text-xs text-zinc-400">Admin Dashboard</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="text-sm text-zinc-400 hover:text-white flex items-center gap-1">
            View Store
          </button>
          <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 px-4 pt-4 gap-2">
        <Tab buttonText="Products" icon={<Package size={16}/>} isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <Tab buttonText="Orders" icon={<ShoppingBag size={16}/>} isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <Tab buttonText="Settings" icon={<SettingsIcon size={16}/>} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'products' && <ProductsTab products={products} setProducts={setProducts} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} setOrders={setOrders} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}

function Tab({ buttonText, icon, isActive, onClick }: { buttonText: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-t border-l border-r transition-colors ${isActive ? 'bg-zinc-900 border-zinc-800 text-yellow-500' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
    >
      {icon} {buttonText}
    </button>
  );
}

function ProductsTab({ products, setProducts }: { products: Product[], setProducts: (p: Product[]) => void }) {
  const [isEditing, setIsEditing] = useState<Partial<Product> | null>(null);

  const handleSave = (product: Partial<Product>) => {
    if (product.id) {
      setProducts(products.map(p => p.id === product.id ? product as Product : p));
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() } as Product]);
    }
    setIsEditing(null);
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (isEditing) {
    return <ProductForm product={isEditing} onSave={handleSave} onCancel={() => setIsEditing(null)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-500">Product Management</h2>
        <button onClick={() => setIsEditing({ name: '', description: '', price: 0, stock: 0, category: '', type: 'Account' })} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold">
          <Plus size={16} /> Add Product
        </button>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-zinc-950 text-cyan-400 uppercase tracking-wider font-mono text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-zinc-800/50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-zinc-400">{p.category}</td>
                <td className="p-4">
                  <span className="bg-red-900/30 text-red-500 px-2 py-1 rounded text-xs font-mono uppercase">{p.type}</span>
                </td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setIsEditing(p)} className="text-zinc-400 hover:text-yellow-500"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }: { product: Partial<Product>, onSave: (p: Partial<Product>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Product>>(product);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-red-500 mb-6">{product.id ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Product Name</label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white" required />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Description</label>
          <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white h-24" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Price (₹)</label>
            <input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white" required min="0" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Stock</label>
            <input type="number" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white" required min="0" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Category</label>
            <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white" required />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Type</label>
            <select value={formData.type || 'Account'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white">
              <option value="Account">Account</option>
              <option value="Key">Key</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold">Save Product</button>
          <button type="button" onClick={onCancel} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function OrdersTab({ orders, setOrders }: { orders: Order[], setOrders: (o: Order[]) => void }) {
  const updateStatus = (id: string, status: any) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Order Management</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-zinc-950 text-cyan-400 uppercase tracking-wider font-mono text-xs">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-zinc-800/50">
                <td className="p-4 font-mono text-xs text-zinc-500">{o.id.substring(0, 8)}...</td>
                <td className="p-4">{o.customerName}</td>
                <td className="p-4 text-zinc-400">{o.email}</td>
                <td className="p-4">{o.product.name}</td>
                <td className="p-4">₹{o.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-mono uppercase ${
                    o.status === 'COMPLETED' ? 'bg-green-900/30 text-green-500' : 
                    o.status === 'CANCELLED' ? 'bg-red-900/30 text-red-500' : 
                    'bg-yellow-900/30 text-yellow-500'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4 text-zinc-400">{new Date(o.date).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded p-1 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-zinc-500">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({ settings, setSettings }: { settings: Settings, setSettings: (s: Settings) => void }) {
  const [url, setUrl] = useState(settings.paymentQrUrl);

  const handleSave = () => {
    setSettings({ ...settings, paymentQrUrl: url });
    alert('Settings saved successfully!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Payment Settings</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <label className="block text-sm text-zinc-400 mb-2">Payment QR Code</label>
        <p className="text-xs text-zinc-500 mb-4">Upload a new QR code image or paste an image URL</p>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-zinc-950 border border-dashed border-zinc-700 rounded p-4 text-center hover:border-yellow-500 transition-colors">
              <Upload size={24} className="mx-auto text-zinc-500 mb-2" />
              <span className="text-sm text-zinc-400">Click or drag to upload QR image</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-px bg-zinc-800 flex-1"></div>
            <span className="text-xs text-zinc-500 font-mono uppercase">OR</span>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          <input 
            type="text" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:outline-none focus:border-yellow-500"
            placeholder="https://example.com/qr.png"
          />
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-2">Preview</p>
          <div className="border border-zinc-800 rounded p-4 bg-zinc-950 inline-block">
            <img src={url} alt="QR Preview" className="max-w-[200px] max-h-[200px] object-contain" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL')} />
          </div>
        </div>

        <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold flex items-center gap-2 transition-colors">
          <Upload size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
}
