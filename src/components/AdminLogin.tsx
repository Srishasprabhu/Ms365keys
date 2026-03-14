import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export function AdminLogin({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === 'srishasprabhu@gmail.com') {
        onLogin();
      } else {
        await auth.signOut();
        setError('Unauthorized: You are not an admin.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
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

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 text-center">
          <p className="text-zinc-400 mb-4">Please sign in with your administrator Google account.</p>
          <button onClick={handleGoogleLogin} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold uppercase tracking-wider mt-6">
            Sign in with Google
          </button>
        </div>
        
        <div className="text-center mt-6">
          <button onClick={onBack} className="text-zinc-500 hover:text-zinc-300 text-sm">
            &larr; Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
