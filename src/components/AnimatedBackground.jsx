import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Search, GraduationCap } from 'lucide-react';

const floatingIcons = [
  { id: 1, icon: BookOpen, x: '10%', y: '20%', delay: 0 },
  { id: 2, icon: GraduationCap, x: '80%', y: '15%', delay: 1 },
  { id: 3, icon: BookOpen, x: '70%', y: '70%', delay: 0.5 },
  { id: 4, icon: GraduationCap, x: '20%', y: '80%', delay: 1.5 },
  { id: 5, icon: BookOpen, x: '40%', y: '10%', delay: 0.8 },
  { id: 6, icon: GraduationCap, x: '90%', y: '50%', delay: 0.2 },
];

const quotes = [
  "Education is the most powerful weapon which you can use to change the world. — Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. — B.B. King",
  "A person who never made a mistake never tried anything new. — Albert Einstein",
  "Education is not the learning of facts, but the training of the mind to think. — Albert Einstein",
  "The roots of education are bitter, but the fruit is sweet. — Aristotle",
];

export default function AnimatedBackground() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {/* Dynamic Background Quote */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quote}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-4 left-0 w-full select-none z-[5] text-center hidden sm:block"
        >
          <p className="text-[10px] md:text-xs font-medium text-white italic px-10">
            "{quote.split('—')[0].trim()}" — <span className="text-[#FF6B2B]">{quote.split('—')[1]?.trim()}</span>
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Gradient Glow Orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[10%] w-64 h-64 bg-[#FF6B2B]/8 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-[#1A4B84]/20 rounded-full blur-[100px]"
      />

      {/* Floating Icons */}
      {floatingIcons.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ y: 0, opacity: 0.08 }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.08, 0.2, 0.08]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
            className="absolute text-[#FF6B2B]"
            style={{ left: item.x, top: item.y }}
          >
            <Icon size={48} />
          </motion.div>
        );
      })}
    </div>
  );
}
