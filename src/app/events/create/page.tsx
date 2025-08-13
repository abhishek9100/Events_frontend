'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, date, location }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast('success', 'Event created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      showToast('error', data.message || 'Failed to create event');
    }
  };

  return (
    <div className=" flex items-center justify-center  p-5">
      {/* Toast Notification */}
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

      {/* Form Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Create New Event</h1>
        <p className="text-center text-gray-500 mb-8">Fill out the details below to create your event</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Describe your event"
              rows={4}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Event location"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Create Event
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
