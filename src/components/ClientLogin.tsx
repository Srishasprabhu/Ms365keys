import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface ClientLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function ClientLogin({ onLogin, onBack }: ClientLoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060714] flex items-center justify-center p-4">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Store
      </button>

      <div className="bg-[#0a0b1a] p-8 rounded-2xl border border-indigo-500/20 w-full max-w-md shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            {isLogin ? <LogIn className="w-8 h-8 text-indigo-400" /> : <UserPlus className="w-8 h-8 text-indigo-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Client Login' : 'Create Account'}
          </h2>
          <p className="text-indigo-200/60">
            {isLogin ? 'Welcome back! Sign in to view your orders.' : 'Sign up to track your purchases.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#060714] border border-indigo-500/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-indigo-200/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
