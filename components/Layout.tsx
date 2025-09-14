
import React, { ReactNode } from 'react';
import Header from './Header';
import Notification from './Notification';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-brand-dark">
      <Header />
      <Notification />
      <main className="container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        © 2024 CrediMarket. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;