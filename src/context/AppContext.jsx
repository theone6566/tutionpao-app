import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

// Railway Backend
const API_BASE = "https://tutionpao-backend-production.up.railway.app";

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tutionpao_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('tutionpao_role') || null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tutionpao_darkmode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // ─── Socket.io Connection ──────────────────────────────────
  useEffect(() => {
    if (user && user._id) {
      const newSocket = io(API_BASE);
      setSocket(newSocket);
      newSocket.emit('join', user._id);

      newSocket.on('new_request', (data) => {
        setMessages(prev => [data, ...prev]);
      });

      newSocket.on('receive_message', (data) => {
        fetchMessages();
      });

      newSocket.on('new_notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
      });

      return () => newSocket.close();
    }
  }, [user]);

  // ─── Fetch Messages ──────────────────────────────────────
  const fetchMessages = useCallback(async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/chat/threads/${role}/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error("Message Fetch Error:", err);
    }
  }, [user, role]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ─── Fetch Notifications ──────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${role}/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error("Notification Fetch Error:", err);
    }
  }, [user, role]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Fetch Saved Profiles ──────────────────────────────────
  const fetchSavedProfiles = useCallback(async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/saved/${role}/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setSavedProfiles(data);
    } catch (err) {
      console.error("Saved Profiles Error:", err);
    }
  }, [user, role]);

  useEffect(() => {
    fetchSavedProfiles();
  }, [fetchSavedProfiles]);

  // ─── Login (OTP Step 1) ──────────────────────────────────
  const sendOtp = async (phone, selectedRole) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, role: selectedRole })
    });
    return await res.json();
  };

  // ─── Verify OTP & Login (Step 2) ──────────────────────────
  const verifyOtp = async (phone, otp, name, selectedRole, photo) => {
    const res = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name, role: selectedRole, photo })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    setUser(data.user);
    setRole(selectedRole);
    localStorage.setItem('tutionpao_token', data.token);
    localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
    localStorage.setItem('tutionpao_role', selectedRole);
    return data.user;
  };

  // ─── Complete Profile (after subscription) ──────────────
  const completeProfile = async (profileData) => {
    const res = await fetch(`${API_BASE}/api/auth/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, role, ...profileData })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setUser(data.user);
    localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
    return data.user;
  };

  // ─── Update Profile ──────────────────────────────────────
  const updateProfile = async (updates) => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, role, ...updates })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setUser(data.user);
    localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
    return data.user;
  };

  // ─── Refresh User from server ─────────────────────────────
  const refreshUser = async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me/${role}/${user._id}`);
      const data = await res.json();
      if (data && data._id) {
        setUser(data);
        localStorage.setItem('tutionpao_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  // ─── Logout ───────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setRole(null);
    setMessages([]);
    setNotifications([]);
    setSavedProfiles([]);
    localStorage.removeItem('tutionpao_user');
    localStorage.removeItem('tutionpao_token');
    localStorage.removeItem('tutionpao_role');
  };

  // ─── Send Ping (connection request) ───────────────────────
  const sendPing = (receiverId, receiverRole, freeSlot) => {
    if (socket && user) {
      socket.emit('send_ping', {
        senderId: user._id,
        senderRole: role,
        receiverId,
        receiverRole,
        freeSlot
      });
    }
  };

  // ─── Send Message ─────────────────────────────────────────
  const sendMessage = (threadId, receiverId, text) => {
    if (socket && user) {
      socket.emit('send_message', {
        threadId,
        senderId: user._id,
        receiverId,
        text
      });
    }
  };

  // ─── Update Message Status ────────────────────────────────
  const updateMessageStatus = async (threadId, status, freeSlot) => {
    try {
      await fetch(`${API_BASE}/api/chat/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, status, freeSlot })
      });
      fetchMessages();
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  // ─── Save Profile (Add to List) ──────────────────────────
  const saveProfile = async (targetId) => {
    try {
      await fetch(`${API_BASE}/api/auth/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, role, targetId })
      });
      fetchSavedProfiles();
    } catch (err) {
      console.error("Save profile error:", err);
    }
  };

  // ─── Unsave Profile ───────────────────────────────────────
  const unsaveProfile = async (targetId) => {
    try {
      await fetch(`${API_BASE}/api/auth/unsave-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, role, targetId })
      });
      fetchSavedProfiles();
    } catch (err) {
      console.error("Unsave profile error:", err);
    }
  };

  // ─── Notify Nearby Search ─────────────────────────────────
  const emitNearbySearch = (lat, lng, subject) => {
    if (socket && user) {
      socket.emit('nearby_search', {
        searcherId: user._id,
        searcherRole: role,
        lat, lng, subject
      });
    }
  };

  // ─── Mark Notification Read ───────────────────────────────
  const markNotificationRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE}/api/notifications/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // ─── Update Location ──────────────────────────────────────
  const updateLocation = async (lat, lng) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE}/api/auth/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, role, lat, lng })
      });
    } catch (err) {
      console.error("Location update error:", err);
    }
  };

  // ─── Initiate Razorpay Payment ────────────────────────────
  const initiatePayment = async (amount, planName) => {
    if (!user) throw new Error("Please login first");

    try {
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, plan: planName })
      });
      const orderData = await orderRes.json();
      if (orderData.error) throw new Error(orderData.error);

      return new Promise((resolve, reject) => {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "TutionPao Premium",
          description: `${planName} Plan Subscription`,
          order_id: orderData.id,
          handler: async (response) => {
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user._id,
                role,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const updatedUser = { ...user, isSubscribed: true, subscriptionPlan: 'premium' };
              setUser(updatedUser);
              localStorage.setItem('tutionpao_user', JSON.stringify(updatedUser));
              resolve(true);
            } else {
              reject(new Error("Payment verification failed"));
            }
          },
          prefill: {
            name: user.name,
            contact: user.phone,
            method: 'upi'
          },
          theme: { color: "#FF6B2B" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (err) {
      console.error("Payment Error:", err);
      throw err;
    }
  };

  // ─── Toggle Dark Mode ─────────────────────────────────────
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('tutionpao_darkmode', JSON.stringify(newMode));
    if (user) updateProfile({ darkMode: newMode });
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      user, role, messages, notifications, savedProfiles, darkMode, socket,
      unreadNotifications, API_BASE,
      sendOtp, verifyOtp, completeProfile, updateProfile, refreshUser,
      logout, sendPing, sendMessage, updateMessageStatus,
      saveProfile, unsaveProfile, fetchSavedProfiles,
      emitNearbySearch, markNotificationRead,
      updateLocation, initiatePayment, toggleDarkMode, fetchMessages
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
