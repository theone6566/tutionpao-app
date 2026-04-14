import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { BookOpen, MapPin, Users, CheckCircle, ArrowRight, Zap, Shield, Search, Heart, Crown } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  // Cart badge
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const saved = localStorage.getItem('tutionpao_cart');
    if (saved) setCartCount(JSON.parse(saved).length);
  }, []);

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
          {cartCount > 0 && (
            <button onClick={() => user ? navigate('/my-list') : navigate('/login')}
              className="relative p-2 bg-[#1E1E1E] rounded-full border border-gray-800 hover:border-[#FF6B2B] transition cursor-pointer">
              <Heart size={18} className="text-[#FF6B2B] fill-current" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B2B] rounded-full text-xs font-bold flex items-center justify-center">{cartCount}</span>
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-4 inline-block px-4 py-1.5 rounded-full border border-[#FF6B2B]/30 bg-[#FF6B2B]/10 text-[#FF6B2B] text-sm font-semibold tracking-wide">
            INDIA'S #1 TUITION MATCHING PLATFORM
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl">
            The Smartest Way to <br className="hidden md:block" />
            <span className="text-[#FF6B2B]">Find or Teach.</span>
          </h1>

          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with verified tutors or students near you. Browse free — subscribe to connect.
          </p>

          {/* ─── SIMPLE SEARCH: Just pick who you want ───────── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-lg mx-auto mb-12"
          >
            <div className="flex items-center justify-center mb-3">
              <Search size={18} className="text-[#FF6B2B] mr-2" />
              <span className="text-gray-400 text-sm font-semibold">Who are you looking for?</span>
              <span className="ml-2 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-bold">FREE</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/search?looking=teacher')}
                className="bg-[#1E1E1E]/80 backdrop-blur-xl border-2 border-gray-800 hover:border-[#FF6B2B] rounded-2xl p-6 text-center group transition-all hover:shadow-[0_0_40px_rgba(255,107,43,0.15)] cursor-pointer"
              >
                <div className="bg-[#FF6B2B]/10 p-4 rounded-2xl inline-block mb-3 group-hover:bg-[#FF6B2B] transition">
                  <BookOpen size={32} className="text-[#FF6B2B] group-hover:text-white" />
                </div>
                <div className="font-bold text-lg mb-1">Find Teachers</div>
                <div className="text-xs text-gray-500">Browse tutors near you</div>
              </button>

              <button
                onClick={() => navigate('/search?looking=student')}
                className="bg-[#1E1E1E]/80 backdrop-blur-xl border-2 border-gray-800 hover:border-[#FF6B2B] rounded-2xl p-6 text-center group transition-all hover:shadow-[0_0_40px_rgba(255,107,43,0.15)] cursor-pointer"
              >
                <div className="bg-[#FF6B2B]/10 p-4 rounded-2xl inline-block mb-3 group-hover:bg-[#FF6B2B] transition">
                  <Users size={32} className="text-[#FF6B2B] group-hover:text-white" />
                </div>
                <div className="font-bold text-lg mb-1">Find Students</div>
                <div className="text-xs text-gray-500">Browse students near you</div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ─── TWO PLANS ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-16 px-4">
          <motion.div initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            className="bg-[#1E1E1E]/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-left relative overflow-hidden group hover:border-[#FF6B2B]/50 transition-all hover:shadow-[0_0_60px_rgba(255,107,43,0.15)]">
            <div className="flex items-center mb-4">
              <div className="bg-[#FF6B2B]/10 p-3 rounded-xl mr-3"><BookOpen size={24} className="text-[#FF6B2B]" /></div>
              <h3 className="text-[#FF6B2B] font-bold text-xl">Student Plan</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">₹49 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
            <p className="text-gray-400 text-sm mb-6">Unlock messaging and connect with verified teachers.</p>
            <ul className="space-y-3 mb-8">
              {['Browse all tutors free', 'View profiles & subjects', 'Send connection requests', 'Chat with accepted tutors', 'Save tutors to your list'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300"><CheckCircle size={16} className="text-[#FF6B2B] mr-2 flex-shrink-0" />{item}</li>
              ))}
            </ul>
            <button onClick={() => navigate('/login', { state: { role: 'student' } })} className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center">
              Start as Student <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>

          <motion.div initial={{ x: 30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
            className="bg-[#1E1E1E]/70 backdrop-blur-xl border border-[#FF6B2B]/30 rounded-3xl p-8 text-left relative overflow-hidden group hover:border-[#FF6B2B] transition-all hover:shadow-[0_0_60px_rgba(255,107,43,0.2)]">
            <div className="absolute top-0 right-0 bg-[#FF6B2B] text-xs font-bold px-4 py-1.5 rounded-bl-2xl">POPULAR</div>
            <div className="flex items-center mb-4">
              <div className="bg-[#FF6B2B]/10 p-3 rounded-xl mr-3"><Users size={24} className="text-[#FF6B2B]" /></div>
              <h3 className="text-white font-bold text-xl">Teacher Plan</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">₹199 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
            <p className="text-gray-400 text-sm mb-6">Grow your tuition base. Connect with students nearby.</p>
            <ul className="space-y-3 mb-8">
              {['Browse all students free', 'View requirements & budget', 'Send connection requests', 'Receive enquiries', 'Priority listing'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300"><CheckCircle size={16} className="text-[#FF6B2B] mr-2 flex-shrink-0" />{item}</li>
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
          <p className="text-gray-400 text-center mb-12 text-sm">Simple 3-step process</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Search Free', desc: 'Browse teachers or students nearby. See profiles, subjects, and prices for free.', step: '01' },
              { icon: Shield, title: 'Subscribe & Verify', desc: 'Subscribe to send requests. Verify with Aadhaar OTP for trust.', step: '02' },
              { icon: Zap, title: 'Connect Direct', desc: 'Send requests, chat, and negotiate. No middleman!', step: '03' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-[#1E1E1E]/50 backdrop-blur border border-gray-800 rounded-3xl p-8 text-center relative group hover:border-[#FF6B2B]/30 transition">
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
            { value: '5K+', label: 'Teachers', desc: 'Verified educators' },
            { value: '1 Lakh+', label: 'Reach', desc: 'Monthly interactions' },
            { value: '4.8★', label: 'Rating', desc: 'Top rated platform' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center bg-[#1E1E1E]/40 backdrop-blur rounded-3xl p-8 border border-gray-800/50 hover:border-[#FF6B2B]/30 transition">
              <div className="text-4xl md:text-5xl font-black text-[#FF6B2B] mb-2">{stat.value}</div>
              <div className="text-lg font-bold text-white mb-2">{stat.label}</div>
              <p className="text-gray-400 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── CTA ───────────────────────────────────────────── */}
        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
          className="w-full max-w-4xl bg-gradient-to-r from-[#FF6B2B] to-[#FF8F5E] rounded-3xl p-8 md:p-12 text-center mb-16 mx-4">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Join thousands using TutionPao.</p>
          <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="bg-white text-[#FF6B2B] font-bold text-lg px-10 py-4 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl cursor-pointer">
            {user ? 'Open Dashboard 📍' : 'Sign Up Free →'}
          </button>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full py-8 border-t border-gray-800 bg-[#0f0f0f] mt-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold text-[#FF6B2B] tracking-tight mb-1">TutionPao<span className="text-white">.com</span></div>
            <p className="text-gray-500 text-xs">© 2025 TutionPao. All rights reserved.</p>
          </div>
          <p className="text-gray-500 text-sm font-medium">Founded by <span className="text-white font-bold">ANUJ MISHRA</span></p>
        </div>
      </footer>
    </motion.div>
  );
}
