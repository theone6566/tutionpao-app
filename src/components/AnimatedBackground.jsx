import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, Search, GraduationCap } from 'lucide-react';
import Lottie from 'lottie-react';
import RunningBoySVG from './RunningBoySVG';

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
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    // Fetch a public running boy animation Lottie correctly
    fetch('https://assets2.lottiefiles.com/packages/lf20_3rwSQe.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(e => {
        // Safe fallback public url
        fetch('https://assets6.lottiefiles.com/private_files/lf30_igofamv8.json')
          .then(res => res.json())
          .then(data => setAnimationData(data))
      });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Dynamic Background Quote - MADE 100% VISIBLE */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={quote}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 1 }}
          className="absolute top-28 md:top-36 left-4 md:left-8 w-64 select-none z-[100] bg-[#121212]/50 backdrop-blur-md p-4 rounded-2xl border border-gray-800"
        >
          <div className="border-l-4 border-[#FF6B2B] pl-4">
            <p className="text-sm md:text-md font-bold text-white italic drop-shadow-md">"{quote.split('—')[0].trim()}"</p>
            <p className="text-xs text-[#FF6B2B] font-bold mt-2">— {quote.split('—')[1]?.trim()}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Live Ocean / Water Waves Effect */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 opacity-70 flex">
        <motion.svg
          className="relative block w-[200%] h-[120px]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 10, repeat: Infinity }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.82,204,110.59,245.54,105.3,284.14,84.4,321.39,56.44Z"
            className="fill-[#1A4B84]"
          ></path>
          {/* Seamless duplicate path for sliding */}
          <path
            d="M1521.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C2023.78,31,2106.67,72,2185.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H1200V95.8C1259.71,118.08,1330.83,119.82,1404,110.59,1445.54,105.3,1484.14,84.4,1521.39,56.44Z"
            className="fill-[#1A4B84]"
          ></path>
        </motion.svg>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 opacity-50 flex mt-[-80px]">
        <motion.svg
          className="relative block w-[200%] h-[150px]"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ ease: 'linear', duration: 15, repeat: Infinity }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-[#1B365D]"
          ></path>
          <path
            d="M2185.66,92.83C2106.67,72,2023.78,31,1943.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,1200,27.35V120H2400V95.8C2332.19,118.92,2255.71,111.31,2185.66,92.83Z"
            className="fill-[#1B365D]"
          ></path>
        </motion.svg>
      </div>

      {/* Proprietary Pure SVG/CSS Animated Running Cartoon Kid */}
      <motion.div
        animate={{ 
          x: ['-20vw', '120vw', '-20vw'],
          rotateY: [0, 0, 180, 180, 0] // Flip based on direction
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.49, 0.5, 0.99, 1] // Handle instant flips at edges
        }}
        className="absolute bottom-[80px] z-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        style={{ width: '180px' }}
      >
        <RunningBoySVG />
        
        {/* Water Splash particles */}
        <motion.div
          animate={{ scale: [0.5, 1.2, 0.5], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/40 rounded-[100%] blur-sm pointer-events-none"
        />
      </motion.div>

      {floatingIcons.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ y: 0, opacity: 0.1 }}
            animate={{ 
              y: [0, -20, 0], 
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.3, 0.1]
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
