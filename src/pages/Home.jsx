import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Users, CheckCircle, ArrowRight, Zap, Shield, Search, User, Heart, Crown, X, ChevronRight, Star } from 'lucide-react';

const API_BASE = "https://tutionpao-backend-production.up.railway.app";

export default function Home() {
  const navigate = useNavigate();
  const { user, role } = useAppContext();

  // Search Nearby state
  const [showSearch, setShowSearch] = useState(false);
  const [searchRole, setSearchRole] = useState('teacher'); // what they're looking for
  const [searchSubject, setSearchSubject] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  // Cart (stored in localStorage for non-logged-in users)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tutionpao_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tutionpao_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (profile) => {
    if (cart.some(p => p._id === profile._id)) return;
    setCart(prev => [...prev, profile]);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p._id !== id));
  };

  const isInCart = (id) => cart.some(p => p._id === id);

  // Search Nearby handler
  const handleSearch = async () => {
    setSearching(true);
    setSearchDone(false);
    try {
      let url = `${API_BASE}/api/auth/public/browse?role=${searchRole}&limit=20`;

      // Try to get user's location
      if (navigator.geolocation) {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, () => reject('no loc'), { timeout: 5000 });
        }).catch(() => null);

        if (pos) {
          url += `&lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&maxDistance=10000`;
        }
      }

      if (searchSubject) {
        url += `&subject=${encodeURIComponent(searchSubject)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.users || []);
      setSearchDone(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setSearchDone(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-[#121212] text-white font-sans overflow-hidden"
    >
      <AnimatedBackground />

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav className="sticky top-0 w-full p-4 md:p-6 flex justify-between items-center z-30 bg-[#121212]/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="text-2xl font-bold text-[#FF6B2B] tracking-tight">
          TutionPao<span className="text-white">.com</span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Cart indicator */}
          {cart.length > 0 && (
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  navigate('/my-list');
                }
              }}
              className="relative p-2 bg-[#1E1E1E] rounded-full border border-gray-800 hover:border-[#FF6B2B] transition cursor-pointer"
            >
              <Heart size={18} className="text-[#FF6B2B] fill-current" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B2B] rounded-full text-xs font-bold flex items-center justify-center">{cart.length}</span>
            </button>
          )}

          {user ? (
            <button onClick={() => navigate('/dashboard')} className="bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-semibold px-5 py-2 rounded-full transition-all hover:scale-105 cursor-pointer text-sm">
              Dashboard →
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-[#1E1E1E] hover:bg-gray-800 text-white px-5 py-2 rounded-full border border-gray-800 transition-colors cursor-pointer text-sm">
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center px-4 text-center">

        {/* ─── HERO ──────────────────────────────────────────── */}
        <div className="pt-12 pb-8 md:pt-20 md:pb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 inline-block px-4 py-1.5 rounded-full border border-[#FF6B2B]/30 bg-[#FF6B2B]/10 text-[#FF6B2B] text-sm font-semibold tracking-wide"
          >
            INDIA'S #1 TUITION MATCHING PLATFORM
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl">
            The Smartest Way to <br className="hidden md:block" />
            <span className="text-[#FF6B2B]">Find or Teach.</span>
          </h1>

          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with verified tutors or students within 5km. Browse profiles free — subscribe to connect.
          </p>

          {/* ─── SEARCH NEARBY (PUBLIC) ──────────────────────── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-2xl mx-auto bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-5 shadow-2xl mb-8"
          >
            <div className="flex items-center mb-4">
              <Search size={20} className="text-[#FF6B2B] mr-2" />
              <h3 className="font-bold text-lg">Search Nearby</h3>
              <span className="ml-auto text-xs text-gray-500 bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-semibold">FREE</span>
            </div>

            {/* Who are you looking for? */}
            <div className="flex bg-[#121212] rounded-2xl p-1 mb-4">
              <button
                onClick={() => setSearchRole('teacher')}
                className={`flex-1 py-3 text-center rounded-xl font-semibold transition cursor-pointer text-sm ${searchRole === 'teacher' ? 'bg-[#FF6B2B] text-white' : 'text-gray-500'}`}
              >
                🎓 Find Teachers
              </button>
              <button
                onClick={() => setSearchRole('student')}
                className={`flex-1 py-3 text-center rounded-xl font-semibold transition cursor-pointer text-sm ${searchRole === 'student' ? 'bg-[#FF6B2B] text-white' : 'text-gray-500'}`}
              >
                📚 Find Students
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-[#121212] flex items-center px-4 rounded-xl border border-gray-800 focus-within:border-[#FF6B2B] transition">
                <Search className="text-gray-500 mr-2" size={16} />
                <input
                  type="text"
                  placeholder="Subject (e.g. Maths, Physics)"
                  className="w-full bg-transparent py-3 outline-none text-white placeholder-gray-500 text-sm"
                  value={searchSubject}
                  onChange={(e) => setSearchSubject(e.target.value)}
                />
              </div>
              <div className="bg-[#121212] flex items-center px-4 rounded-xl border border-gray-800 focus-within:border-[#FF6B2B] transition">
                <MapPin className="text-gray-500 mr-2" size={16} />
                <input
                  type="text"
                  placeholder="Location (auto-detects)"
                  className="w-full bg-transparent py-3 outline-none text-white placeholder-gray-500 text-sm"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={searching}
              className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-3.5 rounded-xl transition-transform hover:scale-[1.01] active:scale-95 flex justify-center items-center cursor-pointer ${searching ? 'opacity-70 animate-pulse' : ''}`}
            >
              {searching ? (
                <>
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  Searching...
                </>
              ) : (
                <><MapPin className="mr-2" size={18} /> Search Nearby</>
              )}
            </button>
          </motion.div>
        </div>

        {/* ─── SEARCH RESULTS (PUBLIC) ───────────────────────── */}
        <AnimatePresence>
          {searchDone && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-4xl mb-12"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">
                  {searchResults.length} {searchRole === 'teacher' ? 'Teachers' : 'Students'} Found
                </h3>
                <button onClick={() => { setSearchDone(false); setSearchResults([]); }} className="text-gray-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-8 text-center">
                  <p className="text-gray-400 mb-2">No {searchRole}s found nearby yet.</p>
                  <p className="text-gray-500 text-sm">Be the first! <span onClick={() => navigate('/login')} className="text-[#FF6B2B] cursor-pointer underline">Sign up now</span></p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((person, i) => (
                    <motion.div
                      key={person._id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#1E1E1E]/80 backdrop-blur border border-gray-800 rounded-2xl p-5 hover:border-[#FF6B2B]/30 transition group"
                    >
                      {/* Profile pic + name */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                          {person.photo ? (
                            <img src={person.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-gray-500" /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold truncate">{person.name || 'User'}</div>
                          <div className="text-xs text-gray-400 capitalize">{searchRole}</div>
                        </div>
                      </div>

                      {/* Limited details - subjects & price */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {searchRole === 'teacher' ? 'Teaches' : 'Needs'}
                          </span>
                          <span className="text-white font-semibold text-right truncate max-w-[180px]">
                            {searchRole === 'teacher'
                              ? (person.subjects?.join(', ') || 'All subjects')
                              : (person.subjectsNeeded?.join(', ') || 'All subjects')
                            }
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {searchRole === 'teacher' ? 'Fee' : 'Budget'}
                          </span>
                          <span className="text-[#FF6B2B] font-bold">
                            ₹{searchRole === 'teacher'
                              ? (person.chargePerMonth || '—')
                              : (person.budgetPerMonth || '—')
                            }/mo
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => isInCart(person._id) ? removeFromCart(person._id) : addToCart(person)}
                          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer flex items-center justify-center ${isInCart(person._id) ? 'bg-[#FF6B2B]/20 text-[#FF6B2B] border border-[#FF6B2B]/30' : 'bg-[#252525] text-gray-300 hover:text-[#FF6B2B] border border-gray-800 hover:border-[#FF6B2B]/30'}`}
                        >
                          <Heart size={14} className={`mr-1 ${isInCart(person._id) ? 'fill-current' : ''}`} />
                          {isInCart(person._id) ? 'Saved' : 'Add to List'}
                        </button>

                        <button
                          onClick={() => {
                            if (!user) {
                              navigate('/login');
                            } else if (!user.isSubscribed) {
                              alert("Subscribe to view full details and connect!");
                            } else {
                              navigate('/dashboard');
                            }
                          }}
                          className="py-2.5 px-4 rounded-xl font-semibold text-sm bg-[#FF6B2B] hover:bg-[#e85a1f] text-white transition cursor-pointer flex items-center"
                        >
                          View <ChevronRight size={14} className="ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Upsell */}
              {searchResults.length > 0 && !user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 bg-gradient-to-r from-[#FF6B2B]/10 to-[#FF6B2B]/5 border border-[#FF6B2B]/20 rounded-2xl p-6 text-center"
                >
                  <Crown size={24} className="text-[#FF6B2B] mx-auto mb-2" />
                  <p className="text-sm text-gray-300 mb-3">
                    <span className="text-white font-bold">Sign up & subscribe</span> to view full details, send requests, and connect directly.
                  </p>
                  <button onClick={() => navigate('/login')} className="bg-[#FF6B2B] text-white font-bold px-6 py-2 rounded-full cursor-pointer hover:scale-105 transition text-sm">
                    Get Started →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── THE TWO PLANS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-16 px-4">
          {/* STUDENT PLAN */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#1E1E1E]/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-left relative overflow-hidden group hover:border-[#FF6B2B]/50 transition-all hover:shadow-[0_0_60px_rgba(255,107,43,0.15)]"
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#FF6B2B]/10 p-3 rounded-xl mr-3"><BookOpen size={24} className="text-[#FF6B2B]" /></div>
              <h3 className="text-[#FF6B2B] font-bold text-xl">Student Plan</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">₹49 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
            <p className="text-gray-400 text-sm mb-6">Unlock direct messaging and connect with verified teachers.</p>
            <ul className="space-y-3 mb-8">
              {['Browse all tutors on map', 'View detailed tutor profiles', 'Send connection requests', 'Chat with matched tutors', 'Add tutors to your list'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                  <CheckCircle size={16} className="text-[#FF6B2B] mr-2 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/login', { state: { role: 'student' } })} className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center">
              Start as Student <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>

          {/* TEACHER PLAN */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#1E1E1E]/70 backdrop-blur-xl border border-[#FF6B2B]/30 rounded-3xl p-8 text-left relative overflow-hidden group hover:border-[#FF6B2B] transition-all hover:shadow-[0_0_60px_rgba(255,107,43,0.2)]"
          >
            <div className="absolute top-0 right-0 bg-[#FF6B2B] text-xs font-bold px-4 py-1.5 rounded-bl-2xl">POPULAR</div>
            <div className="flex items-center mb-4">
              <div className="bg-[#FF6B2B]/10 p-3 rounded-xl mr-3"><Users size={24} className="text-[#FF6B2B]" /></div>
              <h3 className="text-white font-bold text-xl">Teacher Plan</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">₹199 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
            <p className="text-gray-400 text-sm mb-6">Grow your tuition base. Connect with students nearby.</p>
            <ul className="space-y-3 mb-8">
              {['Browse all students on map', 'View student requirements', 'Send connection requests', 'Receive direct enquiries', 'Priority listing on search'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                  <CheckCircle size={16} className="text-[#FF6B2B] mr-2 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/login', { state: { role: 'teacher' } })} className="w-full bg-white hover:bg-gray-100 text-[#121212] font-bold py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center">
              Start as Teacher <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>
        </div>

        {/* ─── HOW IT WORKS ──────────────────────────────────── */}
        <div className="w-full max-w-5xl px-4 mb-24">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">How <span className="text-[#FF6B2B]">TutionPao</span> Works</h2>
          <p className="text-gray-400 text-center mb-12 text-sm">Simple 3-step process to find your perfect match</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Sign Up & Verify', desc: 'Create your account with real OTP login. Subscribe to unlock with Aadhaar verification for trust.', step: '01' },
              { icon: MapPin, title: 'Browse the Live Map', desc: 'See real profile pictures of students & teachers within 5km on an interactive map.', step: '02' },
              { icon: Zap, title: 'Connect & Learn', desc: 'Add profiles to your list, send connection requests, and negotiate directly.', step: '03' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-[#1E1E1E]/50 backdrop-blur border border-gray-800 rounded-3xl p-8 text-center relative group hover:border-[#FF6B2B]/30 transition"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FF6B2B] text-white text-xs font-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg">{item.step}</div>
                <div className="bg-[#FF6B2B]/10 p-4 rounded-2xl inline-block mb-4 mt-2"><item.icon size={32} className="text-[#FF6B2B]" /></div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── STATS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full border-t border-gray-800 pt-16 pb-16 relative px-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#FF6B2B]/10 blur-[100px] pointer-events-none"></div>
          {[
            { value: '5K+', label: 'Teachers', desc: 'Verified educators across India' },
            { value: '1 Lakh+', label: 'Reach', desc: 'Monthly interactions' },
            { value: '4.8★', label: 'Rating', desc: 'Highly rated platform' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center bg-[#1E1E1E]/40 backdrop-blur rounded-3xl p-8 border border-gray-800/50 hover:border-[#FF6B2B]/30 transition"
            >
              <div className="text-4xl md:text-5xl font-black text-[#FF6B2B] mb-2">{stat.value}</div>
              <div className="text-lg font-bold text-white mb-2">{stat.label}</div>
              <p className="text-gray-400 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl bg-gradient-to-r from-[#FF6B2B] to-[#FF8F5E] rounded-3xl p-8 md:p-12 text-center mb-16 mx-4"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Join thousands already using TutionPao to connect and grow.</p>
          <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="bg-white text-[#FF6B2B] font-bold text-lg px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl cursor-pointer">
            {user ? 'Open Dashboard 📍' : 'Sign Up Free →'}
          </button>
        </motion.div>
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="relative z-10 w-full py-8 border-t border-gray-800 bg-[#0f0f0f] mt-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold text-[#FF6B2B] tracking-tight mb-1">TutionPao<span className="text-white">.com</span></div>
            <p className="text-gray-500 text-xs">© 2025 TutionPao. All rights reserved.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm font-medium">Founded by <span className="text-white font-bold">ANUJ MISHRA</span></p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
