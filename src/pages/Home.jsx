import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import MockPaymentGateway from '../components/MockPaymentGateway';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [paymentPlan, setPaymentPlan] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-[#121212] text-white font-sans overflow-hidden"
    >
      <MockPaymentGateway 
        isOpen={!!paymentPlan} 
        onClose={() => setPaymentPlan(null)} 
        plan={paymentPlan?.name} 
        price={paymentPlan?.price}
      />
      <AnimatedBackground />
      
      {/* Navbar */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="text-2xl font-bold text-[#FF6B2B] tracking-tight">
          TutionPao<span className="text-white">.com</span>
        </div>
        <div>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="text-white font-semibold hover:text-[#FF6B2B] transition-colors">
              Go to Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-[#1E1E1E] hover:bg-gray-800 text-white px-6 py-2 rounded-full border border-gray-800 transition-colors cursor-pointer">
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-4 inline-block px-4 py-1.5 rounded-full border border-[#FF6B2B]/30 bg-[#FF6B2B]/10 text-[#FF6B2B] text-sm font-semibold tracking-wide">
          WELCOME TO TUTIONPAO.COM
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl">
          The Smartest Way to <br/>
          <span className="text-[#FF6B2B]">Find or Teach.</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          India's first live-matching tuition platform. Connect with tutors or students within your 5km radius instantly. Skip the middleman, negotiate directly.
        </p>

        <button 
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className="bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold text-lg px-10 py-5 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,107,43,0.3)] shadow-[#FF6B2B]/20 cursor-pointer"
        >
          {user ? 'Open Live Map 📍' : 'Get Started Now'}
        </button>

        {/* Pricing Peek */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <div 
            onClick={() => setPaymentPlan({ name: 'Student', price: 49 })}
            className="bg-[#1E1E1E]/60 backdrop-blur border border-gray-800 rounded-3xl p-6 text-left relative overflow-hidden group hover:border-[#FF6B2B]/50 transition cursor-pointer"
          >
            <h3 className="text-[#FF6B2B] font-bold text-xl mb-1">Student Plan</h3>
            <div className="text-3xl font-extrabold text-white mb-3">₹49 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
            <p className="text-gray-400 text-sm mb-4">Perfect for students. Unlock direct messaging and connect with up to 5 verified teachers in your area.</p>
            <button className="text-sm font-bold text-white group-hover:text-[#FF6B2B] transition underline">Subscribe Now</button>
          </div>
          <div 
            onClick={() => setPaymentPlan({ name: 'Tutor', price: 199 })}
            className="bg-[#1E1E1E]/60 backdrop-blur border border-[#FF6B2B]/20 rounded-3xl p-6 text-left relative overflow-hidden group hover:border-[#FF6B2B] transition cursor-pointer"
          >
            <div className="absolute top-0 right-0 bg-[#FF6B2B] text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
            <h3 className="text-white font-bold text-xl mb-1">Tutor Plan</h3>
            <div className="text-3xl font-extrabold text-white mb-3">₹199 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
            <p className="text-gray-400 text-sm mb-4">Grow your tuition base. Connect with up to 10 paying students nearby and manage requests effortlessly.</p>
            <button className="text-sm font-bold text-white group-hover:text-[#FF6B2B] transition underline">Subscribe Now</button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full border-t border-gray-800 pt-16 relative">
          {/* Decorative blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#FF6B2B]/10 blur-[100px] pointer-events-none"></div>

          <div className="text-center bg-[#1E1E1E]/40 backdrop-blur rounded-3xl p-8 border border-gray-800/50 hover:border-[#FF6B2B]/30 transition">
            <div className="text-5xl font-black text-[#FF6B2B] mb-2">5K+</div>
            <div className="text-xl font-bold text-white mb-2">Teachers Teaching</div>
            <p className="text-gray-400 text-sm">Verified educators are actively teaching through TutionPao.com across the region.</p>
          </div>

          <div className="text-center bg-[#1E1E1E]/40 backdrop-blur rounded-3xl p-8 border border-gray-800/50 hover:border-[#FF6B2B]/30 transition">
            <div className="text-5xl font-black text-[#FF6B2B] mb-2">1 Lakh+</div>
            <div className="text-xl font-bold text-white mb-2">Monthly Reach</div>
            <p className="text-gray-400 text-sm">Students and parents interacting with our platform every single month.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 border-t border-gray-800 bg-[#0f0f0f] mt-12 text-center">
        <div className="text-2xl font-bold text-[#FF6B2B] tracking-tight mb-2 opacity-50">
          TutionPao<span className="text-white">.com</span>
        </div>
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Founder <span className="text-white font-bold text-lg block mt-1">ANUJ MISHRA</span>
        </p>
      </footer>
    </motion.div>
  );
}
