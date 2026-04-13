import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Login from './pages/Login';
import MapDashboard from './pages/MapDashboard';
import Messages from './pages/Messages';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<MapDashboard />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
