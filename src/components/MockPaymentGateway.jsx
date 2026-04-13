import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Smartphone } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function MockPaymentGateway({ isOpen, onClose, plan, price }) {
  const [step, setStep] = useState(1); // 1: QR/UPI, 2: Processing, 3: Success
  const { subscribe } = useAppContext();

  if (!isOpen) return null;

  const initiatePayment = () => {
    setStep(2);
    setTimeout(() => {
      setStep(3);
      subscribe(plan);
      setTimeout(() => {
        onClose();
        setStep(1); // reset for next time
      }, 2000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step === 1 ? onClose : undefined}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Gateway Panel */}
      <motion.div 
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col text-black h-[500px]"
      >
        
        {/* Header */}
        <div className="bg-[#0b192c] text-white p-4 flex justify-between items-center relative">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center font-bold text-xs">R</div>
            <span className="font-semibold text-sm">Razorpay Mock</span>
          </div>
          {step === 1 && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition cursor-pointer">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">{plan} Subscription</div>
                  <div className="text-3xl font-bold">₹{price}<span className="text-sm text-gray-500 font-normal">.00</span></div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col items-center">
                  <div className="w-40 h-40 bg-gray-200 mb-2 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    [ QR CODE ]
                  </div>
                  <p className="text-xs text-gray-500">Scan with any UPI app</p>
                </div>

                <button 
                  onClick={initiatePayment}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl flex justify-center items-center cursor-pointer hover:bg-gray-800 transition"
                >
                  <Smartphone className="mr-2" size={18} /> Pay ₹{price} via UPI
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <div className="font-semibold text-gray-800">Processing Payment...</div>
                <p className="text-sm text-gray-500 mt-2">Please do not close this window</p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                </motion.div>
                <div className="font-bold text-xl text-gray-800 mb-1">Payment Successful!</div>
                <p className="text-sm text-gray-500">Your subscription is now active.</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 text-center text-[10px] text-gray-400 flex items-center justify-center font-medium border-t border-gray-200">
          🔒 Secured by TutionPao Gateway
        </div>

      </motion.div>
    </div>
  );
}
