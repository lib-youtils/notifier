import React from 'react';
import { motion } from 'motion/react';
import { PhoneOff, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Notifying() {
  const navigate = useNavigate();

  const handleDismiss = () => {
    navigate(-1);
  };

  return (
    <div className="mx-auto max-w-md min-h-[100dvh] bg-[#9E4D36] relative flex flex-col font-sans overflow-hidden">
      {/* Pulsing Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
           animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
           className="absolute w-64 h-64 border-[4px] border-white/20 rounded-full"
        />
        <motion.div
           animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
           className="absolute w-64 h-64 border-[4px] border-white/20 rounded-full"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 pt-20">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
           <span className="text-4xl font-black text-white">S</span>
        </div>
        
        <h2 className="text-white/80 text-xl font-bold uppercase tracking-widest mb-2">Incoming Ping</h2>
        <h1 className="text-5xl font-black text-white mb-6">Mom</h1>
        
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 mx-4">
           <p className="text-white text-lg font-medium leading-relaxed">
             "Are you free right now? Please call back when you see this."
           </p>
        </div>
      </div>

      <div className="p-8 pb-16 z-10 flex flex-row items-center justify-center space-x-12">
        <div className="flex flex-col items-center space-y-3">
          <button 
            onClick={handleDismiss}
            className="w-16 h-16 bg-white flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <PhoneOff className="w-6 h-6 text-[#9E4D36]" />
          </button>
          <span className="text-white/80 font-bold text-sm tracking-wide">Dismiss</span>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <button 
            onClick={handleDismiss}
            className="w-16 h-16 bg-[#3A312A] flex items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
          <span className="text-white/80 font-bold text-sm tracking-wide">Reply</span>
        </div>
      </div>
    </div>
  );
}
