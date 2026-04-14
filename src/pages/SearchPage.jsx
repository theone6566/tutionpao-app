import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, MapPin, User, Heart, Crown, Send, X, Minus, Plus, Loader, Lock, Star, Navigation, AlertCircle, ChevronDown, RotateCcw } from 'lucide-react';

const API_BASE = "https://tutionpao-backend-production.up.railway.app";
const ALL_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accounts', 'History', 'Geography', 'Political Science', 'Art', 'Music', 'Sanskrit'];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const lookingFor = searchParams.get('looking') || 'teacher';
  const navigate = useNavigate();
  const { user, role, sendPing, logSearch } = useAppContext();

  // Location permission state
  const [locationStep, setLocationStep] = useState('asking'); // 'asking' | 'granted' | 'denied'
  const [userLocation, setUserLocation] = useState(null);

  // Results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchActivity, setSearchActivity] = useState(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [range, setRange] = useState(50);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Cart (localStorage)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tutionpao_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Profile detail
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => { localStorage.setItem('tutionpao_cart', JSON.stringify(cart)); }, [cart]);

  // ─── STEP 1: ASK FOR LOCATION PERMISSION ──────────────────
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStep('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationStep('granted');
      },
      (err) => {
        console.log('Location denied:', err.message);
        setLocationStep('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ─── STEP 2: FETCH RESULTS AFTER LOCATION ─────────────────
  const fetchResults = useCallback(async () => {
    if (locationStep === 'asking') return;
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
        if (minPrice > 0 && price < minPrice) return false;
        if (maxPrice < 10000 && price > maxPrice) return false;
        return true;
      });

      // Client-side multi-subject filter
      if (selectedSubjects.length > 1) {
        users = users.filter(u => {
          const subs = lookingFor === 'teacher' ? (u.subjects || []) : (u.subjectsNeeded || []);
          return selectedSubjects.some(s => subs.some(us => us.toLowerCase().includes(s.toLowerCase())));
        });
      }

      setResults(users);
      setTotal(users.length);

      // LOG this search to database
      if (userLocation) {
        logSearch(lookingFor, userLocation.lat, userLocation.lng, selectedSubjects.join(','), range);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [lookingFor, userLocation, range, minPrice, maxPrice, selectedSubjects, locationStep]);

  // Fetch search activity near user
  const fetchSearchActivity = useCallback(async () => {
    if (!userLocation) return;
    try {
      const targetLooking = lookingFor === 'teacher' ? 'student' : 'teacher';
      const res = await fetch(`${API_BASE}/api/auth/public/search-activity?lat=${userLocation.lat}&lng=${userLocation.lng}&lookingFor=${targetLooking}`);
      const data = await res.json();
      setSearchActivity(data);
    } catch (err) {}
  }, [userLocation, lookingFor]);

  // Auto-request location on mount
  useEffect(() => { requestLocation(); }, []);

  // Fetch results when location is resolved or filters change
  useEffect(() => { fetchResults(); }, [fetchResults]);
  useEffect(() => { fetchSearchActivity(); }, [fetchSearchActivity]);

  // Cart helpers
  const isInCart = (id) => cart.some(p => p._id === id);
  const toggleCart = (profile) => {
    if (isInCart(profile._id)) {
      setCart(prev => prev.filter(p => p._id !== profile._id));
    } else {
      setCart(prev => [...prev, profile]);
    }
  };

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
  };

  // ─── LOCATION PERMISSION SCREEN ──────────────────────────
  if (locationStep === 'asking') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center justify-center p-6">
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer">
          <ArrowLeft size={20} />
        </button>

        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center max-w-md">
          <div className="w-24 h-24 bg-[#FF6B2B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Navigation size={40} className="text-[#FF6B2B]" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">Enable Location</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We need your location to find {lookingFor === 'teacher' ? 'teachers' : 'students'} near you.
            Your location is used only for search and is never shared publicly.
          </p>

          <button
            onClick={requestLocation}
            className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center mb-4"
          >
            <MapPin size={18} className="mr-2" /> Allow Location Access
          </button>

          <button
            onClick={() => setLocationStep('denied')}
            className="w-full bg-[#1E1E1E] text-gray-400 font-semibold py-3 rounded-2xl border border-gray-800 cursor-pointer hover:text-white transition"
          >
            Skip — show all profiles
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#121212] text-white font-sans">

      {/* ─── NAVBAR ──────────────────────────────────────── */}
      <nav className="sticky top-0 w-full p-3 md:p-4 flex items-center justify-between z-30 bg-[#121212]/95 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-bold text-base md:text-lg">
              {lookingFor === 'teacher' ? '🎓 Teachers' : '📚 Students'} Near You
            </h1>
            <p className="text-xs text-gray-500">
              {loading ? 'Searching...' : `${total} found`}
              {userLocation && ` • ${range}km radius`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`p-2 md:p-2.5 rounded-xl transition cursor-pointer flex items-center text-xs font-semibold ${showFilters ? 'bg-[#FF6B2B] text-white' : 'bg-[#1E1E1E] text-gray-400 border border-gray-800'}`}>
            <SlidersHorizontal size={14} className="mr-1" /> <span className="hidden sm:inline">Filters</span>
            {(selectedSubjects.length > 0 || minPrice > 0 || maxPrice < 10000 || range !== 50) && (
              <span className="ml-1 w-4 h-4 bg-white text-[#121212] rounded-full text-[10px] font-bold flex items-center justify-center">!</span>
            )}
          </button>

          {cart.length > 0 && (
            <button onClick={() => user ? navigate('/my-list') : navigate('/login')}
              className="relative p-2 bg-[#1E1E1E] rounded-xl border border-gray-800 cursor-pointer">
              <Heart size={14} className="text-[#FF6B2B] fill-current" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B2B] rounded-full text-[9px] font-bold flex items-center justify-center">{cart.length}</span>
            </button>
          )}

          <button onClick={() => navigate(`/search?looking=${lookingFor === 'teacher' ? 'student' : 'teacher'}`)}
            className="text-xs bg-[#1E1E1E] px-3 py-2 rounded-xl border border-gray-800 cursor-pointer font-semibold text-gray-400 hover:text-white transition">
            {lookingFor === 'teacher' ? 'Students →' : 'Teachers →'}
          </button>
        </div>
      </nav>

      {/* ─── SEARCH ACTIVITY BANNER ──────────────────────── */}
      {searchActivity && searchActivity.searchesNearby > 0 && (
        <div className="bg-[#FF6B2B]/5 border-b border-[#FF6B2B]/10 px-4 py-2.5 flex items-center justify-center">
          <AlertCircle size={14} className="text-[#FF6B2B] mr-2 flex-shrink-0" />
          <p className="text-xs text-gray-300">
            <span className="text-[#FF6B2B] font-bold">{searchActivity.searchesNearby} people</span> searched for <span className="font-semibold">{lookingFor === 'teacher' ? 'students' : 'teachers'}</span> near you in the last 7 days
          </p>
        </div>
      )}

      {/* ─── FILTER PANEL ────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="bg-[#1A1A1A] border-b border-gray-800 overflow-hidden">
            <div className="max-w-5xl mx-auto p-4 space-y-5">

              {/* Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">📍 Distance</label>
                  <span className="text-[#FF6B2B] font-bold text-sm bg-[#FF6B2B]/10 px-3 py-0.5 rounded-full">{range} km</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setRange(Math.max(1, range - 5))} className="w-9 h-9 bg-[#121212] border border-gray-700 rounded-lg flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer"><Minus size={14} /></button>
                  <input type="range" min="1" max="50" value={range} onChange={(e) => setRange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B2B]" />
                  <button onClick={() => setRange(Math.min(50, range + 5))} className="w-9 h-9 bg-[#121212] border border-gray-700 rounded-lg flex items-center justify-center hover:border-[#FF6B2B] transition cursor-pointer"><Plus size={14} /></button>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">💰 {lookingFor === 'teacher' ? 'Fee' : 'Budget'}</label>
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

              {/* Subjects */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">📚 Subject</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SUBJECTS.map(sub => (
                    <button key={sub} onClick={() => toggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${selectedSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {(selectedSubjects.length > 0 || minPrice > 0 || maxPrice < 10000 || range !== 50) && (
                <button onClick={() => { setSelectedSubjects([]); setMinPrice(0); setMaxPrice(10000); setRange(50); }}
                  className="text-xs text-gray-500 hover:text-[#FF6B2B] cursor-pointer flex items-center">
                  <RotateCcw size={12} className="mr-1" /> Reset all filters
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
            <p className="text-gray-400 text-sm">Scanning {range}km radius...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
              <MapPin size={32} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">No {lookingFor}s found</h2>
            <p className="text-gray-400 text-sm mb-4 max-w-sm">Try increasing range or removing filters.</p>
            <button onClick={() => { setRange(50); setSelectedSubjects([]); setMinPrice(0); setMaxPrice(10000); }}
              className="bg-[#FF6B2B] px-6 py-2 rounded-full font-bold text-sm cursor-pointer hover:scale-105 transition">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((person, i) => (
              <motion.div key={person._id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-5 hover:border-[#FF6B2B]/30 transition group">

                <div onClick={() => setSelectedProfile(person)} className="cursor-pointer">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                      {person.photo ? <img src={person.photo} alt="" className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-gray-500" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{person.name || 'User'}</div>
                      <div className="text-xs text-gray-500 capitalize flex items-center">
                        {lookingFor}
                        {person.isSubscribed && <span className="ml-2 text-[#FF6B2B]"><Star size={10} className="inline fill-current" /> Verified</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visible: subject + price */}
                <div className="bg-[#121212] rounded-xl p-3 space-y-2 mb-4 border border-gray-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Teaches' : 'Needs'}</span>
                    <span className="text-white font-semibold text-right truncate max-w-[170px]">
                      {lookingFor === 'teacher' ? (person.subjects?.join(', ') || 'All') : (person.subjectsNeeded?.join(', ') || 'All')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Fee' : 'Budget'}</span>
                    <span className="text-[#FF6B2B] font-bold">₹{lookingFor === 'teacher' ? (person.chargePerMonth || '—') : (person.budgetPerMonth || '—')}/mo</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button onClick={() => toggleCart(person)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center justify-center border ${isInCart(person._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border-[#FF6B2B]/30' : 'bg-[#252525] text-gray-300 border-gray-800 hover:border-[#FF6B2B]/30'}`}>
                    <Heart size={14} className={`mr-1.5 ${isInCart(person._id) ? 'fill-current' : ''}`} />
                    {isInCart(person._id) ? 'Saved ✓' : 'Add to List'}
                  </button>

                  <button onClick={() => {
                    if (!user) navigate('/login');
                    else {
                      sendPing(person._id, lookingFor, '');
                      alert(`Request successfully sent to ${person.name || 'user'}!`);
                    }
                  }}
                    className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-[#FF6B2B] hover:bg-[#e85a1f] text-white transition cursor-pointer flex items-center">
                    <Send size={14} className="mr-1" /> Request
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── PROFILE DETAIL / UPSELL ─────────────────────── */}
      <AnimatePresence>
        {selectedProfile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)} className="fixed inset-0 bg-black/60 z-[500]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-[501] bg-[#1A1A1A] border-t border-gray-800 rounded-t-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border-2 border-[#FF6B2B]">
                      {selectedProfile.photo ? <img src={selectedProfile.photo} alt="" className="w-full h-full object-cover" /> :
                        <div className="w-full h-full flex items-center justify-center"><User size={28} className="text-[#FF6B2B]" /></div>}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{lookingFor}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProfile(null)} className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer"><X size={18} /></button>
                </div>

                {/* Visible */}
                <div className="bg-[#121212] rounded-xl p-4 border border-gray-800 space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Subjects' : 'Needs'}</span>
                    <span className="text-white font-bold text-right">
                      {lookingFor === 'teacher' ? (selectedProfile.subjects?.join(', ') || 'All') : (selectedProfile.subjectsNeeded?.join(', ') || 'All')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-800 pt-2">
                    <span className="text-gray-500">{lookingFor === 'teacher' ? 'Fee' : 'Budget'}</span>
                    <span className="text-[#FF6B2B] font-bold">₹{lookingFor === 'teacher' ? (selectedProfile.chargePerMonth || '—') : (selectedProfile.budgetPerMonth || '—')}/mo</span>
                  </div>
                </div>

                {/* Locked */}
                <div className="relative bg-[#121212] rounded-xl p-4 border border-gray-800 mb-6">
                  <div className="blur-sm select-none pointer-events-none space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Qualifications</span><span>B.Ed, M.Sc...</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Experience</span><span>5 years...</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Bio</span><span>I love teaching...</span></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212]/80 rounded-xl">
                    <Lock size={24} className="text-[#FF6B2B] mb-2" />
                    <p className="text-sm font-bold mb-1">Full details locked</p>
                    <p className="text-xs text-gray-400">Subscribe to see everything & message</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => toggleCart(selectedProfile)}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer border ${isInCart(selectedProfile._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border-[#FF6B2B]/30' : 'bg-[#1E1E1E] text-white border-gray-800'}`}>
                    <Heart size={16} className={`mr-2 ${isInCart(selectedProfile._id) ? 'fill-current' : ''}`} />
                    {isInCart(selectedProfile._id) ? 'In Your List ✓' : 'Add to List'}
                  </button>

                  <button onClick={() => navigate(user ? '/' : '/login')}
                    className="w-full bg-gradient-to-r from-[#FF6B2B] to-[#FF8F5E] py-3 rounded-xl font-bold flex items-center justify-center cursor-pointer transition hover:scale-[1.01]">
                    <Crown size={16} className="mr-2" /> {user ? 'Subscribe to Connect & Message' : 'Sign Up & Subscribe'}
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
