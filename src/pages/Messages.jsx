import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Check, X, Clock, Send, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function Messages() {
  const navigate = useNavigate();
  const { user, messages, updateMessageStatus } = useAppContext();
  const [activeChat, setActiveChat] = useState(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-4">
        <div className="text-center">
          <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-bold mb-4">You need to login first</h2>
          <button onClick={() => navigate('/login')} className="bg-[#FF6B2B] px-6 py-2 rounded-full font-bold">Go to Login</button>
        </div>
      </div>
    );
  }

  // Find the selected message details
  const currentThread = messages.find(m => m.id === activeChat);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#121212] text-white flex flex-col"
    >
      {/* Navbar Minimal */}
      <nav className="w-full p-4 flex justify-between items-center border-b border-gray-800 bg-[#1A1A1A]">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 bg-[#121212] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="text-xl font-bold">Messages Hub</div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Inbox List */}
        <div className={`w-full md:w-1/3 border-r border-gray-800 bg-[#121212] overflow-y-auto ${activeChat ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-bold text-gray-400 uppercase text-xs tracking-wider">Your Requests ({messages.length})</h2>
          </div>
          
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No messages yet. Go to Dashboard and Ping someone!
            </div>
          ) : (
            messages.slice().reverse().map(msg => (
              <div 
                key={msg.id} 
                onClick={() => setActiveChat(msg.id)}
                className={`p-4 border-b border-gray-800/50 hover:bg-[#1E1E1E] cursor-pointer transition ${activeChat === msg.id ? 'bg-[#1E1E1E] border-l-2 border-l-[#FF6B2B]' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold">{msg.from}</div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
                <div className="text-sm text-gray-400 mb-2">Subject: {msg.subject}</div>
                
                {msg.status === 'pending' && <span className="inline-flex items-center text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded"><Clock size={12} className="mr-1"/> Pending Reply</span>}
                {msg.status === 'accepted' && <span className="inline-flex items-center text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded"><Check size={12} className="mr-1"/> Accepted</span>}
                {msg.status === 'declined' && <span className="inline-flex items-center text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded"><X size={12} className="mr-1"/> Declined</span>}
              </div>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 bg-[#1A1A1A] flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a message to view details
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center space-x-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 bg-[#121212] rounded-full">
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="font-bold text-lg">{currentThread?.from}</h3>
                  <p className="text-xs text-gray-400 capitalize">{currentThread?.role} • Looking for {currentThread?.subject} at {currentThread?.price}</p>
                </div>
              </div>
              
              {/* Chat History & Action Area */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="bg-[#121212] rounded-2xl p-4 border border-gray-800 max-w-sm mb-4">
                  <p className="text-sm">Hi, I found your profile on the map! I'm looking to connect regarding {currentThread?.subject}. My budget/fee is {currentThread?.price}.</p>
                  
                  {currentThread?.freeSlot && currentThread.freeSlot.trim() !== '' && (
                    <div className="mt-3 p-2 bg-[#FF6B2B]/10 border border-[#FF6B2B]/30 rounded-lg">
                      <span className="text-xs text-[#FF6B2B] font-bold uppercase tracking-wider block mb-1">My Available Slot:</span>
                      <p className="text-sm text-gray-300 italic">"{currentThread.freeSlot}"</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2 text-right">System Generated Intro</p>
                </div>
                
                {/* Accept/Decline action if pending */}
                {currentThread?.status === 'pending' && (
                  <div className="mt-6 flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
                    <input 
                      type="text" 
                      id="acceptSlotInput"
                      placeholder="Mention your free slot here (Optional)" 
                      className="w-full bg-[#121212] py-3 px-4 rounded-xl border border-gray-800 outline-none text-sm text-white focus:border-[#FF6B2B] transition"
                    />
                    <div className="flex justify-center space-x-4 w-full">
                      <button 
                        onClick={() => updateMessageStatus(currentThread.id, 'declined')}
                        className="flex-1 py-3 hover:bg-[#121212] rounded-xl font-bold border border-gray-600 transition cursor-pointer"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => {
                          const val = document.getElementById('acceptSlotInput')?.value || '';
                          if (val) {
                            // Quick hack to attach the responder's slot to the message object using existing context without deep restructure
                            currentThread.responderSlot = val;
                          }
                          updateMessageStatus(currentThread.id, 'accepted')
                        }}
                        className="flex-1 py-3 rounded-xl font-bold bg-[#FF6B2B] hover:bg-[#e85a1f] transition cursor-pointer"
                      >
                        Accept Request
                      </button>
                    </div>
                  </div>
                )}
                
                {currentThread?.status === 'declined' && (
                  <div className="mt-6 text-center text-red-500 text-sm p-3 bg-red-500/10 rounded-xl">
                    You have declined this request.
                  </div>
                )}

                {currentThread?.status === 'accepted' && currentThread?.responderSlot && (
                  <div className="bg-[#FF6B2B]/10 rounded-2xl p-4 border border-[#FF6B2B]/30 max-w-sm ml-auto mt-4">
                    <span className="text-xs text-[#FF6B2B] font-bold block mb-1">You replied with your slot:</span>
                    <p className="text-sm">"{currentThread.responderSlot}"</p>
                  </div>
                )}
              </div>

              {/* Chat Input Paywall */}
              {currentThread?.status === 'accepted' && (
                <div className="p-4 border-t border-gray-800 bg-[#121212] relative">
                  {!user.isSubscribed && (
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-[#1a1a1a]/80 flex items-center justify-center p-2">
                      <div className="text-center w-full">
                        <Lock size={20} className="text-[#FF6B2B] mx-auto mb-1" />
                        <p className="text-xs text-gray-300 font-semibold mb-2">Subscribe to reply securely</p>
                        <button onClick={() => navigate('/')} className="bg-[#FF6B2B] text-xs font-bold py-1.5 px-4 rounded-full cursor-pointer hover:scale-105 transition">
                          View Plans
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 bg-[#1A1A1A] py-3 px-4 rounded-xl border border-gray-800 outline-none text-sm text-white"
                      disabled={!user.isSubscribed}
                    />
                    <button className="p-3 text-white bg-[#FF6B2B] rounded-xl transition cursor-not-allowed">
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
