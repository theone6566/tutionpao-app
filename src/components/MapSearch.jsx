import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Send, Lock, User, Star, MessageCircle } from 'lucide-react';
import L from 'leaflet';

// Fix basic marker icon issue in leaflet and react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Bhopal coordinates roughly
const center = [23.2599, 77.4126];

const mockTutors = [
  { id: 1, lat: 23.2620, lng: 77.4100, name: "Rahul S.", subject: "Maths", rating: 4.8, fee: "₹1500/mo", qualifications: "M.Sc Mathematics, IIT Delhi", experience: "5 Years", role: 'tutor' },
  { id: 2, lat: 23.2550, lng: 77.4150, name: "Priya M.", subject: "Science", rating: 4.9, fee: "₹2000/mo", qualifications: "B.Tech, NIT Bhopal", experience: "3 Years", role: 'tutor' },
];

const mockStudents = [
  { id: 3, lat: 23.2580, lng: 77.4180, name: "Aman Gupta", subject: "Maths", budget: "₹1200/mo", school: "DPS RK Puram", grade: "Class 10th (85%)", role: 'student' },
  { id: 4, lat: 23.2650, lng: 77.4080, name: "Sneha V.", subject: "Physics", budget: "₹1800/mo", school: "Kendriya Vidyalaya", grade: "Class 12th Board", role: 'student' },
];

import { useAppContext } from '../context/AppContext';
import { CheckCircle } from 'lucide-react';

export default function MapSearch({ mode, subject, budget, onClose }) {
  const [scanning, setScanning] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pingSent, setPingSent] = useState(false);
  const [targets, setTargets] = useState([]);
  const [userLocation, setUserLocation] = useState(center);
  
  const { sendPing, user, API_BASE } = useAppContext();

  useEffect(() => {
    // Get real location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        // Also update backend with location
        if (user && user._id) {
          fetch(`${API_BASE}/api/auth/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, lat: pos.coords.latitude, lng: pos.coords.longitude })
          });
        }
      });
    }

    // Fetch nearby users
    const fetchNearby = async () => {
      try {
        const targetRole = mode === 'student' ? 'tutor' : 'student';
        const res = await fetch(`${API_BASE}/api/auth/nearby?lat=${userLocation[0]}&lng=${userLocation[1]}&role=${targetRole}`);
        const data = await res.json();
        setTargets(data);
        setScanning(false);
      } catch (err) {
        console.error("Fetch nearby error:", err);
        setScanning(false);
      }
    };

    const timer = setTimeout(fetchNearby, 2000);
    return () => clearTimeout(timer);
  }, [mode, userLocation, user]);

  const handlePing = () => {
    if (!user) {
      alert("Please login first to send pings.");
      return;
    }
    const slotVal = document.getElementById('freeSlotInput')?.value || '';
    sendPing(selectedUser._id, slotVal);
    setPingSent(true);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#121212] flex flex-col md:flex-row">
      {/* Map Area */}
      <div className="relative flex-1 h-full">
        <MapContainer center={userLocation} zoom={14} className="w-full h-full" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>

          <Circle center={userLocation} pathOptions={{ fillColor: '#FF6B2B', color: '#FF6B2B' }} radius={5000} />

          {!scanning && targets.map(target => (
            <Marker 
              key={target._id} 
              position={[target.location.coordinates[1], target.location.coordinates[0]]}
              eventHandlers={{
                click: () => {
                  setSelectedUser(target);
                  setPingSent(false);
                },
              }}
            >
            </Marker>
          ))}
        </MapContainer>

        {/* Top Bar overlay */}
        <div className="absolute top-4 w-full px-4 z-[400] flex justify-between items-center pointer-events-none">
          <div className="bg-[#1E1E1E]/90 backdrop-blur pointer-events-auto px-4 py-2 rounded-full border border-gray-800 shadow-xl flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              {scanning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B2B] opacity-75"></span>}
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B2B]"></span>
            </span>
            <span className="text-sm font-semibold">
              {scanning ? "Scanning 5km radius..." : `Found ${targets.length} ${mode === 'student' ? 'tutors' : 'students'} nearby`}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="bg-[#1E1E1E]/90 backdrop-blur pointer-events-auto p-2 rounded-full border border-gray-800 hover:bg-gray-800 text-white transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Side Panel (Details & Chat) */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-full md:w-96 bg-[#1A1A1A] h-1/2 md:h-full absolute md:relative bottom-0 z-[400] border-t md:border-t-0 md:border-l border-gray-800 flex flex-col"
          >
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-800 relative bg-[#1A1A1A]">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#FF6B2B] overflow-hidden">
                  {selectedUser.photo ? (
                     <img src={selectedUser.photo} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                     <User size={32} className="text-[#FF6B2B]" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  {selectedUser.role === 'tutor' && (
                    <div className="flex items-center text-[#FF6B2B] text-sm font-semibold">
                      <Star size={14} className="fill-current mr-1" />
                      4.8 {/* Fixed rating for demo */}
                    </div>
                  )}
                  {selectedUser.role === 'student' && (
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1 border border-gray-700 inline-block px-2 py-0.5 rounded">
                      Student
                    </div>
                  )}
                </div>
              </div>
              
              {/* Detailed Profile Info */}
              <div className="bg-[#121212] rounded-xl p-4 grid grid-cols-1 gap-3 text-sm border border-gray-800 mb-2">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">Subject</span>
                  <span className="text-white font-bold">{selectedUser.subject || 'All Subjects'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">{mode==='student'?'Fee ':'Budget'}</span>
                  <span className="text-[#FF6B2B] font-bold">₹500-2000/mo</span>
                </div>
                {selectedUser.role === 'tutor' && (
                  <>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">Qualifications</span>
                      <span className="text-gray-300 font-medium text-right max-w-[150px]">{selectedUser.qualifications || 'B.A / B.Sc'}</span>
                    </div>
                  </>
                )}
                {selectedUser.role === 'student' && (
                  <>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-500">School</span>
                      <span className="text-gray-300 font-medium text-right max-w-[150px]">{selectedUser.school || 'Public School'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Area */}
            <div className="p-6 flex-1 flex flex-col bg-[#1A1A1A]">
              {!pingSent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-400 mb-4 text-sm">Send a request to connect. Contact numbers are hidden for privacy until accepted.</p>
                  
                  <input 
                    type="text" 
                    id="freeSlotInput"
                    placeholder="E.g., I'm free tomorrow after 5 PM" 
                    className="w-full bg-[#121212] mb-4 py-3 px-4 rounded-xl border border-gray-800 outline-none text-sm text-white focus:border-[#FF6B2B] transition"
                  />

                  <button 
                    onClick={handlePing}
                    className="w-full bg-[#FF6B2B] hover:bg-[#e85a1f] py-4 rounded-full font-bold flex items-center justify-center transition cursor-pointer shadow-lg shadow-[#FF6B2B]/20"
                  >
                    <Send size={18} className="mr-2" />
                    Send Connection Request
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Request Sent!</h4>
                  <p className="text-gray-400 text-sm mb-6">Check your Messages dashboard to see their reply and start chatting.</p>
                  <a href="/messages" className="text-[#FF6B2B] font-bold underline">Go to Messages</a>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
