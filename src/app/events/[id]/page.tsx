'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth'; // Adjust path if needed

type Attendee = {
    user: { name: string; email: string; };
};

type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    authorId: number;
    author: { name: string; };
};

export default function EventDetailPage() {
    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    
    const [isRegistered, setIsRegistered] = useState(false);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const { isAuthenticated, isAdmin, user, token } = useAuth();
    
    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
            if (res.ok) setEvent(await res.json());
            else console.error("Failed to fetch event");
        };
        fetchEvent();
    }, [id]);
    
    useEffect(() => {
        if (!isAuthenticated || !event || !token) {
            setIsCheckingRegistration(false);
            return;
        }

        const checkRegistration = async () => {
            setIsCheckingRegistration(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/registered/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const registeredEvents: Event[] = await res.json();
                    const userIsRegistered = registeredEvents.some(regEvent => regEvent.id === event.id);
                    setIsRegistered(userIsRegistered);
                }
            } catch (error) {
                console.error("Failed to check registration status:", error);
            } finally {
                setIsCheckingRegistration(false);
            }
        };

        checkRegistration();
    }, [event, isAuthenticated, token]);

    useEffect(() => {
        if (isAdmin && event && user?.userId === event.authorId) {
            const fetchAttendees = async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}/registrations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setAttendees(await res.json());
            };
            fetchAttendees();
        }
    }, [isAdmin, event, user, id, token]);
    
    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleRegister = async () => {
        if (!isAuthenticated) {
            return router.push('/login');
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}/register`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        showToast(res.ok ? 'success' : 'error', data.message);
        
        if (res.ok) {
            setIsRegistered(true);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('success', 'Event deleted successfully.');
            setTimeout(() => router.push('/'), 1500);
        } else {
            const data = await res.json();
            showToast('error', data.message || 'Failed to delete event.');
        }
    };
    
    if (!event) return <p className="text-center mt-10">Loading event details...</p>;
    
    const isAuthor = user?.userId === event.authorId;

    return (
        <div className="py-12 px-4">
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-20 right-5 p-4 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <img src={`https://picsum.photos/seed/${event.id}/1200/400`} alt={event.title} className="w-full h-64 object-cover" />
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">{event.title}</h1>
                        
                        <p className="text-lg text-gray-600 mb-2 flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                           <span>{event.location}</span>
                        </p>

                        <p className="text-md text-gray-500 mb-6 flex items-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                           </svg>
                           <span>{new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                        </p>

                        <label>Description:</label>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{event.description}</p>
                        <p className="text-sm text-gray-500 mb-8">👤 Posted by: {event.author?.name}</p>

                        <div className="flex space-x-4 items-center">
                            {!isAuthenticated && (
                                <motion.button onClick={handleRegister} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg">
                                    Register for this Event
                                </motion.button>
                            )}
                            
                            {isAuthenticated && !isAdmin && (
                                isCheckingRegistration ? (
                                    <button disabled className="bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg cursor-wait">Checking...</button>
                                ) : isRegistered ? (
                                    <button disabled className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg">✓ Registered</button>
                                ) : (
                                    <motion.button onClick={handleRegister} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg">
                                        Register for this Event
                                    </motion.button>
                                )
                            )}

                            {isAdmin && isAuthor && (
                                <>
                                    <Link href={`/events/edit/${id}`} className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg">Edit</Link>
                                    <button onClick={handleDelete} className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg">Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {isAdmin && isAuthor && (
                    <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendees ({attendees.length})</h2>
                        {attendees.length > 0 ? (
                            <ul className="space-y-3">
                                {attendees.map((attendee, index) => (
                                    <li key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <span className="font-medium text-gray-800">{attendee.user.name}</span>
                                        <span className="text-sm text-gray-500">{attendee.user.email}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>No one has registered for this event yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}