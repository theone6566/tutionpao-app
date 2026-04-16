import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

const API_BASE = "https://tutionpao-backend-production.up.railway.app";

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tutionpao_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('tutionpao_role') || null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const [socket, setSocket] = useState(null);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tutionpao_darkmode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Dual role state
  const [hasOtherRole, setHasOtherRole] = useState(false);
  const [otherRole, setOtherRole] = useState(null);

  // ─── Socket.io ──────────────────────────────────────────
  useEffect(() => {
    if (user && user._id) {
      const newSocket = io(API_BASE);
      setSocket(newSocket);
      newSocket.emit('join', user._id);

      newSocket.on('new_request', (data) => setMessages(prev => [data, ...prev]));
      newSocket.on('receive_message', () => fetchMessages());
      newSocket.on('new_notification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setToast(notif);
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
    } catch (err) { console.error("Message Fetch Error:", err); }
  }, [user, role]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // ─── Fetch Notifications ──────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/notifications/${role}/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) { console.error("Notification Fetch Error:", err); }
  }, [user, role]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ─── Fetch Saved Profiles ──────────────────────────────────
  const fetchSavedProfiles = useCallback(async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/saved/${role}/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setSavedProfiles(data);
    } catch (err) { console.error("Saved Profiles Error:", err); }
  }, [user, role]);

  useEffect(() => { fetchSavedProfiles(); }, [fetchSavedProfiles]);

  // ─── Send OTP ──────────────────────────────────────────────
  const sendOtp = async (phone, selectedRole) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, role: selectedRole })
    });
    return await res.json();
  };

  // ─── Verify OTP ────────────────────────────────────────────
  const verifyOtp = async (phone, otp, name, selectedRole, photo, lat, lng) => {
    const res = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name, role: selectedRole, photo, lat, lng })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    setUser(data.user);
    setRole(selectedRole);
    setHasOtherRole(data.hasOtherRole || false);
    setOtherRole(data.otherRole || null);
    localStorage.setItem('tutionpao_token', data.token);
    localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
    localStorage.setItem('tutionpao_role', selectedRole);
    return data.user;
  };

  // ─── Switch Role (dual role) ───────────────────────────────
  const switchRole = async () => {
    if (!user || !otherRole) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/switch-role`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, targetRole: otherRole })
      });
      const data = await res.json();
      if (data.error) {
        if (data.needsRegister) return { needsRegister: true, targetRole: otherRole };
        throw new Error(data.error);
      }

      setUser(data.user);
      setRole(otherRole);
      setHasOtherRole(data.hasOtherRole || false);
      setOtherRole(data.otherRole || null);
      localStorage.setItem('tutionpao_token', data.token);
      localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
      localStorage.setItem('tutionpao_role', otherRole);
      return { success: true };
    } catch (err) { throw err; }
  };

  // ─── Register Other Role ──────────────────────────────────
  const registerOtherRole = async (newRole) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/register-other-role`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, newRole, name: user.name, photo: user.photo })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setUser(data.user);
      setRole(newRole);
      setHasOtherRole(true);
      setOtherRole(role); // old role becomes the other
      localStorage.setItem('tutionpao_token', data.token);
      localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
      localStorage.setItem('tutionpao_role', newRole);
      return data;
    } catch (err) { throw err; }
  };

  // ─── Complete Profile ──────────────────────────────────────
  const completeProfile = async (profileData) => {
    const res = await fetch(`${API_BASE}/api/auth/complete-profile`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, role, ...profileData })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setUser(data.user);
    localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
    return data.user;
  };

  // ─── Update Profile ────────────────────────────────────────
  const updateProfile = async (updates) => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, role, ...updates })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setUser(data.user);
    localStorage.setItem('tutionpao_user', JSON.stringify(data.user));
    return data.user;
  };

  // ─── Refresh User ──────────────────────────────────────────
  const refreshUser = async () => {
    if (!user || !role) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/me/${role}/${user._id}`);
      const data = await res.json();
      if (data && data._id) {
        setUser(data);
        setHasOtherRole(data.hasOtherRole || false);
        setOtherRole(data.otherRole || null);
        localStorage.setItem('tutionpao_user', JSON.stringify(data));
      }
    } catch (err) { console.error("Refresh user error:", err); }
  };

  // ─── Logout ────────────────────────────────────────────────
  const logout = () => {
    setUser(null); setRole(null); setMessages([]); setNotifications([]);
    setSavedProfiles([]); setHasOtherRole(false); setOtherRole(null);
    localStorage.removeItem('tutionpao_user');
    localStorage.removeItem('tutionpao_token');
    localStorage.removeItem('tutionpao_role');
  };

  // ─── Send Ping ─────────────────────────────────────────────
  const sendPing = (receiverId, receiverRole, freeSlot) => {
    if (socket && user) {
      socket.emit('send_ping', { senderId: user._id, senderRole: role, receiverId, receiverRole, freeSlot });
    }
  };

  // ─── Send Message ──────────────────────────────────────────
  const sendMessage = (threadId, receiverId, text) => {
    if (socket && user) {
      socket.emit('send_message', { threadId, senderId: user._id, receiverId, text });
    }
  };

  // ─── Update Message Status ─────────────────────────────────
  const updateMessageStatus = async (threadId, status, freeSlot) => {
    try {
      await fetch(`${API_BASE}/api/chat/status`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, status, freeSlot })
      });
      fetchMessages();
    } catch (err) { console.error("Status Update Error:", err); }
  };

  // ─── Save/Unsave Profile ──────────────────────────────────
  const saveProfile = async (targetId) => {
    try {
      await fetch(`${API_BASE}/api/auth/save-profile`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, role, targetId })
      });
      fetchSavedProfiles();
    } catch (err) { console.error("Save profile error:", err); }
  };

  const unsaveProfile = async (targetId) => {
    try {
      await fetch(`${API_BASE}/api/auth/unsave-profile`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, role, targetId })
      });
      fetchSavedProfiles();
    } catch (err) { console.error("Unsave profile error:", err); }
  };

  // ─── Log Search ────────────────────────────────────────────
  const logSearch = async (lookingFor, lat, lng, subject, range) => {
    try {
      await fetch(`${API_BASE}/api/auth/public/log-search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lookingFor, lat, lng, subject, range,
          searcherId: user?._id || null,
          searcherType: role || 'guest'
        })
      });
    } catch (err) { console.error("Log search error:", err); }
  };

  // ─── Nearby Search Notification ────────────────────────────
  const emitNearbySearch = (lat, lng, subject) => {
    if (socket && user) {
      socket.emit('nearby_search', { searcherId: user._id, searcherRole: role, lat, lng, subject });
    }
  };

  // ─── Mark Notification Read ────────────────────────────────
  const markNotificationRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE}/api/notifications/read`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n));
    } catch (err) { console.error("Mark read error:", err); }
  };

  // ─── Update Location ──────────────────────────────────────
  const updateLocation = async (lat, lng) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE}/api/auth/location`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, role, lat, lng })
      });
    } catch (err) { console.error("Location update error:", err); }
  };

  // ─── Payment ───────────────────────────────────────────────
  const initiatePayment = async (amount, planName, userOverride = null) => {
    const activeUser = userOverride || user;
    if (!activeUser) throw new Error("Please login first");

    try {
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, plan: planName, userId: activeUser._id })
      });
      const orderData = await orderRes.json();
      if (orderData.error) throw new Error(orderData.error);

      return new Promise((resolve, reject) => {
        const options = {
          key: orderData.key_id, amount: orderData.amount, currency: orderData.currency,
          name: "TutionPao Premium", description: `${planName} Plan`,
          order_id: orderData.id,
          handler: async (response) => {
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify-payment`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: activeUser._id, role,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const updatedUser = { ...activeUser, isSubscribed: true, subscriptionPlan: 'premium' };
              setUser(updatedUser);
              localStorage.setItem('tutionpao_user', JSON.stringify(updatedUser));
              resolve(true);
            } else { reject(new Error("Payment verification failed")); }
          },
          prefill: { name: activeUser.name, contact: activeUser.phone, method: 'upi' },
          theme: { color: "#FF6B2B" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (err) { throw err; }
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
      unreadNotifications, API_BASE, hasOtherRole, otherRole, toast, setToast,
      sendOtp, verifyOtp, completeProfile, updateProfile, refreshUser,
      logout, sendPing, sendMessage, updateMessageStatus,
      saveProfile, unsaveProfile, fetchSavedProfiles,
      emitNearbySearch, markNotificationRead, logSearch,
      updateLocation, initiatePayment, toggleDarkMode, fetchMessages,
      switchRole, registerOtherRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
