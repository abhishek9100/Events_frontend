'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 4000); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (res.ok) {
      Cookies.set('token', data.token, { expires: 1 / 24 }); // 1 hour
      showToast('success', 'Login successful! Redirecting...');
  
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
  
    } else {
      showToast('error', data.message || 'Failed to login');
    }
  };
  

  return (
    <div className=" flex items-center justify-center p-5 ">
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-5 right-5 shadow-lg rounded-lg overflow-hidden w-80 z-50 
              ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            <div className="p-4 font-medium">{toast.message}</div>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className={`h-1 ${toast.type === 'success' ? 'bg-green-700' : 'bg-red-700'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-8">Please sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
