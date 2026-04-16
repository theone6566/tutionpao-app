import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Check, X, Clock, Send, Lock, User, Crown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function Messages() {
  const navigate = useNavigate();
  const { user, role, messages, updateMessageStatus, sendMessage, fetchMessages } = useAppContext();
  const [activeChat, setActiveChat] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChat]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-4">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-bold mb-4">You need to login first</h2>
          <button onClick={() => navigate('/login')} className="bg-[#FF6B2B] px-6 py-2 rounded-full font-bold cursor-pointer">Go to Login</button>
        </div>
      </div>
    );
  }

  const currentThread = messages.find(m => m._id === activeChat);
  const otherUser = currentThread
    ? (currentThread.senderId === user._id || currentThread.senderInfo?._id === user._id
      ? currentThread.receiverInfo
      : currentThread.senderInfo)
    : null;

  const getOtherId = () => {
    if (!currentThread) return null;
    return currentThread.senderId === user._id ? currentThread.receiverId : currentThread.senderId;
  };

  const handleSend = () => {
    if (!newMsg.trim() || !currentThread) return;
    const otherId = getOtherId();
    sendMessage(currentThread._id, otherId, newMsg.trim());
    setNewMsg('');
    // Optimistic update
    setTimeout(() => fetchMessages(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#121212] text-white flex flex-col"
    >
      {/* Navbar */}
      <nav className="w-full p-4 flex justify-between items-center border-b border-gray-800 bg-[#1A1A1A]">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-[#121212] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="text-xl font-bold">Requests & Messages</div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* Inbox List */}
        <div className={`w-full md:w-1/3 border-r border-gray-800 bg-[#121212] overflow-y-auto ${activeChat ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-bold text-gray-400 uppercase text-xs tracking-wider">Your Requests ({messages.length})</h2>
          </div>
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No messages yet. Go to Dashboard and search to connect!</div>
          ) : (
            messages.map(thread => {
              const oUsr = thread.senderId === user._id || thread.senderInfo?._id === user._id
                ? thread.receiverInfo
                : thread.senderInfo;

              return (
                <div
                  key={thread._id}
                  onClick={() => setActiveChat(thread._id)}
                  className={`p-4 border-b border-gray-800/50 hover:bg-[#1E1E1E] cursor-pointer transition ${activeChat === thread._id ? 'bg-[#1E1E1E] border-l-2 border-l-[#FF6B2B]' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex-shrink-0">
                      {oUsr?.photo ? <img src={oUsr.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={16} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-sm truncate">{oUsr?.name || 'User'}</div>
                        <div className="text-xs text-gray-500 flex-shrink-0 ml-2">{new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div className="flex items-center">
                        {thread.status === 'pending' && <span className="inline-flex items-center text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded"><Clock size={10} className="mr-1" /> Pending</span>}
                        {thread.status === 'accepted' && <span className="inline-flex items-center text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded"><Check size={10} className="mr-1" /> Accepted</span>}
                        {thread.status === 'declined' && <span className="inline-flex items-center text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded"><X size={10} className="mr-1" /> Declined</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 bg-[#1A1A1A] flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare size={48} className="mb-4 text-gray-700" />
              <p>Select a conversation to view</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center space-x-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 bg-[#121212] rounded-full cursor-pointer">
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-gray-700">
                    {otherUser?.photo ? <img src={otherUser.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={16} /></div>}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{otherUser?.name || 'User'}</h3>
                    <p className="text-xs text-gray-400 capitalize">Connection Request</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Intro message */}
                <div className="bg-[#121212] rounded-2xl p-4 border border-gray-800 max-w-sm mb-4">
                  <p className="text-sm">Connection request sent!</p>
                  {currentThread?.freeSlot && (
                    <div className="mt-3 p-2 bg-[#FF6B2B]/10 border border-[#FF6B2B]/30 rounded-lg">
                      <span className="text-xs text-[#FF6B2B] font-bold uppercase tracking-wider block mb-1">Note:</span>
                      <p className="text-sm text-gray-300 italic">"{currentThread.freeSlot}"</p>
                    </div>
                  )}
                </div>

                {/* Status */}
                {currentThread?.status === 'accepted' && (
                  <div className="bg-green-500/10 text-green-500 p-3 rounded-xl text-center text-sm border border-green-500/20 mb-4">
                    ✅ Connection Accepted! You can now chat.
                  </div>
                )}
                {currentThread?.status === 'declined' && (
                  <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-center text-sm border border-red-500/20 mb-4">
                    ❌ Connection Declined
                  </div>
                )}

                {/* Real Messages */}
                {currentThread?.messages?.slice(1).map((msg, idx) => (
                  <div key={idx} className={`max-w-sm mb-3 p-3 rounded-xl ${msg.sender === user._id ? 'bg-[#FF6B2B] ml-auto text-white' : 'bg-gray-800 text-gray-200'}`}>
                    <p className="text-sm">{msg.text}</p>
                    {msg.createdAt && <p className="text-xs opacity-50 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                  </div>
                ))}

                {/* Accept/Decline for receiver */}
                {currentThread?.status === 'pending' && currentThread?.receiverId === user._id && (
                  <div className="mt-6 flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
                    <input
                      type="text"
                      id="acceptSlotInput"
                      placeholder="Reply message... (Optional)"
                      className="w-full bg-[#121212] py-3 px-4 rounded-xl border border-gray-800 outline-none text-sm text-white focus:border-[#FF6B2B] transition"
                    />
                    <div className="flex justify-center space-x-4 w-full">
                      <button onClick={() => updateMessageStatus(currentThread._id, 'declined')} className="flex-1 py-3 hover:bg-[#121212] rounded-xl font-bold border border-gray-600 transition cursor-pointer">Decline</button>
                      <button onClick={() => updateMessageStatus(currentThread._id, 'accepted', document.getElementById('acceptSlotInput')?.value)} className="flex-1 py-3 rounded-xl font-bold bg-[#FF6B2B] hover:bg-[#e85a1f] transition cursor-pointer">Accept</button>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              {currentThread?.status === 'accepted' && (
                <div className="p-4 border-t border-gray-800 bg-[#121212] relative">
                  {!user.isSubscribed && (
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-[#1a1a1a]/80 flex items-center justify-center p-2">
                      <div className="text-center w-full">
                        <Lock size={20} className="text-[#FF6B2B] mx-auto mb-1" />
                        <p className="text-xs text-gray-300 font-semibold mb-2">Subscribe to chat</p>
                        <button onClick={() => navigate('/pricing')} className="bg-[#FF6B2B] text-xs font-bold py-1.5 px-4 rounded-full cursor-pointer hover:scale-105 transition">
                          <Crown size={12} className="inline mr-1" /> View Plans
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-[#1A1A1A] py-3 px-4 rounded-xl border border-gray-800 outline-none text-sm text-white focus:border-[#FF6B2B] transition"
                      disabled={!user.isSubscribed}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!user.isSubscribed || !newMsg.trim()}
                      className="p-3 text-white bg-[#FF6B2B] rounded-xl transition cursor-pointer hover:bg-[#e85a1f] disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
