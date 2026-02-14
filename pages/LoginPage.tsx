
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { Mail, Lock, Store, Tag, AlertCircle, Loader2, RefreshCcw } from 'lucide-react';
import { supabase, isSupabaseConfigured, clearMockStorage } from '../supabaseClient';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('RESELLER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await (supabase.auth as any).signUp({ 
          email, 
          password,
          options: { data: { role } }
        });
        
        if (signUpError) throw signUpError;
        
        if (!isSupabaseConfigured) {
          onLoginSuccess();
          navigate(role === 'SELLER' ? '/seller' : '/reseller');
          return;
        }

        if (data.user) {
          await supabase.from('profiles').upsert([{ 
            id: data.user.id, 
            email, 
            name: email.split('@')[0], 
            role 
          }]);
        }
        
        alert('Registration successful! Check your email for confirmation.');
        setLoading(false);
      } else {
        const { error: signInError } = await (supabase.auth as any).signInWithPassword({ 
          email, 
          password,
          role // Pass the selected role to the mock auth to sync immediately
        });
        if (signInError) throw signInError;
        
        onLoginSuccess();
        navigate(role === 'SELLER' ? '/seller' : '/reseller');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Clear all demo data and start fresh?')) {
      clearMockStorage();
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-neutral-950">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-neutral-400">Join the SellArmy network</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex space-x-2 mb-8 bg-neutral-950 p-1 rounded-2xl border border-white/5">
          <button 
            type="button"
            onClick={() => setRole('RESELLER')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${
              role === 'RESELLER' ? 'bg-emerald-900 text-white shadow-lg font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Tag size={18} className="mr-2" />
            Reseller
          </button>
          <button 
            type="button"
            onClick={() => setRole('SELLER')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${
              role === 'SELLER' ? 'bg-emerald-900 text-white shadow-lg font-bold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Store size={18} className="mr-2" />
            Seller
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>{isRegistering ? 'Register' : 'Sign In'}</span>}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
            <p className="text-[10px] text-center text-emerald-500/50 uppercase tracking-widest font-bold">
              Demo mode: Role is synced to your choice
            </p>
            <button 
              onClick={handleReset}
              className="w-full py-2 flex items-center justify-center space-x-2 text-neutral-600 hover:text-neutral-400 text-[10px] uppercase transition-colors"
            >
              <RefreshCcw size={10} />
              <span>Reset Stuck Demo Data</span>
            </button>
          </div>
        )}

        <p className="text-center mt-6 text-sm text-neutral-500">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"} {' '}
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-500 font-medium"
          >
            {isRegistering ? 'Sign In' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
