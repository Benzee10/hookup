
import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import VipPage from './pages/VipPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/vip" element={<VipPage />} />
        <Route path="*" element={<Navigate to="/vip" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
