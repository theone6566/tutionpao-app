import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Upload, CheckCircle, Crown, Moon, Sun, Bell, BellOff, LogOut, Camera } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, role, updateProfile, logout, darkMode, toggleDarkMode, refreshUser } = useAppContext();

  const [name, setName] = useState(user?.name || '');
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [nearbyAlerts, setNearbyAlerts] = useState(user?.nearbyAlerts || false);
  const [saving, setSaving] = useState(false);

  // Teacher
  const [qualifications, setQualifications] = useState(user?.qualifications || '');
  const [chargePerMonth, setChargePerMonth] = useState(user?.chargePerMonth || '');
  const [hoursPerDay, setHoursPerDay] = useState(user?.hoursPerDay || '');
  const [experience, setExperience] = useState(user?.experience || '');

  // Student
  const [grade, setGrade] = useState(user?.grade || '');
  const [school, setSchool] = useState(user?.school || '');
  const [budgetPerMonth, setBudgetPerMonth] = useState(user?.budgetPerMonth || '');

  useEffect(() => {
    if (!user) navigate('/login');
    else refreshUser();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("Photo must be under 2MB");
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = { name, photo: photoPreview, bio, nearbyAlerts };
      if (role === 'teacher') {
        Object.assign(updates, { qualifications, chargePerMonth: parseInt(chargePerMonth) || 0, hoursPerDay: parseInt(hoursPerDay) || 0, experience });
      } else {
        Object.assign(updates, { grade, school, budgetPerMonth: parseInt(budgetPerMonth) || 0 });
      }
      await updateProfile(updates);
      alert("Profile updated!");
    } catch (err) {
      alert(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#121212] text-white font-sans"
    >
      {/* Navbar */}
      <nav className="w-full p-4 flex items-center border-b border-gray-800 bg-[#1A1A1A]">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-[#121212] rounded-full hover:bg-gray-800 transition cursor-pointer mr-4">
          <ArrowLeft size={18} />
        </button>
        <span className="text-xl font-bold">My Profile</span>
      </nav>

      <div className="max-w-2xl mx-auto p-6 space-y-6">

        {/* ─── PHOTO & NAME ──────────────────────────────── */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#FF6B2B] bg-[#121212]">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><User size={40} className="text-[#FF6B2B]" /></div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-[#FF6B2B] p-2.5 rounded-full cursor-pointer hover:bg-[#e85a1f] transition shadow-lg">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="w-full">
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition text-center" />
          </div>

          <div className="flex items-center mt-3 text-xs text-gray-400 capitalize">
            <span className="text-[#FF6B2B] bg-[#FF6B2B]/10 px-3 py-1 rounded-full font-semibold">{role}</span>
            {user?.isSubscribed && (
              <span className="ml-2 text-[#FF6B2B] bg-[#FF6B2B]/10 px-3 py-1 rounded-full font-semibold flex items-center">
                <Crown size={12} className="mr-1" /> Premium
              </span>
            )}
          </div>
        </div>

        {/* ─── BIO ───────────────────────────────────────── */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6">
          <label className="block text-gray-400 text-sm mb-2">Bio</label>
          <textarea
            value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
            placeholder="Tell others about yourself..."
            className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition resize-none"
          />
        </div>

        {/* ─── ROLE-SPECIFIC ─────────────────────────────── */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-lg mb-2">{role === 'teacher' ? 'Teaching Details' : 'Student Details'}</h3>

          {role === 'teacher' ? (
            <>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Qualifications</label>
                <input type="text" value={qualifications} onChange={(e) => setQualifications(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Charge ₹/mo</label>
                  <input type="number" value={chargePerMonth} onChange={(e) => setChargePerMonth(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Hours/Day</label>
                  <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Experience</label>
                <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Grade / Class</label>
                <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">School</label>
                <input type="text" value={school} onChange={(e) => setSchool(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Budget ₹/month</label>
                <input type="number" value={budgetPerMonth} onChange={(e) => setBudgetPerMonth(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-800 focus:border-[#FF6B2B] rounded-xl px-4 py-3 outline-none text-white transition" />
              </div>
            </>
          )}
        </div>

        {/* ─── SETTINGS ──────────────────────────────────── */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-lg mb-2">Settings</h3>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="flex items-center">
              {darkMode ? <Moon size={18} className="text-gray-400 mr-3" /> : <Sun size={18} className="text-yellow-400 mr-3" />}
              <span className="text-sm">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition cursor-pointer relative ${darkMode ? 'bg-[#FF6B2B]' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${darkMode ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Nearby Alerts Toggle */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="flex items-center">
              {nearbyAlerts ? <Bell size={18} className="text-[#FF6B2B] mr-3" /> : <BellOff size={18} className="text-gray-400 mr-3" />}
              <div>
                <span className="text-sm">Nearby Search Alerts</span>
                <p className="text-xs text-gray-500">Get notified when someone searches near you</p>
              </div>
            </div>
            <button
              onClick={() => setNearbyAlerts(!nearbyAlerts)}
              className={`w-12 h-6 rounded-full transition cursor-pointer relative ${nearbyAlerts ? 'bg-[#FF6B2B]' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${nearbyAlerts ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Subscription Info */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Crown size={18} className="text-[#FF6B2B] mr-3" />
              <div>
                <span className="text-sm">Subscription</span>
                <p className="text-xs text-gray-500">{user?.isSubscribed ? 'Premium active' : 'Free plan'}</p>
              </div>
            </div>
            {!user?.isSubscribed && (
              <button onClick={() => navigate('/')} className="text-xs bg-[#FF6B2B] px-4 py-1.5 rounded-full font-bold cursor-pointer">
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* ─── SAVE BUTTON ──────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl transition-transform hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center ${saving ? 'opacity-70 animate-pulse' : ''}`}
        >
          {saving ? 'Saving...' : (<><CheckCircle size={18} className="mr-2" /> Save Changes</>)}
        </button>

        {/* ─── LOGOUT ──────────────────────────────────────── */}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full py-3 border border-red-500/30 text-red-500 rounded-2xl font-bold hover:bg-red-500/10 transition cursor-pointer flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>
    </motion.div>
  );
}
