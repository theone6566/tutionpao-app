import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle, BookOpen, GraduationCap, Loader } from 'lucide-react';

const API_BASE = "https://tutionpao-backend-production.up.railway.app";
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accounts', 'History', 'Geography', 'Political Science', 'Art', 'Music', 'Sanskrit'];
const GRADES = ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12 Science', 'Class 11-12 Commerce', 'Class 11-12 Arts', 'College / Graduate', 'Competitive Exams'];

export default function SubscriptionDetails() {
  const navigate = useNavigate();
  const { user, role, completeProfile } = useAppContext();

  // Aadhaar verification state
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarSent, setAadhaarSent] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isMock, setIsMock] = useState(false);
  const [sendingAadhaar, setSendingAadhaar] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Teacher fields
  const [qualifications, setQualifications] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [chargePerMonth, setChargePerMonth] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');

  // Student fields
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [subjectsNeeded, setSubjectsNeeded] = useState([]);
  const [budgetPerMonth, setBudgetPerMonth] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  // ─── SEND AADHAAR OTP (REAL) ──────────────────────────────
  const handleAadhaarSend = async () => {
    if (aadhaar.length !== 12) return alert("Enter valid 12-digit Aadhaar number");
    setSendingAadhaar(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/aadhaar/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: aadhaar, userId: user._id, role })
      });
      const data = await res.json();

      if (data.success) {
        setAadhaarSent(true);
        setReferenceId(data.reference_id);
        setIsMock(data.mock || false);
        alert(data.mock ? '🔧 Dev Mode: Check server console for OTP' : 'OTP sent to your Aadhaar-linked mobile number!');
      } else {
        alert(data.error || 'Failed to send Aadhaar OTP');
      }
    } catch (err) {
      alert("Failed to connect. Try again.");
    } finally {
      setSendingAadhaar(false);
    }
  };

  // ─── VERIFY AADHAAR OTP (REAL) ────────────────────────────
  const handleAadhaarVerify = async () => {
    if (aadhaarOtp.length < 4) return alert("Enter the OTP");
    setVerifyingAadhaar(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/aadhaar/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId,
          otp: aadhaarOtp,
          aadhaarNumber: aadhaar,
          userId: user._id,
          role
        })
      });
      const data = await res.json();

      if (data.success) {
        setAadhaarVerified(true);
        alert('✅ Aadhaar verified successfully!');
      } else {
        alert(data.error || 'Verification failed. Check OTP and try again.');
      }
    } catch (err) {
      alert("Verification failed. Try again.");
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const toggleSubject = (subject) => {
    if (role === 'teacher') {
      setSelectedSubjects(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
    } else {
      setSubjectsNeeded(prev => prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarVerified) return alert("Please verify your Aadhaar first");

    setLoading(true);
    try {
      const profileData = { bio };

      if (role === 'teacher') {
        if (!qualifications || selectedSubjects.length === 0 || !chargePerMonth || !hoursPerDay) {
          setLoading(false);
          return alert("Please fill all required fields");
        }
        Object.assign(profileData, { qualifications, subjects: selectedSubjects, chargePerMonth: parseInt(chargePerMonth), hoursPerDay: parseInt(hoursPerDay), experience });
      } else {
        if (!grade || subjectsNeeded.length === 0 || !budgetPerMonth) {
          setLoading(false);
          return alert("Please fill all required fields");
        }
        Object.assign(profileData, { grade, school, subjectsNeeded, budgetPerMonth: parseInt(budgetPerMonth) });
      }

      await completeProfile(profileData);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const activeSubjects = role === 'teacher' ? selectedSubjects : subjectsNeeded;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#121212] text-white font-sans">
      <nav className="w-full p-4 flex items-center border-b border-gray-800 bg-[#1A1A1A]">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#121212] rounded-full hover:bg-gray-800 transition cursor-pointer mr-4"><ArrowLeft size={18} /></button>
        <div className="text-xl font-bold">Complete Your <span className="text-[#FF6B2B]">Premium</span> Profile</div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ─── AADHAAR VERIFICATION (REAL) ─────────────────── */}
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
            <div className="flex items-center mb-4">
              <Shield size={24} className="text-[#FF6B2B] mr-3" />
              <h3 className="text-lg font-bold">Aadhaar Verification</h3>
              {aadhaarVerified && <span className="ml-auto text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full font-bold">✅ Verified</span>}
            </div>
            <p className="text-gray-400 text-sm mb-4">We verify your identity for safety. OTP will be sent to your Aadhaar-linked mobile.</p>

            {!aadhaarVerified ? (
              <>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text" maxLength={12}
                    placeholder="Enter 12-digit Aadhaar Number"
                    value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition"
                    disabled={aadhaarSent}
                  />
                  <button
                    type="button" onClick={handleAadhaarSend}
                    disabled={aadhaarSent || sendingAadhaar}
                    className={`px-6 py-3 rounded-xl font-bold transition cursor-pointer ${aadhaarSent ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-[#FF6B2B] hover:bg-[#e85a1f] text-white'}`}
                  >
                    {sendingAadhaar ? <Loader size={18} className="animate-spin" /> : aadhaarSent ? '✓ Sent' : 'Send OTP'}
                  </button>
                </div>

                {aadhaarSent && (
                  <div className="space-y-3">
                    <label className="block text-gray-400 text-sm">Enter OTP sent to Aadhaar-linked mobile</label>
                    <div className="flex gap-3">
                      <input
                        type="text" maxLength={6}
                        placeholder="Enter OTP"
                        value={aadhaarOtp} onChange={(e) => setAadhaarOtp(e.target.value)}
                        className="flex-1 bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition text-center text-xl tracking-widest"
                      />
                      <button
                        type="button" onClick={handleAadhaarVerify}
                        disabled={verifyingAadhaar}
                        className="px-6 py-3 rounded-xl font-bold bg-[#FF6B2B] hover:bg-[#e85a1f] text-white transition cursor-pointer"
                      >
                        {verifyingAadhaar ? <Loader size={18} className="animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                    {isMock && (
                      <div className="bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 p-2 rounded-lg">
                        <p className="text-xs text-[#FF6B2B] font-semibold">🔧 Dev Mode: Check server console for OTP</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                <p className="text-green-500 font-bold text-sm">Aadhaar XXXX-XXXX-{aadhaar.slice(-4)} verified</p>
              </div>
            )}
          </div>

          {/* ─── ROLE-SPECIFIC FIELDS ────────────────────────── */}
          {role === 'teacher' ? (
            <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
              <div className="flex items-center mb-4"><BookOpen size={24} className="text-[#FF6B2B] mr-3" /><h3 className="text-lg font-bold">Teaching Details</h3></div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Qualifications *</label>
                  <input type="text" placeholder="e.g. B.Ed, M.Sc Mathematics" value={qualifications} onChange={(e) => setQualifications(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Subjects You Teach * (tap to select)</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(sub => (
                      <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${activeSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                      >{sub}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Charge ₹/month *</label>
                    <input type="number" placeholder="e.g. 2000" value={chargePerMonth} onChange={(e) => setChargePerMonth(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Hours/Day *</label>
                    <input type="number" placeholder="e.g. 3" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" required />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Experience</label>
                  <input type="text" placeholder="e.g. 5 years" value={experience} onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
              <div className="flex items-center mb-4"><GraduationCap size={24} className="text-[#FF6B2B] mr-3" /><h3 className="text-lg font-bold">Student Details</h3></div>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Grade / Class *</label>
                  <div className="flex flex-wrap gap-2">
                    {GRADES.map(g => (
                      <button key={g} type="button" onClick={() => setGrade(g)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${grade === g ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                      >{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">School Name</label>
                  <input type="text" placeholder="e.g. DPS RK Puram" value={school} onChange={(e) => setSchool(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Subjects Needed *</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(sub => (
                      <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${activeSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                      >{sub}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Budget ₹/month *</label>
                  <input type="number" placeholder="e.g. 1500" value={budgetPerMonth} onChange={(e) => setBudgetPerMonth(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" required />
                </div>
              </div>
            </div>
          )}

          {/* BIO */}
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
            <label className="block text-gray-400 text-sm mb-2">Bio (Optional)</label>
            <textarea placeholder={role === 'teacher' ? "Tell students about your teaching style..." : "Tell tutors what you're looking for..."} value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition resize-none" />
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading || !aadhaarVerified}
            className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition cursor-pointer flex items-center justify-center ${loading ? 'opacity-70 animate-pulse' : ''} ${!aadhaarVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : (<><CheckCircle size={18} className="mr-2" /> Complete & Enter Dashboard</>)}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
