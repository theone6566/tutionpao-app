import React from 'react';

// Pure SVG + CSS Keyframes implementation of a running boy
export default function RunningBoySVG() {
  return (
    <div className="relative" style={{ width: '100px', height: '140px' }}>
      <style>
        {`
          @keyframes run-leg-f {
            0% { transform: rotate(-30deg); }
            50% { transform: rotate(45deg); }
            100% { transform: rotate(-30deg); }
          }
          @keyframes run-leg-b {
            0% { transform: rotate(45deg); }
            50% { transform: rotate(-30deg); }
            100% { transform: rotate(45deg); }
          }
          @keyframes run-arm-f {
            0% { transform: rotate(40deg); }
            50% { transform: rotate(-40deg); }
            100% { transform: rotate(40deg); }
          }
          @keyframes run-arm-b {
            0% { transform: rotate(-40deg); }
            50% { transform: rotate(40deg); }
            100% { transform: rotate(-40deg); }
          }
          @keyframes run-body {
            0% { transform: translateY(0px) rotate(5deg); }
            25% { transform: translateY(-5px) rotate(10deg); }
            50% { transform: translateY(0px) rotate(5deg); }
            75% { transform: translateY(-5px) rotate(10deg); }
            100% { transform: translateY(0px) rotate(5deg); }
          }
          .animate-body {
            transform-origin: center bottom;
            animation: run-body 0.6s infinite linear;
          }
          .animate-leg-f {
            transform-origin: top center;
            animation: run-leg-f 0.6s infinite linear;
          }
          .animate-leg-b {
            transform-origin: top center;
            animation: run-leg-b 0.6s infinite linear;
          }
          .animate-arm-f {
            transform-origin: top center;
            animation: run-arm-f 0.6s infinite linear;
          }
          .animate-arm-b {
            transform-origin: top center;
            animation: run-arm-b 0.6s infinite linear;
          }
        `}
      </style>

      <svg viewBox="0 0 100 150" className="w-full h-full animate-body overflow-visible">
        <g transform="translate(50, 40)">
          {/* Back Arm */}
          <line x1="0" y1="20" x2="0" y2="45" stroke="#a0a0a0" strokeWidth="8" strokeLinecap="round" className="animate-arm-b" />
          
          {/* Back Leg */}
          <line x1="0" y1="50" x2="0" y2="85" stroke="#333" strokeWidth="10" strokeLinecap="round" className="animate-leg-b" />
          
          {/* School Bag */}
          <rect x="-20" y="10" width="15" height="25" rx="5" fill="#FF6B2B" transform="rotate(-5)" />

          {/* Body */}
          <line x1="0" y1="10" x2="0" y2="50" stroke="#FF6B2B" strokeWidth="16" strokeLinecap="round" />
          
          {/* Head */}
          <circle cx="5" cy="-5" r="14" fill="#FFE0BD" />
          {/* Eye */}
          <circle cx="12" cy="-8" r="2" fill="#000" />
          {/* Smile */}
          <path d="M 12 -2 Q 15 2 17 -1" stroke="#000" strokeWidth="1.5" fill="transparent" strokeLinecap="round" />
          {/* Hair */}
          <path d="M -5 -5 Q 5 -20 18 -10" stroke="#111" strokeWidth="3" fill="transparent" strokeLinecap="round" />

          {/* Front Leg */}
          <line x1="0" y1="50" x2="0" y2="85" stroke="#1E1E1E" strokeWidth="10" strokeLinecap="round" className="animate-leg-f" />
          
          {/* Front Arm */}
          <line x1="0" y1="20" x2="0" y2="45" stroke="#FFE0BD" strokeWidth="8" strokeLinecap="round" className="animate-arm-f" />
        </g>
      </svg>
    </div>
  );
}
