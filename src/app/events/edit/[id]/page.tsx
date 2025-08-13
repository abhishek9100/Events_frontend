'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth'; // Adjust path

export default function EditEventPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { isAdmin, user } = useAuth();
    const token = Cookies.get('token');

    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
            if (!res.ok) {
                setError("Failed to load event data.");
                return;
            }
            const data = await res.json();
            if (user?.userId !== data.authorId) {
                router.push('/dashboard'); // or an unauthorized page
                return;
            }
            setTitle(data.title);
            setDescription(data.description);
            setLocation(data.location);
            const d = new Date(data.date);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            setDate(d.toISOString().slice(0, 16));
        };

        if (user) { 
             fetchEvent();
        }
    }, [id, user, router]);
    
    useEffect(() => {
        if(user && !isAdmin) router.push('/');
    }, [user, isAdmin, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, date, location }),
        });

        if (res.ok) {
            router.push(`/events/${id}`);
        } else {
            const data = await res.json();
            setError(data.message || 'Failed to update event');
        }
    };
    
    if (!isAdmin) return <p className="text-center mt-10">Access Denied.</p>

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Event</h1>
                {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Date</label>
                        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700">
                        Save Changes
                    </button>
                </form>
            </motion.div>
        </div>
    );
}