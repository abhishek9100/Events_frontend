'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth'; // Adjust path if needed

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // --- NEW: Dynamically set logo text based on role ---
  const logoText = isAdmin ? 'Event Manager Admin' : 'Event Hub';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Auto refresh when coming to dashboard after login
  useEffect(() => {
    if (pathname === '/dashboard') {
      router.refresh();
    }
  }, [pathname, router]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            {/* --- UPDATED: Logo now uses the dynamic text --- */}
            <Link href="/" className="text-2xl font-bold text-black-600">
              {logoText}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600">Events</Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
            )}
            {/* Kept the original "Create Event" link for admins */}
            {isAdmin && (
              <Link href="/events/create" className="text-gray-600 hover:text-indigo-600">Create Event</Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-indigo-50"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4 6H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={closeMenu} className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">Events</Link>
            {isAuthenticated && (
              <Link href="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">Dashboard</Link>
            )}
            {isAdmin && (
              <Link href="/events/create" onClick={closeMenu} className="block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50">Create Event</Link>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-4">
                  <Link href="/login" onClick={closeMenu} className="w-full text-center px-4 py-2 text-sm font-medium text-indigo-600 border rounded-md">Login</Link>
                  <Link href="/register" onClick={closeMenu} className="w-full text-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}