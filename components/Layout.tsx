
import React, { ReactNode } from 'react';
import Header from './Header';
import Notification from './Notification';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-premium-bg text-premium-ink font-sans selection:bg-premium-accent/10 selection:text-premium-accent">
      <Header />
      <Notification />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;