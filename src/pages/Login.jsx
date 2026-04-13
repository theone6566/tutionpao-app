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
  
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile
  
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Enter valid 10 digit number");
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp !== '1234') return alert("Invalid OTP. Try 1234");
    setStep(3);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name");
    login(name, role, photoPreview);
    navigate('/dashboard');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
          <div className="h-full bg-[#FF6B2B] transition-all duration-500" style={{ width: `${(step/3)*100}%` }}></div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">
          {step === 1 ? 'Enter Phone' : step === 2 ? 'Verify OTP' : 'Complete Profile'}
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          {step === 1 ? 'We will send a 4-digit code.' : step === 2 ? `Code sent to ${phone}` : 'Almost there! Setup your identity.'}
        </p>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: PHONE */}
          {step === 1 && (
            <motion.form key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                <div className="flex">
                  <div className="bg-[#121212] border border-gray-800 rounded-l-xl px-4 py-3 text-gray-400 border-r-0">+91</div>
                  <input 
                    type="tel" 
                    placeholder="9999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-[#121212] flex-grow border border-gray-800 focus:border-[#FF6B2B] rounded-r-xl px-4 py-3 outline-none text-white transition"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-xl mt-6 transition cursor-pointer">
                Get OTP
              </button>
            </motion.form>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <motion.form key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2 text-center">Enter 4-Digit OTP (Use 1234)</label>
                <input 
                  type="text" 
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-4 outline-none text-white transition text-center text-3xl font-bold tracking-widest"
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-xl mt-6 transition cursor-pointer">
                Verify
              </button>
            </motion.form>
          )}

          {/* STEP 3: PROFILE */}
          {step === 3 && (
            <motion.form key="step3" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} onSubmit={handleFinalSubmit} className="space-y-4">
              
              {/* Role Toggle */}
              <div className="flex bg-[#121212] rounded-xl p-1 mb-6 relative">
                <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#FF6B2B] rounded-lg transition-all duration-300 ${role === 'student' ? 'left-1' : 'left-[calc(50%+3px)]'}`}></div>
                <button type="button" onClick={() => setRole('student')} className={`flex-1 py-3 flex items-center justify-center text-sm font-semibold z-10 rounded-lg transition cursor-pointer ${role === 'student' ? 'text-white' : 'text-gray-400'}`}><User size={16} className="mr-2" /> Student</button>
                <button type="button" onClick={() => setRole('tutor')} className={`flex-1 py-3 flex items-center justify-center text-sm font-semibold z-10 rounded-lg transition cursor-pointer ${role === 'tutor' ? 'text-white' : 'text-gray-400'}`}><BookOpen size={16} className="mr-2" /> Tutor</button>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-800 bg-[#121212] flex items-center justify-center mb-2 relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-500" />
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
                <label className="block text-gray-400 text-sm mb-2">Display Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" autoFocus required />
              </div>

              <button type="submit" className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-xl mt-6 transition cursor-pointer flex items-center justify-center">
                <CheckCircle size={18} className="mr-2" /> Complete Setup
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
