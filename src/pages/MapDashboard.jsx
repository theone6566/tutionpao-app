import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, MessageSquare, Menu, X, Bell, User, BookmarkPlus, Settings, LogOut, Crown, Heart, List, RefreshCw, SlidersHorizontal, Send, Minus, Plus, Loader, Lock, Star, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accounts', 'History', 'Geography', 'Political Science', 'Art', 'Music', 'Sanskrit'];

export default function MapDashboard() {
  const { user, role, logout, unreadNotifications, notifications, markNotificationRead, saveProfile, unsaveProfile, savedProfiles, sendPing, updateLocation, API_BASE, hasOtherRole, otherRole, switchRole, registerOtherRole } = useAppContext();
  const navigate = useNavigate();

  const lookingFor = role === 'teacher' ? 'student' : 'teacher';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Search Results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [range, setRange] = useState(50);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Selected Profile for modal
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Auth guard
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        updateLocation(loc.lat, loc.lng);
      });
    }
  }, []);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/auth/public/browse?role=${lookingFor}&limit=50`;

      if (userLocation) {
        url += `&lat=${userLocation.lat}&lng=${userLocation.lng}&maxDistance=${range * 1000}`;
      }

      if (selectedSubjects.length > 0) {
        url += `&subject=${encodeURIComponent(selectedSubjects[0])}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      let users = data.users || [];

      // Client-side mapping
      users = users.filter(u => {
        const price = lookingFor === 'teacher' ? (u.chargePerMonth || 0) : (u.budgetPerMonth || 0);
        if (minPrice > 0 && price < minPrice) return false;
        if (maxPrice < 10000 && price > maxPrice) return false;
        return true;
      });

      if (selectedSubjects.length > 1) {
        users = users.filter(u => {
          const subs = lookingFor === 'teacher' ? (u.subjects || []) : (u.subjectsNeeded || []);
          return selectedSubjects.some(s => subs.some(us => us.toLowerCase().includes(s.toLowerCase())));
        });
      }

      setResults(users);
      setTotal(users.length);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [lookingFor, userLocation, range, minPrice, maxPrice, selectedSubjects]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  const isSaved = (id) => savedProfiles?.some(p => p._id === id);
  const handleSaveToggle = (targetId) => {
    if (isSaved(targetId)) unsaveProfile(targetId);
    else saveProfile(targetId);
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen bg-[#121212] text-white font-sans overflow-x-hidden flex flex-col">

      {/* ─── HAMBURGER SIDEBAR ────────────────────────────── */}
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

      {/* ─── FILTER PANEL (Integrated from SearchPage) ───── */}
      <div className="bg-[#1A1A1A] border-b border-gray-800 overflow-visible z-10 w-full relative">
        <div className="max-w-6xl mx-auto p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-300">Distance</label>
                    <span className="text-[#FF6B2B] font-bold text-sm bg-[#FF6B2B]/10 px-3 py-0.5 rounded-full">{range} km</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setRange(Math.max(1, range - 5))} className="w-9 h-9 bg-[#121212] border border-gray-700 rounded-lg flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer"><Minus size={14} /></button>
                    <input type="range" min="1" max="50" value={range} onChange={(e) => setRange(parseInt(e.target.value))} className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B2B]" />
                    <button onClick={() => setRange(Math.min(50, range + 5))} className="w-9 h-9 bg-[#121212] border border-gray-700 rounded-lg flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer"><Plus size={14} /></button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-300">{lookingFor === 'teacher' ? 'Fee Range' : 'Budget Range'}</label>
                    <span className="text-[#FF6B2B] font-bold text-sm">₹{minPrice} – ₹{maxPrice}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-[#121212] border border-gray-700 rounded-xl px-1">
                      <button onClick={() => setMinPrice(Math.max(0, minPrice - 500))} className="p-1.5 cursor-pointer hover:text-[#FF6B2B]"><Minus size={12} /></button>
                      <span className="text-sm font-bold min-w-[45px] text-center">₹{minPrice}</span>
                      <button onClick={() => setMinPrice(Math.min(maxPrice, minPrice + 500))} className="p-1.5 cursor-pointer hover:text-[#FF6B2B]"><Plus size={12} /></button>
                    </div>
                    <span className="text-gray-600 text-xs">to</span>
                    <div className="flex items-center bg-[#121212] border border-gray-700 rounded-xl px-1">
                      <button onClick={() => setMaxPrice(Math.max(minPrice, maxPrice - 500))} className="p-1.5 cursor-pointer hover:text-[#FF6B2B]"><Minus size={12} /></button>
                      <span className="text-sm font-bold min-w-[45px] text-center">₹{maxPrice}</span>
                      <button onClick={() => setMaxPrice(maxPrice + 500)} className="p-1.5 cursor-pointer hover:text-[#FF6B2B]"><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Filters by Subject</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SUBJECTS.map(sub => (
                    <button key={sub} onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${selectedSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedSubjects.length > 0 || minPrice > 0 || maxPrice < 10000 || range !== 50) && (
                <button onClick={() => { setSelectedSubjects([]); setMinPrice(0); setMaxPrice(10000); setRange(50); }} className="text-xs text-gray-500 hover:text-[#FF6B2B] cursor-pointer flex items-center">
                  <RotateCcw size={12} className="mr-1" /> Reset all filters
                </button>
              )}
          </div>
        </div>
      </div>

      {/* ─── LIST VIEW GRID ────────────────────────────── */}
      <div className="max-w-6xl w-full mx-auto p-4 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={32} className="text-[#FF6B2B] animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Scanning {range}km radius...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4 border border-gray-800">
              <MapPin size={32} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">No {lookingFor}s found nearby</h2>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">Try increasing your search range or modifying the budget and filters.</p>
            <button onClick={() => { setRange(50); setSelectedSubjects([]); setMinPrice(0); setMaxPrice(10000); }} className="bg-[#FF6B2B] px-6 py-2 rounded-full font-bold text-sm cursor-pointer hover:scale-105 transition">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((person, i) => (
              <motion.div key={person._id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-4 hover:border-[#FF6B2B]/30 transition group flex flex-col">

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
                    if (!user.isSubscribed) setSelectedProfile(person);
                    else { sendPing(person._id, lookingFor, ''); alert(`Request sent to ${person.name}!`); }
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

                  <button onClick={() => navigate('/subscription-details')}
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
