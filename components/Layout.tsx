
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Notification from './Notification';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-brand-dark">
      <Header />
      <Notification />
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        © 2024 CrediMarket. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;