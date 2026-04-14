import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, User, Crown, Trash2, Send, MapPin } from 'lucide-react';

export default function MyList() {
  const navigate = useNavigate();
  const { user, role, savedProfiles, unsaveProfile, sendPing, fetchSavedProfiles } = useAppContext();

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchSavedProfiles();
  }, [user]);

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
        <div className="flex items-center">
          <Heart size={20} className="text-[#FF6B2B] mr-2 fill-current" />
          <span className="text-xl font-bold">My List</span>
          <span className="ml-3 text-sm text-gray-400 bg-[#1E1E1E] px-3 py-1 rounded-full">{savedProfiles.length} saved</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-4">
        {savedProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4">
              <Heart size={36} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">No saved profiles yet</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">Go to the dashboard, search for {role === 'teacher' ? 'students' : 'tutors'}, and tap the ❤ button to save them here.</p>
            <button onClick={() => navigate('/dashboard')} className="bg-[#FF6B2B] px-6 py-3 rounded-full font-bold cursor-pointer hover:scale-105 transition">
              <MapPin size={16} className="inline mr-2" /> Open Map Search
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {savedProfiles.map((person, i) => (
              <motion.div
                key={person._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-5 flex items-center group hover:border-[#FF6B2B]/30 transition"
              >
                {/* Profile pic */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0 mr-4">
                  {person.photo ? (
                    <img src={person.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={24} /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base mb-1">{person.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">
                    {role === 'teacher'
                      ? `${person.subjectsNeeded?.join(', ') || 'All subjects'} • ₹${person.budgetPerMonth || '—'}/mo • ${person.grade || ''}`
                      : `${person.subjects?.join(', ') || 'All subjects'} • ₹${person.chargePerMonth || '—'}/mo • ${person.qualifications || ''}`
                    }
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-2">
                  {user?.isSubscribed ? (
                    <button
                      onClick={() => {
                        const targetRole = role === 'teacher' ? 'student' : 'teacher';
                        sendPing(person._id, targetRole, '');
                        alert(`Request sent to ${person.name}!`);
                      }}
                      className="bg-[#FF6B2B] hover:bg-[#e85a1f] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center"
                    >
                      <Send size={14} className="mr-1" /> Connect
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/')}
                      className="bg-gray-800 text-gray-400 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center"
                    >
                      <Crown size={14} className="mr-1 text-[#FF6B2B]" /> Subscribe
                    </button>
                  )}

                  <button
                    onClick={() => unsaveProfile(person._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                    title="Remove from list"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
