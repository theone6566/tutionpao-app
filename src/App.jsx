import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Login from './pages/Login';
import MapDashboard from './pages/MapDashboard';
import Messages from './pages/Messages';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import SubscriptionDetails from './pages/SubscriptionDetails';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<MapDashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscription-details" element={<SubscriptionDetails />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
