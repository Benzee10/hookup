import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import * as api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: typeof api.login;
  signup: typeof api.signup;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (supabaseUser: any | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }
    try {
      const userProfile = await api.getUserProfile(supabaseUser.id);
      setUser(userProfile);
    } catch (error) {
      console.error("Failed to fetch user profile, logging out:", error);
      // This can happen if a user is deleted from the DB but their JWT is still valid.
      // We should log them out to clear the inconsistent state.
      await api.logout();
      setUser(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await api.getSession();
        await fetchUserProfile(session?.user ?? null);
      } catch (error) {
        console.error("Failed to check session on startup:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = api.onAuthStateChange(async (_event: string, session: any | null) => {
        await fetchUserProfile(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login: typeof api.login = async (email, pass) => {
    const result = await api.login(email, pass);
    // onAuthStateChange will handle setting the user state
    return result;
  };

  const signup: typeof api.signup = async (name, email, pass) => {
    const result = await api.signup(name, email, pass);
    // onAuthStateChange will handle setting the user state
    return result;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const session = await api.getSession();
    if(session?.user){
        await fetchUserProfile(session.user);
    }
  }

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
