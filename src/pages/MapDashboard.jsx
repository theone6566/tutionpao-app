import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapSearch from '../components/MapSearch';
import { Search, MapPin, ArrowLeft, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function MapDashboard() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // If user logic needs redirect (for safety, uncomment later)
  // if (!user) navigate('/login');

  const defaultMode = user?.role === 'tutor' ? 'tutor' : 'student';
  const [mode, setMode] = useState(defaultMode);
  const [subject, setSubject] = useState('');
  const [budget, setBudget] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!subject || !budget) return alert("Please enter subject and budget/fee.");
    setIsSearching(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen bg-[#121212] text-white font-sans overflow-hidden flex flex-col"
    >
      
      {isSearching && (
        <MapSearch 
          mode={mode} 
          subject={subject} 
          budget={budget} 
          onClose={() => setIsSearching(false)} 
        />
      )}
      
      {/* Navbar Minimal */}
      <nav className="w-full p-4 flex justify-between items-center z-20 border-b border-gray-800 bg-[#121212]">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/')} className="p-2 bg-[#1E1E1E] rounded-full hover:bg-gray-800 transition cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="text-xl font-bold text-[#FF6B2B] tracking-tight">TutionPao Dashboard</div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/messages')}
            className="flex items-center space-x-2 bg-[#1E1E1E] hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <MessageSquare size={18} />
            <span className="hidden sm:inline">Messages</span>
          </button>
          <div className="flex items-center bg-[#1E1E1E] pl-2 pr-4 py-1.5 rounded-xl border border-gray-800">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
              {user?.photo ? (
                <img src={user.photo} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">?</div>
              )}
            </div>
            <span className="text-sm text-gray-400">Hi, <span className="text-white font-semibold">{user?.name || 'Guest'}</span></span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {!isSearching && (
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">Live Radius Search</h1>
            <p className="text-gray-400 text-sm md:text-base">Find exactly what you're looking for within 5km.</p>
          </div>

          <div className="w-full max-w-2xl bg-[#1E1E1E] border border-gray-800 rounded-3xl p-4 shadow-2xl">
            {/* Toggle */}
            <div className="flex bg-[#121212] rounded-2xl p-1 mb-6 relative">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#FF6B2B] rounded-xl transition-all duration-300 ease-in-out ${mode === 'student' ? 'left-1' : 'left-[calc(50%+3px)]'}`}
              ></div>
              <button 
                onClick={() => setMode('student')}
                className={`flex-1 py-3 text-center rounded-xl font-semibold z-10 transition-colors cursor-pointer ${mode === 'student' ? 'text-white' : 'text-gray-500'}`}
              >
                I am looking for a Tutor
              </button>
              <button 
                onClick={() => setMode('tutor')}
                className={`flex-1 py-3 text-center rounded-xl font-semibold z-10 transition-colors cursor-pointer ${mode === 'tutor' ? 'text-white' : 'text-gray-500'}`}
              >
                I want to Teach
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4 px-2 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject */}
                <div className="bg-[#121212] flex items-center px-4 rounded-2xl border border-gray-800 focus-within:border-[#FF6B2B] transition-colors">
                  <Search className="text-gray-500 mr-3" size={20} />
                  <input 
                    type="text" 
                    placeholder={mode === 'student' ? "Subject to study?" : "Subject to teach?"}
                    className="w-full bg-transparent py-4 outline-none text-white placeholder-gray-500"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div className="bg-[#121212] flex items-center px-4 rounded-2xl border border-gray-800 focus-within:border-[#FF6B2B] transition-colors">
                  <span className="text-gray-500 mr-3 font-semibold">₹</span>
                  <input 
                    type="number" 
                    placeholder={mode === 'student' ? "Budget (per month)" : "Expected Fee /mo"}
                    className="w-full bg-transparent py-4 outline-none text-white placeholder-gray-500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] text-white font-bold py-4 rounded-2xl mt-4 transition-transform hover:scale-[1.01] active:scale-95 flex justify-center items-center cursor-pointer"
              >
                <MapPin className="mr-2" size={20} /> Launch Radar Map
              </button>
            </form>
          </div>
        </main>
      )}
    </motion.div>
  );
}
