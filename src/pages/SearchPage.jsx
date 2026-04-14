import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, SlidersHorizontal, MapPin, User, Heart, Crown, Send, ChevronRight, X, Minus, Plus, Filter, Loader, Lock, BookOpen, Users, Star } from 'lucide-react';

const API_BASE = "https://tutionpao-backend-production.up.railway.app";
const ALL_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accounts', 'History', 'Geography', 'Political Science', 'Art', 'Music', 'Sanskrit'];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const lookingFor = searchParams.get('looking') || 'teacher'; // teacher or student
  const navigate = useNavigate();
  const { user, role, sendPing, saveProfile, unsaveProfile, savedProfiles } = useAppContext();

  // Results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [range, setRange] = useState(25); // km
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Cart (localStorage for non-logged-in users)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tutionpao_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Selected profile detail
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    localStorage.setItem('tutionpao_cart', JSON.stringify(cart));
  }, [cart]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null),
        { timeout: 5000 }
      );
    }
  }, []);

  // Fetch results
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

      // Client-side price filter
      users = users.filter(u => {
        const price = lookingFor === 'teacher' ? (u.chargePerMonth || 0) : (u.budgetPerMonth || 0);
        return price >= minPrice && price <= maxPrice;
      });

      // Client-side multi-subject filter
      if (selectedSubjects.length > 1) {
        users = users.filter(u => {
          const userSubjects = lookingFor === 'teacher' ? (u.subjects || []) : (u.subjectsNeeded || []);
          return selectedSubjects.some(s => userSubjects.some(us => us.toLowerCase().includes(s.toLowerCase())));
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

  // Initial fetch + refetch on filter changes
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Cart helpers
  const isInCart = (id) => cart.some(p => p._id === id);
  const toggleCart = (profile) => {
    if (isInCart(profile._id)) {
      setCart(prev => prev.filter(p => p._id !== profile._id));
    } else {
      setCart(prev => [...prev, profile]);
    }
  };

  // Server-side save helpers (for logged-in users)
  const isServerSaved = (id) => savedProfiles?.some(p => p._id === id);

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#121212] text-white font-sans"
    >
      {/* ─── NAVBAR ──────────────────────────────────────── */}
      <nav className="sticky top-0 w-full p-4 flex items-center justify-between z-30 bg-[#121212]/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-bold text-lg">
              {lookingFor === 'teacher' ? '🎓 Teachers' : '📚 Students'} Near You
            </h1>
            <p className="text-xs text-gray-500">{total} found • {range}km radius</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition cursor-pointer flex items-center text-sm font-semibold ${showFilters ? 'bg-[#FF6B2B] text-white' : 'bg-[#1E1E1E] text-gray-400 border border-gray-800 hover:border-[#FF6B2B]'}`}
          >
            <SlidersHorizontal size={16} className="mr-1" /> Filters
          </button>

          {/* Cart */}
          {cart.length > 0 && (
            <button onClick={() => user ? navigate('/my-list') : navigate('/login')}
              className="relative p-2.5 bg-[#1E1E1E] rounded-xl border border-gray-800 hover:border-[#FF6B2B] transition cursor-pointer">
              <Heart size={16} className="text-[#FF6B2B] fill-current" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B2B] rounded-full text-[10px] font-bold flex items-center justify-center">{cart.length}</span>
            </button>
          )}

          {/* Switch search target */}
          <button
            onClick={() => navigate(`/search?looking=${lookingFor === 'teacher' ? 'student' : 'teacher'}`)}
            className="text-xs bg-[#1E1E1E] px-3 py-2.5 rounded-xl border border-gray-800 hover:border-[#FF6B2B] transition cursor-pointer font-semibold text-gray-400"
          >
            {lookingFor === 'teacher' ? 'Switch to Students →' : 'Switch to Teachers →'}
          </button>
        </div>
      </nav>

      {/* ─── FILTER PANEL ────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#1A1A1A] border-b border-gray-800 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto p-5 space-y-5">

              {/* Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">📍 Distance Range</label>
                  <span className="text-[#FF6B2B] font-bold text-sm">{range} km</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setRange(Math.max(1, range - 5))} className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-xl flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer">
                    <Minus size={16} />
                  </button>
                  <input
                    type="range" min="1" max="50" value={range}
                    onChange={(e) => setRange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B2B]"
                  />
                  <button onClick={() => setRange(Math.min(50, range + 5))} className="w-10 h-10 bg-[#121212] border border-gray-700 rounded-xl flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1 km</span><span>25 km</span><span>50 km</span>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">
                    💰 {lookingFor === 'teacher' ? 'Fee Range' : 'Budget Range'}
                  </label>
                  <span className="text-[#FF6B2B] font-bold text-sm">₹{minPrice} – ₹{maxPrice}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-[#121212] border border-gray-700 rounded-xl px-1">
                    <button onClick={() => setMinPrice(Math.max(0, minPrice - 500))} className="p-2 cursor-pointer hover:text-[#FF6B2B]"><Minus size={14} /></button>
                    <span className="text-sm font-bold min-w-[50px] text-center">₹{minPrice}</span>
                    <button onClick={() => setMinPrice(Math.min(maxPrice, minPrice + 500))} className="p-2 cursor-pointer hover:text-[#FF6B2B]"><Plus size={14} /></button>
                  </div>
                  <span className="text-gray-600">to</span>
                  <div className="flex items-center bg-[#121212] border border-gray-700 rounded-xl px-1">
                    <button onClick={() => setMaxPrice(Math.max(minPrice, maxPrice - 500))} className="p-2 cursor-pointer hover:text-[#FF6B2B]"><Minus size={14} /></button>
                    <span className="text-sm font-bold min-w-[50px] text-center">₹{maxPrice}</span>
                    <button onClick={() => setMaxPrice(maxPrice + 500)} className="p-2 cursor-pointer hover:text-[#FF6B2B]"><Plus size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">📚 Filter by Subject</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SUBJECTS.map(sub => (
                    <button
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${selectedSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(selectedSubjects.length > 0 || minPrice > 0 || maxPrice < 10000 || range !== 25) && (
                <button
                  onClick={() => { setSelectedSubjects([]); setMinPrice(0); setMaxPrice(10000); setRange(25); }}
                  className="text-xs text-gray-500 hover:text-[#FF6B2B] underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── RESULTS ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader size={32} className="text-[#FF6B2B] animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Searching {range}km around you...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">No {lookingFor}s found</h2>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Try increasing the range or removing filters.
              {!userLocation && ' Enable location access for nearby results.'}
            </p>
            <button onClick={() => { setRange(50); setSelectedSubjects([]); setMinPrice(0); setMaxPrice(10000); }}
              className="bg-[#FF6B2B] px-6 py-2 rounded-full font-bold text-sm cursor-pointer hover:scale-105 transition">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((person, i) => (
              <motion.div
                key={person._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-5 hover:border-[#FF6B2B]/30 transition group"
              >
                {/* Profile header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                    {person.photo ? (
                      <img src={person.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-gray-500" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold truncate">{person.name || 'User'}</div>
                    <div className="text-xs text-gray-500 capitalize flex items-center">
                      {lookingFor}
                      {person.isSubscribed && <span className="ml-2 text-[#FF6B2B]"><Star size={10} className="inline fill-current" /> Verified</span>}
                    </div>
                  </div>
                </div>

                {/* Visible Details: Subject + Price ONLY */}
                <div className="bg-[#121212] rounded-xl p-3 space-y-2 mb-4 border border-gray-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Teaches' : 'Needs'}</span>
                    <span className="text-white font-semibold text-right truncate max-w-[170px]">
                      {lookingFor === 'teacher'
                        ? (person.subjects?.join(', ') || 'All')
                        : (person.subjectsNeeded?.join(', ') || 'All')
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Fee' : 'Budget'}</span>
                    <span className="text-[#FF6B2B] font-bold">
                      ₹{lookingFor === 'teacher' ? (person.chargePerMonth || '—') : (person.budgetPerMonth || '—')}/mo
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {/* Add to List */}
                  <button
                    onClick={() => toggleCart(person)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center justify-center border ${isInCart(person._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border-[#FF6B2B]/30' : 'bg-[#252525] text-gray-300 border-gray-800 hover:border-[#FF6B2B]/30 hover:text-[#FF6B2B]'}`}
                  >
                    <Heart size={14} className={`mr-1.5 ${isInCart(person._id) ? 'fill-current' : ''}`} />
                    {isInCart(person._id) ? 'Saved ✓' : 'Add to List'}
                  </button>

                  {/* Send Request (works for logged in + subscribed, else prompts) */}
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else if (!user.isSubscribed) {
                        setSelectedProfile(person); // show upsell in detail
                      } else {
                        sendPing(person._id, lookingFor, '');
                        alert(`Request sent to ${person.name}!`);
                      }
                    }}
                    className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-[#FF6B2B] hover:bg-[#e85a1f] text-white transition cursor-pointer flex items-center"
                  >
                    <Send size={14} className="mr-1" /> Request
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── PROFILE DETAIL / UPSELL OVERLAY ─────────────── */}
      <AnimatePresence>
        {selectedProfile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)} className="fixed inset-0 bg-black/60 z-[500]" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-[501] bg-[#1A1A1A] border-t border-gray-800 rounded-t-3xl max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border-2 border-[#FF6B2B]">
                      {selectedProfile.photo ? (
                        <img src={selectedProfile.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><User size={28} className="text-[#FF6B2B]" /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{lookingFor}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProfile(null)} className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer"><X size={18} /></button>
                </div>

                {/* Visible details */}
                <div className="bg-[#121212] rounded-xl p-4 border border-gray-800 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Subjects' : 'Needs'}</span>
                    <span className="text-white font-bold text-right">
                      {lookingFor === 'teacher' ? (selectedProfile.subjects?.join(', ') || 'All') : (selectedProfile.subjectsNeeded?.join(', ') || 'All')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-800 pt-2">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Fee' : 'Budget'}</span>
                    <span className="text-[#FF6B2B] font-bold">
                      ₹{lookingFor === 'teacher' ? (selectedProfile.chargePerMonth || '—') : (selectedProfile.budgetPerMonth || '—')}/mo
                    </span>
                  </div>
                </div>

                {/* Hidden details → Subscribe prompt */}
                <div className="relative bg-[#121212] rounded-xl p-4 border border-gray-800 mb-6">
                  <div className="blur-sm select-none pointer-events-none space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Qualifications</span><span className="text-gray-300">B.Ed, M.Sc...</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Experience</span><span className="text-gray-300">5 years...</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Hours/Day</span><span className="text-gray-300">3 hrs</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Bio</span><span className="text-gray-300 truncate">I love teaching and...</span></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212]/80 rounded-xl">
                    <Lock size={24} className="text-[#FF6B2B] mb-2" />
                    <p className="text-sm font-bold mb-1">Full details locked</p>
                    <p className="text-xs text-gray-400 mb-3">Subscribe to see qualifications, experience, bio & send messages</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleCart(selectedProfile)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition border ${isInCart(selectedProfile._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border-[#FF6B2B]/30' : 'bg-[#1E1E1E] text-white border-gray-800 hover:border-[#FF6B2B]'}`}
                  >
                    <Heart size={16} className={`mr-2 ${isInCart(selectedProfile._id) ? 'fill-current' : ''}`} />
                    {isInCart(selectedProfile._id) ? 'In Your List ✓' : 'Add to List'}
                  </button>

                  {user && user.isSubscribed ? (
                    <button
                      onClick={() => {
                        sendPing(selectedProfile._id, lookingFor, '');
                        alert(`Request sent to ${selectedProfile.name}!`);
                        setSelectedProfile(null);
                      }}
                      className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition"
                    >
                      <Send size={16} className="mr-2" /> Send Connection Request
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(user ? '/' : '/login')}
                      className="w-full bg-gradient-to-r from-[#FF6B2B] to-[#FF8F5E] py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition hover:scale-[1.01]"
                    >
                      <Crown size={16} className="mr-2" /> {user ? 'Subscribe to Connect' : 'Sign Up & Subscribe'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
