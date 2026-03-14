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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      {error && (
        <div className="absolute top-4 w-full max-w-md bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-3 rounded text-sm flex items-center gap-2">
          <span className="font-bold">!</span> {error}
        </div>
      )}
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 text-red-500 mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-red-500">Admin Access</h1>
          <p className="text-zinc-400 mt-2">Command Center Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-zinc-500"><User size={18} /></span>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-red-900/50 rounded p-2 pl-10 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-zinc-500"><Lock size={18} /></span>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-red-900/50 rounded p-2 pl-10 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold uppercase tracking-wider mt-6">
            Access Dashboard
          </button>
        </form>
        
        <div className="text-center mt-6">
          <button onClick={onBack} className="text-zinc-500 hover:text-zinc-300 text-sm">
            &larr; Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
