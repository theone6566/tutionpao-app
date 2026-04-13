import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

// Railway Backend Public URL (Update this if it changes!)
const API_BASE = "https://tutionpao-backend-production.up.railway.app"; 

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tutionpao_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io connection when user logs in
  useEffect(() => {
    if (user && user._id) {
      const newSocket = io(API_BASE);
      setSocket(newSocket);
      newSocket.emit('join', user._id);

      newSocket.on('new_request', (data) => {
        setMessages(prev => [data, ...prev]);
      });

      newSocket.on('receive_message', (data) => {
        fetchMessages(user._id);
      });

      return () => newSocket.close();
    }
  }, [user]);

  const fetchMessages = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/chat/threads/${userId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Message Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (user && user._id) fetchMessages(user._id);
  }, [user]);

  const login = async (phone, otp, name, role, photo, qualifications, school) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name, role, photo, qualifications, school })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setUser(data.user);
      localStorage.setItem('tutionpao_token', data.token);
      localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutionpao_user');
    localStorage.removeItem('tutionpao_token');
  };

  const sendPing = (receiverId, freeSlot) => {
    if (socket && user) {
      socket.emit('send_ping', {
        senderId: user._id,
        receiverId,
        freeSlot
      });
    }
  };

  const updateMessageStatus = async (threadId, status, freeSlot) => {
    try {
      await fetch(`${API_BASE}/api/chat/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, status, freeSlot })
      });
      if (user) fetchMessages(user._id);
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, messages, sendPing, updateMessageStatus, API_BASE 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
