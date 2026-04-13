import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, User, BookOpen, Upload, CheckCircle } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [role, setRole] = useState('student');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, API_BASE } = useAppContext();

  const handleRoleSubmit = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Enter valid 10 digit number");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      setIsNewUser(data.isNewUser);
      if (!data.isNewUser && data.role) setRole(data.role);
      setStep(3);
    } catch (err) {
      alert("Failed to connect to server. Check internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp !== '1234') return alert("Invalid OTP. For demo use 1234");
    
    setLoading(true);
    try {
      if (!isNewUser) {
        await login(phone, otp, '', role, '');
        navigate('/dashboard');
      } else {
        setStep(4);
      }
    } catch (err) {
      alert(err.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name");
    
    setLoading(true);
    try {
      await login(phone, otp, name, role, photoPreview);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    // ... same as before
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-[#121212] text-white font-sans flex items-center justify-center p-4"
    >
      <AnimatedBackground />
      
      <button 
        onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} 
        className="absolute top-6 left-6 p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition z-20 cursor-pointer"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="relative z-10 w-full max-w-md bg-[#1E1E1E]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
          <div className="h-full bg-[#FF6B2B] transition-all duration-500" style={{ width: `${(step/4)*100}%` }}></div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">
          {step === 1 ? 'Are you a...' : step === 2 ? 'Phone Number' : step === 3 ? 'Verification' : 'Complete Profile'}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {step === 1 ? 'Choose your role to continue' : step === 2 ? `Continuing as ${role === 'tutor' ? 'Teacher' : 'Student'}` : step === 3 ? `Enter code sent to ${phone}` : 'Almost there! Setup your identity.'}
        </p>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: ROLE */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
               <button 
                onClick={() => handleRoleSubmit('student')}
                className="w-full bg-[#121212] border-2 border-gray-800 hover:border-[#FF6B2B] p-6 rounded-2xl flex items-center group transition cursor-pointer"
               >
                 <div className="bg-[#FF6B2B]/10 p-4 rounded-xl mr-4 group-hover:bg-[#FF6B2B] transition">
                    <User size={30} className="text-[#FF6B2B] group-hover:text-white" />
                 </div>
                 <div className="text-left">
                    <div className="font-bold text-lg text-white">I am a Student</div>
                    <div className="text-sm text-gray-500">I want to find a tutor near me</div>
                 </div>
               </button>

               <button 
                onClick={() => handleRoleSubmit('tutor')}
                className="w-full bg-[#121212] border-2 border-gray-800 hover:border-[#FF6B2B] p-6 rounded-2xl flex items-center group transition cursor-pointer"
               >
                 <div className="bg-[#FF6B2B]/10 p-4 rounded-xl mr-4 group-hover:bg-[#FF6B2B] transition">
                    <BookOpen size={30} className="text-[#FF6B2B] group-hover:text-white" />
                 </div>
                 <div className="text-left">
                    <div className="font-bold text-lg text-white">I am a Teacher</div>
                    <div className="text-sm text-gray-500">I want to teach students nearby</div>
                 </div>
               </button>
            </motion.div>
          )}

          {/* STEP 2: PHONE */}
          {step === 2 && (
            <motion.form key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Enter Mobile Number</label>
                <div className="flex">
                  <div className="bg-[#121212] border border-gray-800 rounded-l-xl px-4 py-3 text-gray-400 border-r-0">+91</div>
                  <input 
                    type="tel" 
                    placeholder="9999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-r-xl px-4 py-3 outline-none text-white transition"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-xl mt-6 transition cursor-pointer ${loading ? 'opacity-70 animate-pulse' : ''}`}>
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </motion.form>
          )}

          {/* STEP 3: OTP */}
          {step === 3 && (
            <motion.form key="step3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handleOtpSubmit} className="space-y-4 text-center">
              <div>
                <label className="block text-gray-400 text-sm mb-4">Enter 4-Digit OTP</label>
                <input 
                  type="text" 
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full max-w-[200px] bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-4 outline-none text-white transition text-center text-3xl font-bold tracking-widest mx-auto"
                  autoFocus
                  required
                />
              </div>
              <div className="bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 p-3 rounded-lg mt-4 inline-block">
                <p className="text-sm text-[#FF6B2B] font-semibold">Demo Bypass Code: <span className="text-white text-lg">1234</span></p>
              </div>
              <button type="submit" disabled={loading} className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-xl mt-6 transition cursor-pointer ${loading ? 'opacity-70 animate-pulse' : ''}`}>
                {loading ? 'Verifying...' : `Verify & ${isNewUser ? 'Sign Up' : 'Login'}`}
              </button>
            </motion.form>
          )}

          {/* STEP 4: PROFILE */}
          {step === 4 && (
            <motion.form key="step4" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handleFinalSubmit} className="space-y-4">
              
              {/* Photo Upload */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-800 bg-[#121212] flex items-center justify-center mb-2 relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-[#FF6B2B]/10 w-full h-full flex items-center justify-center"><User size={32} className="text-[#FF6B2B]" /></div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-0 bg-[#FF6B2B] p-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition shadow-lg">
                    <Upload size={14} />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload Photo (Optional)</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Full Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" autoFocus required />
              </div>

              <button type="submit" disabled={loading} className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-xl mt-6 transition cursor-pointer flex items-center justify-center ${loading ? 'opacity-70 animate-pulse' : ''}`}>
                {loading ? 'Finishing...' : (<><CheckCircle size={18} className="mr-2" /> Finish Setup</>)}
              </button>
            </motion.form>
          )}

        </AnimatePresence>

        <p className="text-gray-500 text-xs text-center mt-6">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </motion.div>
  );
}
