import React, { useState } from 'react';
import { LogOut, Package, ShoppingBag, Settings as SettingsIcon, Plus, Edit, Trash2, Upload, Send } from 'lucide-react';
import { Product, Order, Settings } from '../types';

interface AdminDashboardProps {
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  orders: Order[];
  updateOrder: (id: string, o: Partial<Order>) => Promise<void>;
  settings: Settings;
  updateSettings: (s: Settings) => Promise<void>;
  onLogout: () => void;
}

export function AdminDashboard({ products, addProduct, updateProduct, deleteProduct, orders, updateOrder, settings, updateSettings, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-[#060714] text-white font-sans flex flex-col selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-indigo-500/10 bg-[#0F1123] p-4 flex justify-between items-center shadow-lg shadow-purple-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(107,70,193,0.4)]">
            <SettingsIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Command Center</h1>
            <p className="text-xs text-indigo-200/60">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="text-sm text-indigo-200/60 hover:text-purple-400 flex items-center gap-1.5 transition-colors">
            View Store
          </button>
          <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-indigo-500/10 px-6 pt-6 gap-2 bg-[#0F1123]">
        <Tab buttonText="Products" icon={<Package size={16}/>} isActive={activeTab === 'products'} onClick={() => setActiveTab('products')} />
        <Tab buttonText="Orders" icon={<ShoppingBag size={16}/>} isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <Tab buttonText="Settings" icon={<SettingsIcon size={16}/>} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'products' && <ProductsTab products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} updateOrder={updateOrder} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} />}
      </div>
    </div>
  );
}

