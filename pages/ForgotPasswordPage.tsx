import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { useNotification } from '../hooks/useNotification';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.sendPasswordResetEmail(email);
      showNotification('If an account exists for this email, a password reset link has been sent.', 'success');
    } catch (err) {
      // Show the same message for success and failure to prevent email enumeration
      showNotification('If an account exists for this email, a password reset link has been sent.', 'success');
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setEmail('');
    }
  };

  return (
    <div className="flex justify-center items-center py-12 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">Reset Your Password</h2>
        <p className="text-center text-slate-600">Enter your email address and we will send you a link to reset your password.</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 font-bold text-white bg-brand-primary rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Remember your password? <Link to="/login" className="font-medium text-brand-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
