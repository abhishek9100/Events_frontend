'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Define the shape of the decoded token
type DecodedToken = {
  userId: number;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
};

export function useAuth() {
  const [auth, setAuth] = useState<{ token: string | null; user: DecodedToken | null }>({
    token: null,
    user: null,
  });

  // Function to update auth state from the cookie
  const updateAuthFromCookies = () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setAuth({ token, user: decoded });
      } catch (error) {
        // If token is invalid, remove it and clear auth state
        console.error("Failed to decode token:", error);
        Cookies.remove('token');
        setAuth({ token: null, user: null });
      }
    } else {
      // If no token, ensure auth state is cleared
      setAuth({ token: null, user: null });
    }
  };

  // Effect to initialize auth state and listen for changes across tabs
  useEffect(() => {
    updateAuthFromCookies();

    // The 'storage' event is a good way to sync auth state across tabs
    const handleStorageChange = (event: StorageEvent) => {
      // We listen for a specific key to avoid unnecessary updates
      if (event.key === 'authUpdate') {
        updateAuthFromCookies();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Logout function to clear credentials
  const logout = () => {
    // 1. Remove the token from cookies
    Cookies.remove('token');
    
    // 2. Clear the auth state in the component.
    // Setting 'user' to 'null' effectively removes the user object and their role.
    setAuth({ token: null, user: null });
    
    // 3. Trigger a storage event to notify other open tabs to also log out.
    localStorage.setItem('authUpdate', Date.now().toString());
  };

  // Login function to set credentials
  const login = (token: string) => {
    // 1. Set the token in cookies
    Cookies.set('token', token, { expires: 7 }); // Example: cookie expires in 7 days
    
    // 2. Update the auth state immediately
    updateAuthFromCookies();
    
    // 3. Trigger a storage event to notify other tabs of the new login
    localStorage.setItem('authUpdate', Date.now().toString());
  };

  return {
    ...auth,
    isAuthenticated: !!auth.token,
    isAdmin: auth.user?.role === 'ADMIN', // Optional chaining correctly handles a null user
    login,
    logout,
  };
}