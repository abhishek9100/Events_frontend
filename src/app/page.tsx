'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './hooks/useAuth'; // Adjust path to your useAuth hook

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  author: {
    name: string;
  };
};

// Define a User type that includes the role
type User = {
  // include other user properties like id, name, email
  role: string; 
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  // Assume useAuth returns the full user object, including their role
  const { isAuthenticated, token, user }: { isAuthenticated: boolean; token: string | null; user: User | null } = useAuth();

  // Fetch all public events when the component mounts (no changes here)
  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  // Fetch the user's registered events ONLY if they are logged in and NOT an admin
  useEffect(() => {
    // This check now prevents the API call for admins
    if (isAuthenticated && token && user?.role !== 'admin') {
      const getRegisteredEvents = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/registered/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const registeredEvents: Event[] = await res.json();
          setRegisteredEventIds(new Set(registeredEvents.map(event => event.id)));
        }
      };
      getRegisteredEvents();
    }
  }, [isAuthenticated, token, user]); // Add user to the dependency array

  if (loading) {
      return <div className="text-center p-10">Loading events...</div>
  }

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="text-center bg-white py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
          Explore What's Happening
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          From local meetups to global conferences, find your next great experience.
        </p>
      </section>

      {/* Events Grid Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Upcoming Events</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const isRegistered = registeredEventIds.has(event.id);

              return (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
                  {/* Image container with relative positioning for the badge */}
                  <div className="relative">
                    <Link href={`/events/${event.id}`} className="block">
                        <img
                            src={`https://picsum.photos/seed/${event.id}/600/400`}
                            alt={`Image for ${event.title}`}
                            className="w-full h-48 object-cover"
                        />
                    </Link>
                    {/* MODIFIED: Registration Status Badge now checks for role */}
                    {isAuthenticated && user?.role !== 'ADMIN' && (
                      isRegistered ? (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Registered
                        </div>
                      ) : (
                        <Link href={`/events/${event.id}`} className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                          Register Now
                        </Link>
                      )
                    )}
                  </div>
                  
                  {/* Card Content (no changes needed here) */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600">
                        <Link href={`/events/${event.id}`}>{event.title}</Link>
                      </h3>
                      {/* Date with Icon */}
                      <p className="text-indigo-500 font-semibold mb-2 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric',
                          })}
                        </span>
                      </p>
                      {/* Location with Icon */}
                      <p className="text-gray-700 mb-4 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>{event.location}</span>
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Created by: <span className="font-medium text-gray-600">{event.author.name}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No upcoming events at the moment.</p>
          </div>
        )}
      </div>
    </main>
  );
}