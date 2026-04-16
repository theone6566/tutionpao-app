import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, CheckCircle, ArrowRight, Shield, Phone, Loader, X, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Pricing() {
  const navigate = useNavigate();
  const { user, sendOtp, verifyOtp, initiatePayment, updateLocation } = useAppContext();

  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // { type: 'student'|'teacher', amount: number }

  // Auth steps inside modal
  const [checkoutStep, setCheckoutStep] = useState('phone'); // 'phone' | 'otp' | 'paying' | 'success'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [mockOtpValue, setMockOtpValue] = useState(null);

  const handleSelectPlan = (planType, amount) => {
    if (user) {
      // Already logged in — go straight to payment
      handlePayment(planType, amount);
      return;
    }
    setSelectedPlan({ type: planType, amount });
    setShowCheckout(true);
    setCheckoutStep('phone');
    setPhone('');
    setOtp('');
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (phone.length < 10) return alert("Enter a valid 10-digit mobile number");
    setLoading(true);
    try {
      const data = await sendOtp(phone, selectedPlan.type);
      setIsMock(data.mock || false);
      setMockOtpValue(data.mockOtp || null);
      setCheckoutStep('otp');
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP + auto-create account
  const handleVerifyOtp = async () => {
    if (otp.length < 4) return alert("Enter the OTP you received");
    setLoading(true);
    try {
      // Get location silently
      let lat, lng;
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) { /* location denied, continue anyway */ }

      // Auto-name based on role
      const autoName = selectedPlan.type === 'teacher' ? 'Teacher' : 'Student';
      await verifyOtp(phone, otp, autoName, selectedPlan.type, null, lat, lng);

      // Now trigger payment
      setCheckoutStep('paying');
      await handlePayment(selectedPlan.type, selectedPlan.amount);
    } catch (err) {
      alert(err.message || "Invalid OTP. Please check and try again.");
      setLoading(false);
    }
  };

  // Payment via Razorpay
  const handlePayment = async (planType, amount) => {
    try {
      setLoading(true);
      await initiatePayment(amount, planType);
      setCheckoutStep('success');
      setLoading(false);

      // Capture location one more time and save
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        updateLocation(pos.coords.latitude, pos.coords.longitude);
      } catch(e) {}

      // Brief "Welcome" then redirect to dashboard
      setTimeout(() => {
        setShowCheckout(false);
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      alert("Payment failed: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF6B2B]/40 via-[#121212] to-[#121212]"></div>

      {/* Back button */}
      <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition z-20 cursor-pointer">
        <ArrowLeft size={20} />
      </button>

      <div className="relative z-10 w-full max-w-4xl text-center mb-10 mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Choose Your <span className="text-[#FF6B2B]">Plan</span></h1>
        <p className="text-gray-400 text-lg">Unlock full access to the TutionPao network.</p>

        {!user && (
          <div className="mt-4 inline-flex items-center text-sm bg-[#FF6B2B]/10 text-[#FF6B2B] px-4 py-2 rounded-full font-medium">
            <Shield size={16} className="mr-2" /> Quick signup with mobile number — takes 30 seconds
          </div>
        )}
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {/* Student Plan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 flex flex-col group hover:border-[#FF6B2B]/50 transition-all shadow-xl"
        >
          <div className="flex items-center mb-4">
            <div className="bg-[#FF6B2B]/10 p-3 rounded-xl mr-3"><BookOpen size={24} className="text-[#FF6B2B]" /></div>
            <h3 className="text-[#FF6B2B] font-bold text-xl">Student Plan</h3>
          </div>
          <div className="text-4xl font-extrabold text-white mb-2">₹49 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
          <p className="text-gray-400 text-sm mb-6">Unlock messaging and connect with verified teachers.</p>

          <ul className="space-y-3 mb-8 flex-1">
            {['Browse all tutors free', 'View profiles & subjects', 'Send connection requests', 'Chat with accepted tutors', 'Save tutors to your list'].map((item, i) => (
              <li key={i} className="flex items-center text-sm text-gray-300">
                <CheckCircle size={16} className="text-[#FF6B2B] mr-3 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSelectPlan('student', 49)}
            className="w-full bg-[#1E1E1E] border-2 border-[#FF6B2B] text-[#FF6B2B] hover:bg-[#FF6B2B] hover:text-white font-bold py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center"
          >
            Subscribe as Student <ArrowRight size={18} className="ml-2" />
          </button>
        </motion.div>

        {/* Teacher Plan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1E1E1E]/90 backdrop-blur-xl border-2 border-[#FF6B2B] rounded-3xl p-8 flex flex-col relative group transition-all shadow-[0_0_30px_rgba(255,107,43,0.15)]"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6B2B] text-[#121212] text-xs font-black px-6 py-1.5 rounded-full tracking-wide">
            MOST POPULAR
          </div>
          <div className="flex items-center mb-4 mt-2">
            <div className="bg-[#FF6B2B]/20 p-3 rounded-xl mr-3"><Users size={24} className="text-[#FF6B2B]" /></div>
            <h3 className="text-white font-bold text-xl">Teacher Plan</h3>
          </div>
          <div className="text-4xl font-extrabold text-white mb-2">₹199 <span className="text-sm text-gray-500 font-normal">/ month</span></div>
          <p className="text-gray-400 text-sm mb-6">Grow your tuition base. Connect with students nearby.</p>

          <ul className="space-y-3 mb-8 flex-1">
            {['Browse all students free', 'View requirements & budget', 'Send connection requests', 'Receive enquiries', 'Priority listing'].map((item, i) => (
              <li key={i} className="flex items-center text-sm text-gray-300">
                <CheckCircle size={16} className="text-[#FF6B2B] mr-3 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSelectPlan('teacher', 199)}
            className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center shadow-lg"
          >
            Subscribe as Teacher <ArrowRight size={18} className="ml-2" />
          </button>
        </motion.div>
      </div>

      {/* ─── FAST CHECKOUT MODAL ───────────────────────────────── */}
      <AnimatePresence>
        {showCheckout && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => { if (!loading) setShowCheckout(false); }}
            />
            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-sm bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6 shadow-2xl">
                {!loading && checkoutStep !== 'success' && (
                  <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 p-1.5 bg-[#121212] rounded-full hover:bg-gray-800 transition cursor-pointer">
                    <X size={16} />
                  </button>
                )}

                {/* Progress dots */}
                <div className="flex justify-center space-x-2 mb-6">
                  {['phone', 'otp', 'paying', 'success'].map((s, i) => (
                    <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all ${
                      s === checkoutStep ? 'bg-[#FF6B2B] scale-125' :
                      ['phone','otp','paying','success'].indexOf(checkoutStep) > i ? 'bg-[#FF6B2B]/50' : 'bg-gray-700'
                    }`} />
                  ))}
                </div>

                {/* STEP: Phone */}
                {checkoutStep === 'phone' && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#FF6B2B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone size={28} className="text-[#FF6B2B]" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Enter Mobile Number</h3>
                    <p className="text-gray-400 text-sm mb-6">We'll send you a verification code</p>
                    <div className="flex items-center bg-[#121212] border border-gray-700 rounded-xl px-4 py-3 mb-4 focus-within:border-[#FF6B2B] transition">
                      <span className="text-gray-400 mr-2 font-semibold">+91</span>
                      <input
                        type="tel" maxLength={10}
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="bg-transparent outline-none text-white flex-1 text-lg tracking-wider"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading || phone.length < 10}
                      className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? <Loader size={20} className="animate-spin" /> : <>Send OTP <ArrowRight size={16} className="ml-2" /></>}
                    </button>
                  </div>
                )}

                {/* STEP: OTP */}
                {checkoutStep === 'otp' && (
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1">Enter OTP</h3>
                    <p className="text-gray-400 text-sm mb-2">Sent to +91 {phone}</p>
                    {isMock && mockOtpValue && (
                      <div className="bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 p-2 rounded-lg mb-3">
                        <p className="text-xs text-[#FF6B2B] font-bold">Dev Mode OTP: {mockOtpValue}</p>
                      </div>
                    )}
                    <input
                      type="text" maxLength={6}
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#121212] border border-gray-700 focus:border-[#FF6B2B] rounded-xl px-4 py-3.5 outline-none text-white text-center text-2xl tracking-[0.5em] mb-4 transition"
                      autoFocus
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.length < 4}
                      className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center disabled:opacity-50"
                    >
                      {loading ? <Loader size={20} className="animate-spin" /> : <>Verify & Pay <ArrowRight size={16} className="ml-2" /></>}
                    </button>
                    <button onClick={() => setCheckoutStep('phone')} className="text-xs text-gray-500 mt-3 hover:text-white cursor-pointer">
                      Change number
                    </button>
                  </div>
                )}

                {/* STEP: Paying */}
                {checkoutStep === 'paying' && (
                  <div className="text-center py-6">
                    <Loader size={40} className="text-[#FF6B2B] animate-spin mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
                    <p className="text-gray-400 text-sm">Razorpay checkout is opening.<br />Complete payment to continue.</p>
                  </div>
                )}

                {/* STEP: Success */}
                {checkoutStep === 'success' && (
                  <div className="text-center py-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} className="text-green-500" />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Welcome!</h3>
                    <p className="text-gray-400 text-sm">Payment successful. Redirecting to your dashboard...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
