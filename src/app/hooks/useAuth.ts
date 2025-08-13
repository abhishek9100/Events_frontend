'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

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

  const updateAuthFromCookies = () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setAuth({ token, user: decoded });
      } catch (error) {
        console.error("Failed to decode token:", error);
        Cookies.remove('token');
        setAuth({ token: null, user: null });
      }
    } else {
      setAuth({ token: null, user: null });
    }
  };

  useEffect(() => {
    updateAuthFromCookies();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authUpdate') {
        updateAuthFromCookies();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    Cookies.remove('token');
    
    setAuth({ token: null, user: null });
    
    localStorage.setItem('authUpdate', Date.now().toString());
  };

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 7 }); 
    
    updateAuthFromCookies();
    
    localStorage.setItem('authUpdate', Date.now().toString());
  };

  return {
    ...auth,
    isAuthenticated: !!auth.token,
    isAdmin: auth.user?.role === 'ADMIN', 
    login,
    logout,
  };
}