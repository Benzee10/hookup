
export interface Profile {
  id: string;
  created_at: string;
  name: string;
  location: string;
  age: number;
  interests: string[];
  bio: string;
  lookingFor: string;
  whatsapp: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}
