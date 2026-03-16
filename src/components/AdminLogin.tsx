import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

export function AdminLogin({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1976Prabhu#') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#060714] flex flex-col items-center justify-center p-4 font-sans selection:bg-purple-500/30">
      {error && (
        <div className="absolute top-4 w-full max-w-md bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
          <span className="font-bold">!</span> {error}
        </div>
      )}
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 text-purple-400 mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(107,70,193,0.2)]">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Admin Access</h1>
          <p className="text-indigo-200/60 mt-2">Command Center Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0F1123] border border-indigo-500/20 rounded-3xl p-8 space-y-5 shadow-2xl shadow-purple-900/20">
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-indigo-200/50"><User size={18} /></span>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 pl-12 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-indigo-200/80 mb-2 font-medium">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-indigo-200/50"><Lock size={18} /></span>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl p-3 pl-12 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold tracking-wide mt-8 transition-all shadow-[0_0_15px_rgba(107,70,193,0.3)]">
            Access Dashboard
          </button>
        </form>
        
        <div className="text-center mt-8">
          <button onClick={onBack} className="text-indigo-200/50 hover:text-purple-400 text-sm transition-colors">
            &larr; Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
