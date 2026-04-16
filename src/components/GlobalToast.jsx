import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function GlobalToast() {
  const { toast, setToast } = useAppContext();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-6 right-6 z-[9999] max-w-[320px] w-full bg-[#1A1A1A]/95 backdrop-blur-xl border-2 border-[#FF6B2B] rounded-2xl shadow-[0_10px_40px_rgba(255,107,43,0.2)] p-4 flex items-start space-x-3 cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setToast(null)}
      >
        <div className="bg-[#FF6B2B]/20 p-2.5 rounded-xl flex-shrink-0 mt-1">
          <Bell size={20} className="text-[#FF6B2B] animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="bg-[#FF6B2B] text-[10px] font-black text-[#121212] tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 uppercase">
            Nearby Search Alert
          </div>
          <h4 className="font-bold text-sm text-white">{toast.title || 'Student Searching Nearby!'}</h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{toast.message}</p>
        </div>
        <button 
          className="text-gray-500 hover:text-white transition p-1 bg-[#252525] rounded-lg cursor-pointer" 
          onClick={(e) => { e.stopPropagation(); setToast(null); }}
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
