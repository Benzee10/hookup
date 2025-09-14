
export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'user' | 'admin';
}

export interface Profile {
  id: string;
  created_at: string;
  name: string;
  location: string;
  age: number;
  categories: string[];
  description: string;
  premiumContact: string;
  gallery: string[];
  unlockCost: number;
}

export interface Unlock {
  userId: string;
  profileId: string;
  unlockedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'unlock' | 'admin_grant';
  description: string | null;
  timestamp: string;
}

export interface Payment {
  id: string;
  userId: string;
  proofUrl: string; // In a real app, this would be a URL to stored file
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}