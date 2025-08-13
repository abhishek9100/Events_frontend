'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth'; // Adjust path if needed

// Define a consistent Event type
type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
};

// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ token }: { token: string }) => {
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/created/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setCreatedEvents(await res.json());
            setLoading(false);
        };
        fetchAdminData();
    }, [token]);

    const upcomingEventsCount = createdEvents.filter(e => new Date(e.date) > new Date()).length;

    if (loading) return <p className="text-center mt-8">Loading Admin Dashboard...</p>;

    return (
        <>
    {/* --- UPDATED SECTION --- */}
    <section className="w-full bg-gradient-to-r from-slate-50 to-blue-100 text-black py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold">Admin Dashboard</h1>
        <p className="mt-4 text-lg text-gray-700">Manage your events and view statistics.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-16">
            <div>
                <p className="text-4xl font-bold text-cyan-600">{createdEvents.length}</p>
                <p className="text-gray-600">Total Events Created</p>
            </div>
            <div>
                <p className="text-4xl font-bold text-green-600">{upcomingEventsCount}</p>
                <p className="text-gray-600">Upcoming Events</p>
            </div>
        </div>
    </section>

    <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">My Created Events</h2>
            <Link href="/events/create" className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700">
                Create New Event
            </Link>
        </div>
        {createdEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {createdEvents.map((event) => (
                    <Link href={`/events/${event.id}`} key={event.id} className="block group">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate group-hover:text-indigo-600">{event.title}</h3>
                                {/* Updated Date with SVG Icon */}
                                <p className="text-gray-600 text-sm mb-1 flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </p>
                                {/* Updated Location with SVG Icon */}
                                <p className="text-gray-600 text-sm flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>{event.location || 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : <p className="text-center py-10 bg-gray-50 rounded-lg">You have not created any events yet.</p>}
    </div>
</>
    );
};

// --- USER DASHBOARD COMPONENT ---
const UserDashboard = ({ token }: { token: string }) => {
    const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/registered/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setRegisteredEvents(await res.json());
            setLoading(false);
        };
        fetchUserData();
    }, [token]);
    
    if (loading) return <p className="text-center mt-8">Loading Your Dashboard...</p>;

    return (
         <>
            <section className="w-full bg-gradient-to-r from-blue-50 to-purple-50 py-20 md:py-28 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">My Dashboard</h1>
                <p className="mt-4 text-lg text-gray-600">View the events you're attending.</p>
                 <div className="mt-10"><p className="text-4xl font-bold text-green-600">{registeredEvents.length}</p><p>My Registrations</p></div>
            </section>
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Events I'm Attending</h2>
                {registeredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {registeredEvents.map((event) => (
                            <Link href={`/events/${event.id}`} key={event.id} className="block group">
                               <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                                    <img src={`https://picsum.photos/seed/${event.id}/600/400`} alt={event.title} className="w-full h-40 object-cover"/>
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate group-hover:text-indigo-600">{event.title}</h3>
                                        {/* Updated Date with SVG Icon */}
                                        <p className="text-gray-600 text-sm mb-1 flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </p>
                                        {/* Updated Location with SVG Icon */}
                                        <p className="text-gray-600 text-sm flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span>{event.location || 'N/A'}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : <p className="text-center py-10 bg-gray-50 rounded-lg">You have not registered for any events yet.</p>}
            </div>
        </>
    );
};

// --- MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
    const { isAdmin } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = Cookies.get('token');
        if (!t) {
            window.location.href = '/login';
        } else {
            setToken(t);
            setLoading(false);
        }
    }, []);

    if (loading || token === null) return <div className="text-center p-10">Loading...</div>;
    
    return (
        <main>
            {isAdmin ? <AdminDashboard token={token} /> : <UserDashboard token={token} />}
        </main>
    );
}