function Tab({ buttonText, icon, isActive, onClick }: { buttonText: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-t-xl border-t border-l border-r transition-all font-medium tracking-wide ${isActive ? 'bg-[#060714] border-indigo-500/20 text-purple-400 shadow-[0_-5px_15px_rgba(107,70,193,0.1)]' : 'border-transparent text-indigo-200/50 hover:text-indigo-200 hover:bg-indigo-500/5'}`}
    >
      {icon} {buttonText}
    </button>
  );
}

function ProductsTab({ products, addProduct, updateProduct, deleteProduct }: { products: Product[], addProduct: (p: Omit<Product, 'id'>) => Promise<void>, updateProduct: (id: string, p: Partial<Product>) => Promise<void>, deleteProduct: (id: string) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState<Partial<Product> | null>(null);

  const handleSave = async (product: Partial<Product>) => {
    if (product.id) {
      await updateProduct(product.id, product);
    } else {
      await addProduct(product as Omit<Product, 'id'>);
    }
    setIsEditing(null);
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  if (isEditing) {
    return <ProductForm product={isEditing} onSave={handleSave} onCancel={() => setIsEditing(null)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-wide">Product Management</h2>
        <button onClick={() => setIsEditing({ name: '', description: '', price: 0, stock: 0, category: '', type: 'Account' })} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(107,70,193,0.3)] transition-all">
          <Plus size={18} /> Add Product
        </button>
      </div>
      
      <div className="bg-[#0F1123] border border-indigo-500/20 rounded-2xl overflow-hidden overflow-x-auto shadow-xl shadow-purple-900/10">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-[#060714] text-purple-300 uppercase tracking-wider font-mono text-xs border-b border-indigo-500/20">
            <tr>
              <th className="p-5 font-semibold">Name</th>
              <th className="p-5 font-semibold">Category</th>
              <th className="p-5 font-semibold">Type</th>
              <th className="p-5 font-semibold">Price</th>
              <th className="p-5 font-semibold">Stock</th>
              <th className="p-5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-indigo-500/5 transition-colors">
                <td className="p-5 font-medium text-white">{p.name}</td>
                <td className="p-5 text-indigo-200/70">{p.category}</td>
                <td className="p-5">
                  <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wide">{p.type}</span>
                </td>
                <td className="p-5 text-indigo-200">₹{p.price}</td>
                <td className="p-5 text-indigo-200">{p.stock}</td>
                <td className="p-5 text-right space-x-3">
                  <button onClick={() => setIsEditing(p)} className="text-indigo-200/50 hover:text-purple-400 transition-colors"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-indigo-200/50 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-indigo-200/50">No products found.</td></tr>
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
    <div className="max-w-2xl bg-[#0F1123] border border-indigo-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-900/20">
      <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">{product.id ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-5">
        <div>
          <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Product Name</label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Description</label>
          <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white h-28 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" required />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Price (₹)</label>
            <input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" required min="0" />
          </div>
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Stock</label>
            <input type="number" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" required min="0" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Category</label>
            <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Type</label>
            <select value={formData.type || 'Account'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all">
              <option value="Account">Account</option>
              <option value="Key">Key</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-6">
          <button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-[0_0_15px_rgba(107,70,193,0.3)] transition-all">Save Product</button>
          <button type="button" onClick={onCancel} className="bg-[#060714] border border-indigo-500/20 hover:border-indigo-500/50 text-white px-6 py-3 rounded-xl font-medium transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function OrdersTab({ orders, updateOrder }: { orders: Order[], updateOrder: (id: string, o: Partial<Order>) => Promise<void> }) {
  const handleUpdateStatus = async (id: string, status: any) => {
    await updateOrder(id, { status });
  };

  const handleDeliver = async (order: Order) => {
    const key = prompt(`Enter the Key or Account Details to deliver to ${order.email}:`);
    if (key) {
      try {
        await fetch('/api/deliver-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            customerEmail: order.email,
            productName: order.product.name,
            key: key
          })
        });
        await updateOrder(order.id, { status: 'DELIVERED', deliveredKey: key });
        alert('Key delivered successfully!');
      } catch (error) {
        alert('Failed to deliver key. Check console.');
      }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white tracking-wide mb-8">Order Management</h2>
      <div className="bg-[#0F1123] border border-indigo-500/20 rounded-2xl overflow-hidden overflow-x-auto shadow-xl shadow-purple-900/10">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-[#060714] text-purple-300 uppercase tracking-wider font-mono text-xs border-b border-indigo-500/20">
            <tr>
              <th className="p-5 font-semibold">Order ID</th>
              <th className="p-5 font-semibold">Customer</th>
              <th className="p-5 font-semibold">Email</th>
              <th className="p-5 font-semibold">Product</th>
              <th className="p-5 font-semibold">Price</th>
              <th className="p-5 font-semibold">Status</th>
              <th className="p-5 font-semibold">Date</th>
              <th className="p-5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-indigo-500/5 transition-colors">
                <td className="p-5 font-mono text-xs text-indigo-200/50">{o.id ? o.id.substring(0, 8) : 'Unknown'}...</td>
                <td className="p-5 text-white">{o.customerName || 'Unknown'}</td>
                <td className="p-5 text-indigo-200/70">{o.email || 'Unknown'}</td>
                <td className="p-5 text-indigo-200">{o.product?.name || 'Unknown'}</td>
                <td className="p-5 text-indigo-200">₹{o.price || 0}</td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide border ${
                    o.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    o.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    o.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {o.status || 'PENDING'}
                  </span>
                </td>
                <td className="p-5 text-indigo-200/50">{o.date ? new Date(o.date).toLocaleDateString() : 'Unknown'}</td>
                <td className="p-5 text-right flex items-center justify-end gap-3">
                  {o.status === 'PENDING' && (
                    <button 
                      onClick={() => handleDeliver(o)}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors"
                    >
                      <Send size={14} /> Deliver Key
                    </button>
                  )}
                  <select 
                    value={o.status || 'PENDING'} 
                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                    className="bg-[#060714] border border-indigo-500/20 rounded-lg p-1.5 text-xs text-indigo-200 focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="p-10 text-center text-indigo-200/50">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({ settings, updateSettings }: { settings: Settings, updateSettings: (s: Settings) => Promise<void> }) {
  const [url, setUrl] = useState(settings.paymentQrUrl || '');
  const [upiId, setUpiId] = useState(settings.upiId || '');
  const [upiName, setUpiName] = useState(settings.upiName || '');

  const handleSave = async () => {
    await updateSettings({ ...settings, paymentQrUrl: url, upiId, upiName });
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
      <h2 className="text-3xl font-bold text-white tracking-wide mb-8">Payment Settings</h2>
      <div className="bg-[#0F1123] border border-indigo-500/20 rounded-3xl p-8 mb-8 shadow-xl shadow-purple-900/10">
        <h3 className="text-xl font-bold text-white mb-3">Dynamic UPI Settings</h3>
        <p className="text-sm text-indigo-200/60 mb-6">Enter your UPI details to generate dynamic QR codes and deep links for customers.</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">UPI ID (VPA)</label>
            <input 
              type="text" 
              value={upiId} 
              onChange={e => setUpiId(e.target.value)} 
              className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="e.g. yourname@upi"
            />
          </div>
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Payee Name</label>
            <input 
              type="text" 
              value={upiName} 
              onChange={e => setUpiName(e.target.value)} 
              className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="e.g. John Doe"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0F1123] border border-indigo-500/20 rounded-3xl p-8 mb-8 shadow-xl shadow-purple-900/10">
        <h3 className="text-xl font-bold text-white mb-3">Fallback Static QR Code</h3>
        <p className="text-sm text-indigo-200/60 mb-6">This QR will be shown if Dynamic UPI is not configured.</p>
        
        <div className="flex flex-col gap-5 mb-8">
          <div className="relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="bg-[#060714] border border-dashed border-indigo-500/30 rounded-2xl p-6 text-center hover:border-purple-500 transition-colors">
              <Upload size={28} className="mx-auto text-indigo-200/50 mb-3" />
              <span className="text-sm text-indigo-200/70">Click or drag to upload QR image</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-px bg-indigo-500/20 flex-1"></div>
            <span className="text-xs text-indigo-200/40 font-mono uppercase">OR</span>
            <div className="h-px bg-indigo-500/20 flex-1"></div>
          </div>

          <input 
            type="text" 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            placeholder="https://example.com/qr.png"
          />
        </div>
        
        <div className="mb-8">
          <p className="text-sm text-indigo-200/80 mb-3 font-medium">Preview</p>
          <div className="border border-indigo-500/20 rounded-2xl p-4 bg-[#060714] inline-block shadow-inner">
            <img src={url} alt="QR Preview" className="max-w-[200px] max-h-[200px] object-contain rounded-xl" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+URL')} />
          </div>
        </div>

        <button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(107,70,193,0.3)]">
          <Upload size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}
