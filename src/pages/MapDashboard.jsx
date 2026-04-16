import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, MessageSquare, Menu, X, Bell, User, BookmarkPlus, Settings, LogOut, Crown, Heart, List, RefreshCw, SlidersHorizontal, Send, Minus, Plus, Loader, Lock, Star, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';


export default function MapDashboard() {
  const { user, role, logout, unreadNotifications, notifications, markNotificationRead, saveProfile, unsaveProfile, savedProfiles, sendPing, updateLocation, API_BASE, hasOtherRole, otherRole, switchRole, registerOtherRole, toast, setToast } = useAppContext();
  const navigate = useNavigate();

  const [lookingFor, setLookingFor] = useState(role === 'teacher' ? 'student' : 'teacher');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Search Results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [range, setRange] = useState(10);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [subjectQuery, setSubjectQuery] = useState('');

  // Selected Profile for modal
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Auto-clear Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  // Get user's location
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        updateLocation(loc.lat, loc.lng);
      });
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/auth/public/browse?role=${lookingFor}&limit=50`;

      if (userLocation) {
        url += `&lat=${userLocation.lat}&lng=${userLocation.lng}&maxDistance=${range * 1000}`;
      }

      if (subjectQuery.trim() !== '') {
        url += `&subject=${encodeURIComponent(subjectQuery.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      let users = data.users || [];

      // Client-side mapping
      users = users.filter(u => {
        const price = lookingFor === 'teacher' ? (u.chargePerMonth || 0) : (u.budgetPerMonth || 0);
        if (maxPrice < 10000 && price > maxPrice) return false;
        return true;
      });

      setResults(users);
      setTotal(users.length);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [lookingFor, userLocation, range, maxPrice, subjectQuery]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const isSaved = (id) => savedProfiles?.some(p => p._id === id);
  const handleSaveToggle = (targetId) => {
    if (isSaved(targetId)) unsaveProfile(targetId);
    else saveProfile(targetId);
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen bg-[#121212] text-white overflow-y-auto w-full overflow-x-hidden relative">
      
      {/* ─── REALTIME TOAST ALERTS ───────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start max-w-sm w-[90%] md:w-full cursor-pointer ${toast.type === 'nearby_search' ? 'bg-[#FF6B2B]/90 border-[#FF6B2B] text-white shadow-[0_10px_40px_rgba(255,107,43,0.3)]' : 'bg-[#1E1E1E]/95 border-gray-700 text-white'}`}
            onClick={() => { setToast(null); setNotifOpen(true); }}
          >
            <div className="bg-white/20 p-2 rounded-full mr-3 mt-0.5">
              <Bell size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{toast.title || 'New Alert'}</h4>
              <p className="text-xs opacity-90 whitespace-pre-line leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setToast(null); }} className="opacity-70 hover:opacity-100 p-1 bg-black/10 rounded-full">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ──────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[500]" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#1A1A1A] border-r border-gray-800 z-[501] flex flex-col">
              <div className="p-6 border-b border-gray-800 bg-[#FF6B2B]/5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-[#FF6B2B] flex items-center justify-center">
                    {user?.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" /> : <User size={24} className="text-[#FF6B2B]" />}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-400 capitalize">{role}</div>
                  </div>
                </div>
                {user?.isSubscribed && (
                  <div className="flex items-center text-xs text-[#FF6B2B] font-semibold bg-[#FF6B2B]/10 px-3 py-1.5 rounded-full inline-flex">
                    <Crown size={12} className="mr-1" /> Premium Member
                  </div>
                )}
                
                {/* DUAL ROLE SWITCHER */}
                {hasOtherRole ? (
                  <button onClick={async () => {
                    try {
                      const result = await switchRole();
                      if (result?.needsRegister && confirm(`Register as ${otherRole} too?`)) {
                        await registerOtherRole(otherRole);
                        window.location.reload();
                      } else { window.location.reload(); }
                    } catch (err) { alert(err.message); }
                  }} className="mt-3 w-full flex items-center justify-center text-xs font-bold bg-[#252525] hover:bg-[#333] px-3 py-2 rounded-xl border border-gray-700 cursor-pointer transition">
                    <RefreshCw size={12} className="mr-1.5 text-[#FF6B2B]" /> Switch to {otherRole === 'teacher' ? 'Teacher' : 'Student'} Mode
                  </button>
                ) : (
                  <button onClick={async () => {
                    const newRole = role === 'teacher' ? 'student' : 'teacher';
                    if (confirm(`Also register as ${newRole}? You can switch between both roles anytime.`)) {
                      try {
                        await registerOtherRole(newRole);
                        window.location.reload();
                      } catch (err) { alert(err.message); }
                    }
                  }} className="mt-3 w-full flex items-center justify-center text-xs font-bold bg-[#252525] hover:bg-[#333] px-3 py-2 rounded-xl border border-gray-700 cursor-pointer transition text-gray-400">
                    + Also become a {role === 'teacher' ? 'Student' : 'Teacher'}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {[
                  { icon: User, label: 'My Profile', action: () => { setSidebarOpen(false); navigate('/profile'); } },
                  { icon: Heart, label: 'My List', desc: `${savedProfiles.length} saved`, action: () => { setSidebarOpen(false); navigate('/my-list'); } },
                  { icon: MessageSquare, label: 'Requests & Messages', action: () => { setSidebarOpen(false); navigate('/messages'); } },
                  { icon: Crown, label: 'Subscription', desc: user?.isSubscribed ? 'Premium' : 'Free', action: () => { setSidebarOpen(false); navigate('/'); } },
                  { icon: Settings, label: 'Settings', action: () => { setSidebarOpen(false); navigate('/profile'); } },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="w-full flex items-center px-6 py-4 hover:bg-[#252525] transition cursor-pointer text-left">
                    <item.icon size={20} className="text-gray-400 mr-4" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.label}</div>
                      {item.desc && <div className="text-xs text-gray-500">{item.desc}</div>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-800">
                <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition cursor-pointer">
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── NOTIFICATION PANEL ──────────────────────────── */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNotifOpen(false)} className="fixed inset-0 bg-black/40 z-[500]" />
            <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#1A1A1A] border-l border-gray-800 z-[501] flex flex-col">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Notifications</h3>
                <button onClick={() => setNotifOpen(false)} className="p-1 hover:bg-gray-800 rounded-lg cursor-pointer"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No notifications yet</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif._id} onClick={() => markNotificationRead(notif._id)}
                      className={`p-4 border-b border-gray-800/50 cursor-pointer hover:bg-[#252525] transition ${!notif.isRead ? 'bg-[#FF6B2B]/5 border-l-2 border-l-[#FF6B2B]' : ''}`}>
                      <div className="font-semibold text-sm mb-1">{notif.title}</div>
                      <div className="text-xs text-gray-400">{notif.message}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── DASHBOARD NAVBAR ────────────────────────────── */}
      <nav className="w-full p-4 flex justify-between items-center z-20 border-b border-gray-800 bg-[#121212] sticky top-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <Menu size={18} />
          </button>
          
          <div>
            <div className="font-bold text-base md:text-lg">
              {lookingFor === 'teacher' ? 'Teachers' : 'Students'} Near You
            </div>
            <p className="text-xs text-gray-500">
              {loading ? 'Searching...' : `${total} found`}
              {userLocation && ` • ${range}km radius`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setLookingFor(prev => prev === 'teacher' ? 'student' : 'teacher')}
            className="text-xs bg-[#1E1E1E] px-3 py-2 rounded-xl border border-gray-800 cursor-pointer font-semibold text-gray-400 hover:text-white transition">
            {lookingFor === 'teacher' ? 'Students →' : 'Teachers →'}
          </button>

          {/* Notifications bell */}
          <button onClick={() => setNotifOpen(true)} className="relative p-2 bg-[#1E1E1E] rounded-xl hover:bg-gray-800 transition cursor-pointer hidden sm:block border border-gray-800">
            <Bell size={16} className="text-gray-400" />
            {unreadNotifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B2B] rounded-full text-[9px] font-bold flex items-center justify-center">{unreadNotifications}</span>}
          </button>

          {/* Messages */}
          <button onClick={() => navigate('/messages')} className="p-2 bg-[#1E1E1E] border border-gray-800 rounded-xl hover:bg-gray-800 text-gray-400 transition cursor-pointer">
            <MessageSquare size={16} />
          </button>
        </div>
      </nav>

      {/* ─── LOCATION BANNER ─────────────────────────────── */}
      {!userLocation && (
        <div className="bg-[#FF6B2B]/10 border-b border-[#FF6B2B]/20 py-2.5 px-4 flex justify-center items-center">
          <span className="text-xs text-[#FF6B2B] font-semibold mr-3">Allow location to show accurate distances</span>
          <button onClick={requestLocation} className="bg-[#FF6B2B] text-white px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer hover:bg-[#e85a1f]">Enable Location</button>
        </div>
      )}

      {/* ─── FILTER PANEL ───── */}
      <div className="bg-[#1A1A1A] border-b border-gray-800 overflow-visible z-10 w-full relative">
        <div className="max-w-6xl mx-auto p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Distance */}
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">Distance</label>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setRange(Math.max(1, range - 10))} className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-xl flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer text-lg font-bold"><Minus size={16} /></button>
                    <div className="flex-1 bg-[#121212] border border-gray-700 rounded-xl px-4 py-2.5 text-center">
                      <span className="text-[#FF6B2B] font-bold text-lg">{range}</span>
                      <span className="text-gray-400 text-sm ml-1">km</span>
                    </div>
                    <button onClick={() => setRange(Math.min(50, range + 10))} className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-xl flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer text-lg font-bold"><Plus size={16} /></button>
                  </div>
                </div>

                {/* Max Price (typed input) */}
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">Max {lookingFor === 'teacher' ? 'Fee' : 'Budget'} (₹/month)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={maxPrice === 10000 ? '' : maxPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') { setMaxPrice(10000); return; }
                      const num = parseInt(val);
                      if (!isNaN(num) && num >= 0) setMaxPrice(num);
                    }}
                    className="w-full bg-[#121212] border border-gray-700 focus:border-[#FF6B2B] outline-none px-4 py-2.5 rounded-xl text-white text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Leave empty for any price</p>
                </div>

                {/* Subject (typed input) */}
                <div>
                  <label className="text-sm font-semibold text-gray-300 mb-2 block">Subject</label>
                  <input
                    type="text"
                    placeholder="Type a subject..."
                    value={subjectQuery}
                    onChange={(e) => setSubjectQuery(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-700 focus:border-[#FF6B2B] outline-none px-4 py-2.5 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              {/* Quick Subject Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology', 'Computer Science', 'Hindi', 'Economics', 'Accounts'].map(sub => (
                  <button key={sub} onClick={() => setSubjectQuery(sub)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer border ${subjectQuery === sub ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300'}`}>
                    {sub}
                  </button>
                ))}
              </div>

              {(subjectQuery.length > 0 || maxPrice < 10000 || range !== 10) && (
                <button onClick={() => { setSubjectQuery(''); setMaxPrice(10000); setRange(10); }} className="text-xs text-gray-500 hover:text-[#FF6B2B] cursor-pointer flex items-center">
                  <RotateCcw size={12} className="mr-1" /> Reset all filters
                </button>
              )}
          </div>
        </div>

      {/* ─── LIST VIEW GRID ────────────────────────────── */}
      <div className="max-w-6xl w-full mx-auto p-4 flex-1 relative">
        {loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex justify-center pointer-events-none">
             <div className="bg-[#FF6B2B]/20 backdrop-blur-md border border-[#FF6B2B]/50 rounded-full px-5 py-2 shadow-2xl flex items-center shadow-black/50">
                <Loader size={16} className="text-[#FF6B2B] animate-spin mr-2" />
                <span className="text-xs font-bold text-[#FF6B2B]">Scanning {range}km radius...</span>
             </div>
          </div>
        )}

        {results.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4 border border-gray-800">
              <MapPin size={32} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">No {lookingFor}s found nearby</h2>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">Try increasing your search range or modifying the budget and filters.</p>
            <button onClick={() => { setRange(10); setSubjectQuery(''); setMaxPrice(10000); }} className="bg-[#FF6B2B] px-6 py-2 rounded-full font-bold text-sm cursor-pointer hover:scale-105 transition">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-300 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            {results.map((person, i) => (
              <motion.div key={person._id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 hover:border-[#FF6B2B]/30 transition group flex flex-col">

                <div onClick={() => setSelectedProfile(person)} className="cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                      {person.photo ? <img src={person.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><User size={20} className="text-gray-500" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{person.name || 'User'}</div>
                      <div className="text-xs text-gray-500 capitalize flex items-center">
                        {lookingFor}
                        {person.isSubscribed && <span className="ml-2 text-[#FF6B2B] flex items-center"><Star size={10} className="mr-0.5 fill-current" /> Verified</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121212] rounded-xl p-3 space-y-2 mb-4 border border-gray-800/50 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Subjects' : 'Needs'}</span>
                    <span className="text-white font-semibold text-right truncate max-w-[150px]">
                      {lookingFor === 'teacher' ? (person.subjects?.join(', ') || 'Any') : (person.subjectsNeeded?.join(', ') || 'Any')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Fee' : 'Budget'}</span>
                    <span className="text-[#FF6B2B] font-bold">₹{lookingFor === 'teacher' ? (person.chargePerMonth || '—') : (person.budgetPerMonth || '—')}/mo</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-auto">
                  <button onClick={() => handleSaveToggle(person._id)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center justify-center border ${isSaved(person._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border-[#FF6B2B]/30' : 'bg-[#252525] text-gray-300 border-gray-800 hover:border-[#FF6B2B]/30'}`}>
                    <Heart size={14} className={`mr-1.5 ${isSaved(person._id) ? 'fill-current' : ''}`} />
                    {isSaved(person._id) ? 'Saved' : 'Save'}
                  </button>

                  <button onClick={() => {
                    sendPing(person._id, lookingFor, '');
                    alert(`Request successfully sent to ${person.name || 'user'}!`);
                  }}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-[#FF6B2B] hover:bg-[#e85a1f] text-white transition cursor-pointer flex items-center justify-center">
                    <Send size={14} className="mr-1.5" /> Request
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── PROFILE DETAIL MODAL (UPSELL IF NOT SUBSCRIBED) ─── */}
      <AnimatePresence>
        {selectedProfile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProfile(null)} className="fixed inset-0 bg-black/60 z-[600]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-[601] bg-[#1A1A1A] border-t border-gray-800 rounded-t-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="p-6 max-w-lg mx-auto">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border-2 border-[#FF6B2B]">
                      {selectedProfile.photo ? <img src={selectedProfile.photo} alt="" className="w-full h-full object-cover" /> : <User size={28} className="text-[#FF6B2B]" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{lookingFor}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProfile(null)} className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer"><X size={18} /></button>
                </div>

                <div className="bg-[#121212] rounded-xl p-4 border border-gray-800 space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Subjects' : 'Needs'}</span>
                    <span className="text-white font-bold text-right">{lookingFor === 'teacher' ? (selectedProfile.subjects?.join(', ') || 'All') : (selectedProfile.subjectsNeeded?.join(', ') || 'All')}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-800 pt-2">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Fee' : 'Budget'}</span>
                    <span className="text-[#FF6B2B] font-bold">₹{lookingFor === 'teacher' ? (selectedProfile.chargePerMonth || '—') : (selectedProfile.budgetPerMonth || '—')}/mo</span>
                  </div>
                </div>

                <div className="relative bg-[#121212] rounded-xl p-4 border border-gray-800 mb-6">
                  <div className="blur-sm select-none pointer-events-none space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Qualifications</span><span>B.Ed, M.Sc...</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Experience</span><span>5 years...</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Bio</span><span>I love teaching...</span></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212]/80 rounded-xl">
                    <Lock size={24} className="text-[#FF6B2B] mb-2" />
                    <p className="text-sm font-bold mb-1">Full profile locked</p>
                    <p className="text-xs text-gray-400 text-center px-4">Subscribe to see all details and send unlimited connection requests</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => handleSaveToggle(selectedProfile._id)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer border ${isSaved(selectedProfile._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border-[#FF6B2B]/30' : 'bg-[#1E1E1E] text-white border-gray-800 hover:border-[#FF6B2B]'}`}>
                    <Heart size={16} className={`mr-2 ${isSaved(selectedProfile._id) ? 'fill-current' : ''}`} /> {isSaved(selectedProfile._id) ? 'In Your List ✓' : 'Add to List'}
                  </button>

                  <button onClick={() => navigate('/pricing')}
                    className="w-full bg-gradient-to-r from-[#FF6B2B] to-[#FF8F5E] py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition hover:scale-[1.02]">
                    <Crown size={16} className="mr-2" /> Verify & Subscribe
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
