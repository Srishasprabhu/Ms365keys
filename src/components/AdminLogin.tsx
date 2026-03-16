import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export function AdminLogin({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === 'srishasprabhu@gmail.com') {
        onLogin();
      } else {
        setError('You do not have admin access.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
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

        <div className="bg-[#0F1123] border border-indigo-500/20 rounded-3xl p-8 space-y-5 shadow-2xl shadow-purple-900/20 text-center">
          <p className="text-indigo-200/80 mb-6">Sign in with your authorized Google account to access the dashboard.</p>
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(107,70,193,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
        
        <div className="text-center mt-8">
          <button onClick={onBack} className="text-indigo-200/50 hover:text-purple-400 text-sm transition-colors">
            &larr; Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
