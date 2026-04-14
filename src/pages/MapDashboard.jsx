import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, MessageSquare, Menu, X, Bell, User, BookmarkPlus, Settings, LogOut, Crown, Heart, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '../components/MapView';

export default function MapDashboard() {
  const { user, role, logout, unreadNotifications, notifications, markNotificationRead, saveProfile, unsaveProfile, savedProfiles, sendPing, emitNearbySearch, updateLocation, API_BASE } = useAppContext();
  const navigate = useNavigate();

  const [mode, setMode] = useState(role === 'teacher' ? 'teacher' : 'student');
  const [subject, setSubject] = useState('');
  const [budget, setBudget] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLocation, setUserLocation] = useState([23.2599, 77.4126]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        updateLocation(loc[0], loc[1]);
      });
    }
  }, []);

  // Fetch nearby users
  const fetchNearby = useCallback(async () => {
    if (!userLocation) return;
    setLoadingNearby(true);
    try {
      const targetRole = role === 'teacher' ? 'student' : 'teacher';
      const res = await fetch(`${API_BASE}/api/auth/nearby?lat=${userLocation[0]}&lng=${userLocation[1]}&role=${targetRole}`);
      const data = await res.json();
      if (Array.isArray(data)) setNearbyUsers(data);
    } catch (err) {
      console.error("Fetch nearby error:", err);
    } finally {
      setLoadingNearby(false);
    }
  }, [userLocation, role, API_BASE]);

  useEffect(() => {
    if (isSearching) {
      fetchNearby();
      emitNearbySearch(userLocation[0], userLocation[1], subject);
    }
  }, [isSearching]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!subject) return alert("Please enter a subject.");
    setIsSearching(true);
  };

  const isSaved = (targetId) => savedProfiles.some(p => p._id === targetId);

  const handleSaveToggle = (targetId) => {
    if (isSaved(targetId)) {
      unsaveProfile(targetId);
    } else {
      saveProfile(targetId);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-[#121212] text-white font-sans overflow-hidden flex flex-col"
    >

      {/* ─── HAMBURGER SIDEBAR ────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[500]" />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#1A1A1A] border-r border-gray-800 z-[501] flex flex-col"
            >
              {/* Profile Header */}
              <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-[#FF6B2B]/10 to-transparent">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-[#FF6B2B] flex items-center justify-center">
                    {user?.photo ? (
                      <img src={user.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-[#FF6B2B]" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{user?.name || 'Guest'}</div>
                    <div className="text-xs text-gray-400 capitalize">{role}</div>
                  </div>
                </div>
                {user?.isSubscribed && (
                  <div className="flex items-center text-xs text-[#FF6B2B] font-semibold bg-[#FF6B2B]/10 px-3 py-1.5 rounded-full inline-flex">
                    <Crown size={12} className="mr-1" /> Premium Member
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-2">
                {[
                  { icon: User, label: 'My Profile', action: () => { setSidebarOpen(false); navigate('/profile'); } },
                  { icon: Heart, label: 'My List', desc: `${savedProfiles.length} saved`, action: () => { setSidebarOpen(false); navigate('/my-list'); } },
                  { icon: MessageSquare, label: 'Requests & Messages', action: () => { setSidebarOpen(false); navigate('/messages'); } },
                  { icon: Crown, label: 'Subscription', desc: user?.isSubscribed ? 'Premium' : 'Free', action: () => { setSidebarOpen(false); navigate('/'); } },
                  { icon: Settings, label: 'Settings', action: () => { setSidebarOpen(false); navigate('/profile'); } },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full flex items-center px-6 py-4 hover:bg-[#252525] transition cursor-pointer text-left"
                  >
                    <item.icon size={20} className="text-gray-400 mr-4" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.label}</div>
                      {item.desc && <div className="text-xs text-gray-500">{item.desc}</div>}
                    </div>
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center justify-center py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition cursor-pointer"
                >
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
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#1A1A1A] border-l border-gray-800 z-[501] flex flex-col"
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg">Notifications</h3>
                <button onClick={() => setNotifOpen(false)} className="p-1 hover:bg-gray-800 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No notifications yet</div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif._id}
                      onClick={() => markNotificationRead(notif._id)}
                      className={`p-4 border-b border-gray-800/50 cursor-pointer hover:bg-[#252525] transition ${!notif.isRead ? 'bg-[#FF6B2B]/5 border-l-2 border-l-[#FF6B2B]' : ''}`}
                    >
                      <div className="font-semibold text-sm mb-1">{notif.title}</div>
                      <div className="text-xs text-gray-400">{notif.message}</div>
                      <div className="text-xs text-gray-600 mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ──────────────────────────────────────── */}
      <nav className="w-full p-4 flex justify-between items-center z-20 border-b border-gray-800 bg-[#121212]">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <Menu size={18} />
          </button>
          <div className="text-xl font-bold text-[#FF6B2B] tracking-tight hidden sm:block">TutionPao</div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications bell */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B2B] rounded-full text-xs font-bold flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            onClick={() => navigate('/messages')}
            className="flex items-center space-x-2 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <MessageSquare size={18} />
            <span className="hidden sm:inline">Messages</span>
          </button>

          {/* User chip */}
          <div className="flex items-center bg-[#1E1E1E] pl-2 pr-4 py-1.5 rounded-xl border border-gray-800">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
              {user?.photo ? (
                <img src={user.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">?</div>
              )}
            </div>
            <span className="text-sm text-gray-400 hidden sm:inline">Hi, <span className="text-white font-semibold">{user?.name || 'Guest'}</span></span>
          </div>
        </div>
      </nav>

      {/* ─── SEARCH FORM (when NOT searching) ─────────────── */}
      {!isSearching && (
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">Live Radius Search</h1>
            <p className="text-gray-400 text-sm md:text-base">Find {role === 'teacher' ? 'students' : 'tutors'} within 5km of you</p>
          </div>

          <div className="w-full max-w-2xl bg-[#1E1E1E] border border-gray-800 rounded-3xl p-4 shadow-2xl">
            <form onSubmit={handleSearch} className="space-y-4 px-2 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#121212] flex items-center px-4 rounded-2xl border border-gray-800 focus-within:border-[#FF6B2B] transition-colors">
                  <Search className="text-gray-500 mr-3" size={20} />
                  <input
                    type="text"
                    placeholder={role === 'teacher' ? "Subject to teach?" : "Subject to study?"}
                    className="w-full bg-transparent py-4 outline-none text-white placeholder-gray-500"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="bg-[#121212] flex items-center px-4 rounded-2xl border border-gray-800 focus-within:border-[#FF6B2B] transition-colors">
                  <span className="text-gray-500 mr-3 font-semibold">₹</span>
                  <input
                    type="number"
                    placeholder={role === 'teacher' ? "Expected Fee /mo" : "Budget (per month)"}
                    className="w-full bg-transparent py-4 outline-none text-white placeholder-gray-500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl mt-4 transition-transform hover:scale-[1.01] active:scale-95 flex justify-center items-center cursor-pointer"
              >
                <MapPin className="mr-2" size={20} /> Launch Radar Map
              </button>
            </form>
          </div>
        </main>
      )}

      {/* ─── MAP + LIST VIEW (when searching) ─────────────── */}
      {isSearching && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Map Area */}
          <div className="relative flex-1 h-[50vh] md:h-auto">
            <MapView
              userLocation={userLocation}
              nearbyUsers={nearbyUsers}
              loadingNearby={loadingNearby}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onClose={() => setIsSearching(false)}
              role={role}
            />
          </div>

          {/* Right Side List Panel */}
          <div className="w-full md:w-96 bg-[#1A1A1A] border-t md:border-t-0 md:border-l border-gray-800 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-bold">
                {loadingNearby ? 'Scanning...' : `${nearbyUsers.length} ${role === 'teacher' ? 'Students' : 'Tutors'} Found`}
              </h3>
              <button onClick={() => setIsSearching(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto">
              {nearbyUsers.length === 0 && !loadingNearby && (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No one found nearby. Try expanding your search area.
                </div>
              )}

              {nearbyUsers.map(person => (
                <div
                  key={person._id}
                  onClick={() => setSelectedUser(person)}
                  className={`p-4 border-b border-gray-800/50 hover:bg-[#252525] cursor-pointer transition ${selectedUser?._id === person._id ? 'bg-[#252525] border-l-2 border-l-[#FF6B2B]' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Profile pic */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                      {person.photo ? (
                        <img src={person.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={20} /></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{person.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">
                        {role === 'student'
                          ? `${person.subjects?.join(', ') || 'All subjects'} • ₹${person.chargePerMonth || '—'}/mo`
                          : `${person.subjectsNeeded?.join(', ') || 'All subjects'} • ₹${person.budgetPerMonth || '—'}/mo`
                        }
                      </div>
                    </div>

                    {/* Save button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveToggle(person._id); }}
                      className={`p-2 rounded-lg transition cursor-pointer ${isSaved(person._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B]' : 'bg-[#1E1E1E] text-gray-400 hover:text-[#FF6B2B]'}`}
                      title={isSaved(person._id) ? 'Remove from list' : 'Add to list'}
                    >
                      <Heart size={16} className={isSaved(person._id) ? 'fill-current' : ''} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SELECTED USER DETAIL PANEL (overlay) ────────── */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 md:right-auto md:w-96 md:left-auto md:bottom-0 md:top-0 bg-[#1A1A1A] border-t md:border-l border-gray-800 z-[400] flex flex-col max-h-[70vh] md:max-h-full"
          >
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-800 relative">
              <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer">
                <X size={16} />
              </button>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#FF6B2B] overflow-hidden">
                  {selectedUser.photo ? (
                    <img src={selectedUser.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-[#FF6B2B]" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <div className="text-xs text-gray-400 capitalize">{role === 'teacher' ? 'Student' : 'Teacher'}</div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-[#121212] rounded-xl p-4 grid grid-cols-1 gap-3 text-sm border border-gray-800">
                {role === 'student' && (
                  <>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Subjects</span>
                      <span className="text-white font-bold text-right">{selectedUser.subjects?.join(', ') || 'All'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Fee</span>
                      <span className="text-[#FF6B2B] font-bold">₹{selectedUser.chargePerMonth || '—'}/mo</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Qualifications</span>
                      <span className="text-gray-300 font-medium text-right max-w-[180px]">{selectedUser.qualifications || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="text-gray-300">{selectedUser.experience || '—'}</span>
                    </div>
                  </>
                )}
                {role === 'teacher' && (
                  <>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Needs</span>
                      <span className="text-white font-bold text-right">{selectedUser.subjectsNeeded?.join(', ') || 'All'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Budget</span>
                      <span className="text-[#FF6B2B] font-bold">₹{selectedUser.budgetPerMonth || '—'}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Grade</span>
                      <span className="text-gray-300">{selectedUser.grade || '—'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 space-y-3">
              <button
                onClick={() => handleSaveToggle(selectedUser._id)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition ${isSaved(selectedUser._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border border-[#FF6B2B]/30' : 'bg-[#1E1E1E] text-white border border-gray-800 hover:border-[#FF6B2B]'}`}
              >
                <Heart size={18} className={`mr-2 ${isSaved(selectedUser._id) ? 'fill-current' : ''}`} />
                {isSaved(selectedUser._id) ? 'Added to List ✓' : 'Add to List'}
              </button>

              {user?.isSubscribed ? (
                <button
                  onClick={() => {
                    const targetRole = role === 'teacher' ? 'student' : 'teacher';
                    sendPing(selectedUser._id, targetRole, '');
                    alert('Connection request sent! Check Messages.');
                  }}
                  className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition"
                >
                  Send Connection Request
                </button>
              ) : (
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-800 text-gray-400 py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer"
                >
                  <Crown size={16} className="mr-2 text-[#FF6B2B]" /> Subscribe to Connect
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
