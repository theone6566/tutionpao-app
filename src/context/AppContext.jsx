import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // { name, role: 'student' | 'tutor', isSubscribed: false }
  const [messages, setMessages] = useState([]); // [{ id, from, subject, status, price }]
  const [activePlan, setActivePlan] = useState(null);

  // Load from local storage on mount (mocking persistence)
  useEffect(() => {
    const saved = localStorage.getItem('tutionpao_user');
    if (saved) setUser(JSON.parse(saved));
    const savedMsg = localStorage.getItem('tutionpao_msgs');
    if (savedMsg) setMessages(JSON.parse(savedMsg));
  }, []);

  const login = (name, role, photoUrl) => {
    // If student and no photo, set default
    let finalPhoto = photoUrl;
    if (!finalPhoto && role === 'student') finalPhoto = '/default_runner.svg';
    else if (!finalPhoto) finalPhoto = ''; // Default for tutor if any

    const freshUser = { name, role, isSubscribed: false, photo: finalPhoto };
    setUser(freshUser);
    localStorage.setItem('tutionpao_user', JSON.stringify(freshUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutionpao_user');
  };

  const subscribe = (planName) => {
    const upgraded = { ...user, isSubscribed: true };
    setUser(upgraded);
    setActivePlan(planName);
    localStorage.setItem('tutionpao_user', JSON.stringify(upgraded));
  };

  const receivePing = (pingData) => {
    const updated = [...messages, { id: Date.now(), ...pingData, status: 'pending' }];
    setMessages(updated);
    localStorage.setItem('tutionpao_msgs', JSON.stringify(updated));
  };

  const updateMessageStatus = (id, newStatus) => {
    const updated = messages.map(m => m.id === id ? { ...m, status: newStatus } : m);
    setMessages(updated);
    localStorage.setItem('tutionpao_msgs', JSON.stringify(updated));
  }

  return (
    <AppContext.Provider value={{ user, login, logout, subscribe, messages, receivePing, updateMessageStatus, activePlan }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
