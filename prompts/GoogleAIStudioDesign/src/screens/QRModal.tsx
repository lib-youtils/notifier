import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { X, QrCode, Camera, Download, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function QRModal({ type, onClose, initialEventId }: { type: 'scan' | 'show', onClose: () => void, initialEventId?: string | null }) {
  const { currentUser, events } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId || '');

  const userEvents = events.filter(e => e.creatorId === currentUser.id || e.subscribers.includes(currentUser.id));

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialEventId) {
      setSelectedEventId(initialEventId);
    } else if (userEvents.length > 0 && !selectedEventId) {
       setSelectedEventId(userEvents[0].id);
    }
  }, [userEvents, initialEventId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#2B231D]/80 backdrop-blur-md p-6"
    >
      {type === 'scan' ? (
        <div className="text-center w-full max-w-sm relative">
           <div className="absolute -top-16 right-0">
             <button onClick={onClose} className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors shadow-lg">
               <X className="w-6 h-6" />
             </button>
           </div>
           <div className="relative aspect-square w-full mx-auto overflow-hidden rounded-[2rem] mb-8">
              <div className="absolute inset-0 border-[3px] border-[#6B7A65] rounded-[2rem] z-10 pointer-events-none shadow-[0_0_0_4000px_rgba(43,35,29,0.5)] opacity-80" />
              <div className="w-full h-full bg-[#3A312A] flex items-center justify-center">
                 <Camera className="w-12 h-12 text-[#8B7C71] animate-pulse" />
              </div>
              <motion.div 
                 animate={{ y: ['0%', '100%', '0%'] }} 
                 transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                 className="absolute top-0 left-0 right-0 h-1 bg-[#85A090] shadow-[0_0_20px_rgba(133,160,144,0.8)] z-20"
              />
           </div>
           <h2 className="text-3xl font-extrabold text-[#FDFBF7] mb-3">Scan Code</h2>
           <p className="text-[#A89F95] font-medium text-[15px]">Position the QR within the frame to join a Ping channel.</p>
        </div>
      ) : (
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-[2rem] w-full max-w-sm shadow-2xl relative z-20 flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-extrabold text-[#3A312A]">Event QR</h2>
             <button onClick={onClose} className="p-2.5 bg-[#EAE4DC] hover:bg-[#DECDBC] transition-colors rounded-full text-[#7A6A5E]">
               <X className="w-5 h-5" />
             </button>
           </div>
           
           <div className="relative mb-6 z-30">
             <button
               type="button"
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="w-full flex items-center justify-between p-4 bg-white border border-[#EAE4DC] rounded-xl text-[15px] font-bold text-[#3A312A] focus:outline-none focus:ring-2 focus:ring-[#85A090]"
             >
               <span className="truncate">
                 {userEvents.find(e => e.id === selectedEventId)?.name || 'No events available'}
               </span>
               <ChevronDown className={cn("w-5 h-5 text-[#8B7C71] transition-transform", isDropdownOpen && "rotate-180")} />
             </button>
             
             <AnimatePresence>
               {isDropdownOpen && userEvents.length > 0 && (
                 <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.15 }}
                   className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EAE4DC] shadow-xl shadow-black/5 rounded-xl overflow-hidden max-h-48 overflow-y-auto"
                 >
                   {userEvents.map(e => (
                     <button
                       key={e.id}
                       onClick={() => {
                         setSelectedEventId(e.id);
                         setIsDropdownOpen(false);
                       }}
                       className={cn(
                         "w-full text-left px-4 py-3 text-[15px] font-bold hover:bg-[#FDFBF7] transition-colors border-b border-[#EAE4DC]/50 last:border-0",
                         selectedEventId === e.id ? "text-[#3A312A] bg-[#FDFBF7]" : "text-[#8B7C71]"
                       )}
                     >
                       {e.name}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           <div className="aspect-square bg-white rounded-3xl flex items-center justify-center mb-6 overflow-hidden border-[3px] border-[#EAE4DC]">
              <QrCode className="w-32 h-32 text-[#3A312A] opacity-80" strokeWidth={0.5} />
           </div>

           <p className="text-[15px] text-[#8B7C71] font-medium leading-relaxed text-center mb-8">
              Share this code to quickly invite others to join your alert channel.
           </p>

           <button className="w-full bg-[#6B7A65] text-white font-bold py-4 rounded-[1.25rem] text-[15px] flex items-center justify-center space-x-2 shadow-xl shadow-[#6B7A65]/20 hover:bg-[#5C6956] transition-colors">
             <Download className="w-5 h-5" />
             <span>Save to Gallery</span>
           </button>
        </div>
      )}
    </motion.div>
  );
}
