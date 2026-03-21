import React from 'react';
import { useNotification } from '../hooks/useNotification';

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: 'success' | 'error') => {
    if (type === 'success') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="fixed top-8 right-8 z-[100] space-y-4">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`relative max-w-sm w-full bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl pointer-events-auto flex border border-premium-ink/5 animate-fade-in`}
        >
          <div className="w-0 flex-1 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-premium-accent/10 rounded-full flex items-center justify-center text-premium-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 w-0 flex-1">
                <p className="text-xs font-bold text-premium-ink uppercase tracking-wider">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-premium-ink/5">
            <button
              onClick={() => removeNotification(notification.id)}
              className="w-full border border-transparent rounded-none rounded-r-3xl px-6 flex items-center justify-center text-[10px] font-bold text-premium-muted hover:text-premium-ink uppercase tracking-widest transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
