import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle, BookOpen, GraduationCap } from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accounts', 'History', 'Geography', 'Political Science', 'Art', 'Music', 'Sanskrit'];
const GRADES = ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12 Science', 'Class 11-12 Commerce', 'Class 11-12 Arts', 'College / Graduate', 'Competitive Exams'];

export default function SubscriptionDetails() {
  const navigate = useNavigate();
  const { user, role, completeProfile } = useAppContext();

  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarSent, setAadhaarSent] = useState(false);
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

  const handleAadhaarSend = () => {
    if (aadhaar.length !== 12) return alert("Enter valid 12-digit Aadhaar number");
    setAadhaarSent(true);
  };

  const toggleSubject = (subject) => {
    if (role === 'teacher') {
      setSelectedSubjects(prev =>
        prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
      );
    } else {
      setSubjectsNeeded(prev =>
        prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarSent || aadhaarOtp !== '1234') {
      return alert("Please verify Aadhaar OTP first. Demo code: 1234");
    }

    setLoading(true);
    try {
      const profileData = { aadhaar, aadhaarOtp, bio };

      if (role === 'teacher') {
        if (!qualifications || selectedSubjects.length === 0 || !chargePerMonth || !hoursPerDay) {
          setLoading(false);
          return alert("Please fill all required fields");
        }
        Object.assign(profileData, {
          qualifications,
          subjects: selectedSubjects,
          chargePerMonth: parseInt(chargePerMonth),
          hoursPerDay: parseInt(hoursPerDay),
          experience,
        });
      } else {
        if (!grade || subjectsNeeded.length === 0 || !budgetPerMonth) {
          setLoading(false);
          return alert("Please fill all required fields");
        }
        Object.assign(profileData, {
          grade,
          school,
          subjectsNeeded,
          budgetPerMonth: parseInt(budgetPerMonth),
        });
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#121212] text-white font-sans"
    >
      {/* Header */}
      <nav className="w-full p-4 flex items-center border-b border-gray-800 bg-[#1A1A1A]">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#121212] rounded-full hover:bg-gray-800 transition cursor-pointer mr-4">
          <ArrowLeft size={18} />
        </button>
        <div className="text-xl font-bold">Complete Your <span className="text-[#FF6B2B]">Premium</span> Profile</div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ─── AADHAAR VERIFICATION ─────────────────────────── */}
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
            <div className="flex items-center mb-4">
              <Shield size={24} className="text-[#FF6B2B] mr-3" />
              <h3 className="text-lg font-bold">Aadhaar Verification</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">We verify your identity for safety. Only last 4 digits are stored.</p>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                maxLength={12}
                placeholder="Enter 12-digit Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition"
              />
              <button
                type="button"
                onClick={handleAadhaarSend}
                disabled={aadhaarSent}
                className={`px-6 py-3 rounded-xl font-bold transition cursor-pointer ${aadhaarSent ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-[#FF6B2B] hover:bg-[#e85a1f] text-white'}`}
              >
                {aadhaarSent ? '✓ Sent' : 'Send OTP'}
              </button>
            </div>

            {aadhaarSent && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">Enter Aadhaar OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter OTP (demo: 1234)"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                  className="w-full max-w-[200px] bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition text-center text-xl tracking-widest"
                />
                <div className="bg-[#FF6B2B]/10 border border-[#FF6B2B]/20 p-2 rounded-lg mt-3 inline-block">
                  <p className="text-xs text-[#FF6B2B] font-semibold">Demo Code: <span className="text-white">1234</span></p>
                </div>
              </div>
            )}
          </div>

          {/* ─── ROLE-SPECIFIC FIELDS ────────────────────────── */}
          {role === 'teacher' ? (
            /* ─── TEACHER FORM ──────────────────────────────── */
            <>
              <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
                <div className="flex items-center mb-4">
                  <BookOpen size={24} className="text-[#FF6B2B] mr-3" />
                  <h3 className="text-lg font-bold">Teaching Details</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Qualifications *</label>
                    <input type="text" placeholder="e.g. B.Ed, M.Sc Mathematics, IIT Delhi" value={qualifications} onChange={(e) => setQualifications(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" required />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Subjects You Teach * (tap to select)</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map(sub => (
                        <button
                          key={sub} type="button"
                          onClick={() => toggleSubject(sub)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${activeSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                        >
                          {sub}
                        </button>
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
                    <input type="text" placeholder="e.g. 5 years of home tuition" value={experience} onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ─── STUDENT FORM ──────────────────────────────── */
            <>
              <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap size={24} className="text-[#FF6B2B] mr-3" />
                  <h3 className="text-lg font-bold">Student Details</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Your Grade / Class *</label>
                    <div className="flex flex-wrap gap-2">
                      {GRADES.map(g => (
                        <button
                          key={g} type="button"
                          onClick={() => setGrade(g)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${grade === g ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">School Name</label>
                    <input type="text" placeholder="e.g. DPS RK Puram" value={school} onChange={(e) => setSchool(e.target.value)}
                      className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Subjects You Need * (tap to select)</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map(sub => (
                        <button
                          key={sub} type="button"
                          onClick={() => toggleSubject(sub)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border ${activeSubjects.includes(sub) ? 'bg-[#FF6B2B] text-white border-[#FF6B2B]' : 'bg-[#121212] text-gray-400 border-gray-700 hover:border-[#FF6B2B]'}`}
                        >
                          {sub}
                        </button>
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
            </>
          )}

          {/* ─── BIO ─────────────────────────────────────────── */}
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
            <label className="block text-gray-400 text-sm mb-2">Bio (Optional)</label>
            <textarea
              placeholder={role === 'teacher' ? "Tell students about your teaching style..." : "Tell tutors what you're looking for..."}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition resize-none"
            />
          </div>

          {/* ─── SUBMIT ──────────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center ${loading ? 'opacity-70 animate-pulse' : ''}`}
          >
            {loading ? 'Saving...' : (<><CheckCircle size={18} className="mr-2" /> Complete & Enter Dashboard</>)}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
