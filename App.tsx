
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import VipPage from './pages/VipPage';

function App() {
  return (
    <NotificationProvider>
      <DataProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/vip" element={<VipPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </DataProvider>
    </NotificationProvider>
  );
}

export default App;