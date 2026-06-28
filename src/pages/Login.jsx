import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Login = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error handled in context
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-4">
            <Lucide.Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
        </div>
        <div className="glass rounded-2xl p-8 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
