import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AppContext = createContext();

// Railway Backend Public URL
const API_BASE = "http://tutionpao-backend-production.up.railway.app"; 

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

  const initiatePayment = async (amount, planName) => {
    if (!user) throw new Error("Please login first");

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, plan: planName })
      });
      const orderData = await orderRes.json();

      if (orderData.error) throw new Error(orderData.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TutionPao Premium",
        description: `Subscription for ${planName} plan`,
        order_id: orderData.id,
        handler: async (response) => {
          // 3. Verify Payment
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment Successful! You are now a Premium Tutor.");
            // Update local user state
            const updatedUser = { ...user, isSubscribed: true };
            setUser(updatedUser);
            localStorage.setItem('tutionpao_user', JSON.stringify(updatedUser));
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          contact: user.phone
        },
        theme: { color: "#FF6B2B" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.message || "Failed to initiate payment");
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, messages, sendPing, updateMessageStatus, API_BASE, initiatePayment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
