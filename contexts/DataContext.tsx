
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Profile, Unlock, CreditTransaction, Payment, User } from '../types';
import * as api from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface DataContextType {
  profiles: Profile[];
  userUnlocks: Unlock[];
  userTransactions: CreditTransaction[];
  loadingProfiles: boolean;
  unlockProfile: (profileId: string) => Promise<void>;
  hasUnlocked: (profileId: string) => boolean;
  addProfile: (profile: Omit<Profile, 'id' | 'created_at'>) => Promise<Profile>;
  updateProfile: (profile: Profile) => Promise<Profile>;
  deleteProfile: (profileId: string) => Promise<void>;
  allUsers: User[];
  fetchAllUsers: () => void;
  grantCredits: (userId: string, amount: number, description: string) => Promise<void>;
  addPaymentRequest: (userId: string, transactionId: string, proofFile: File) => Promise<Payment>;
  payments: Payment[];
  fetchPayments: () => void;
  approvePayment: (paymentId: string, credits: number) => Promise<void>;
  rejectPayment: (paymentId: string) => Promise<void>;
  fetchUserSpecificData: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userUnlocks, setUserUnlocks] = useState<Unlock[]>([]);
  const [userTransactions, setUserTransactions] = useState<CreditTransaction[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const loadInitialData = useCallback(async () => {
    setLoadingProfiles(true);
    try {
      const fetchedProfiles = await api.fetchProfiles();
      setProfiles(fetchedProfiles);
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    } finally {
      setLoadingProfiles(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  const fetchUserSpecificData = useCallback(async () => {
      if (!user) {
          setUserUnlocks([]);
          setUserTransactions([]);
          return;
      };
      const [unlocks, transactions] = await Promise.all([
          api.fetchUnlocksForUser(user.id),
          api.fetchTransactionsForUser(user.id),
      ]);
      setUserUnlocks(unlocks);
      setUserTransactions(transactions);
  }, [user]);

  useEffect(() => {
    fetchUserSpecificData();
  }, [user, fetchUserSpecificData]);

  const fetchAllUsers = useCallback(async () => {
    const users = await api.fetchAllUsers();
    setAllUsers(users);
  }, []);
  
  const fetchPayments = useCallback(async () => {
      const fetchedPayments = await api.fetchPayments();
      setPayments(fetchedPayments);
  }, []);

  const unlockProfile = async (profileId: string) => {
    await api.unlockProfile(profileId);
    await fetchUserSpecificData(); // Refresh unlocks for the user
  };
  
  const hasUnlocked = (profileId: string) => {
    return userUnlocks.some(unlock => unlock.profileId === profileId);
  };
  
  const addProfile = async (profileData: Omit<Profile, 'id' | 'created_at'>) => {
    const newProfile = await api.addProfile(profileData);
    setProfiles(prev => [...prev, newProfile]);
    return newProfile;
  };

  const updateProfile = async (profileData: Profile) => {
    const updatedProfile = await api.updateProfile(profileData);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    return updatedProfile;
  };
  
  const deleteProfile = async (profileId: string) => {
    await api.deleteProfile(profileId);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };
  
  const grantCredits = async (userId: string, amount: number, description: string) => {
      await api.grantCredits(userId, amount, description);
      await fetchAllUsers(); // Refresh user list to show new credit amount
  };

  const addPaymentRequest = async (userId: string, transactionId: string, proofFile: File) => {
      const newPayment = await api.addPaymentRequest(userId, transactionId, proofFile);
      setPayments(prev => [newPayment, ...prev]);
      return newPayment;
  }

  const approvePayment = async (paymentId: string, credits: number) => {
      await api.approvePayment(paymentId, credits);
      await fetchPayments(); // Refresh payment list
      await fetchAllUsers(); // Refresh user list
  };

  const rejectPayment = async (paymentId: string) => {
      await api.rejectPayment(paymentId);
      await fetchPayments(); // Refresh payment list
  };

  return (
    <DataContext.Provider value={{ 
        profiles, userUnlocks, userTransactions, loadingProfiles, unlockProfile, hasUnlocked, addProfile, updateProfile, deleteProfile, allUsers, fetchAllUsers, grantCredits, addPaymentRequest, payments, fetchPayments, approvePayment, rejectPayment, fetchUserSpecificData
    }}>
      {children}
    </DataContext.Provider>
  );
};
