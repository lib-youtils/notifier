import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Zap, ScanLine, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function QuickTrigger({ onScanQR }: { onScanQR: () => void }) {
  const { events, currentUser, triggerNotification, quickTriggerEventId, setQuickTriggerEventId } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(quickTriggerEventId || null);
  const [importance, setImportance] = useState<'REGULAR' | 'URGENT' | 'SILENT'>('REGULAR');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (quickTriggerEventId) {
      setSelectedEventId(quickTriggerEventId);
      setQuickTriggerEventId(null);
    }
  }, [quickTriggerEventId, setQuickTriggerEventId]);

  const joinedEvents = events.filter((e) => e.subscribers.includes(currentUser.id) && !e.isArchived);
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  useEffect(() => {
    if (selectedEvent) {
      setImportance(selectedEvent.defaultMode || 'REGULAR');
      setMessage(selectedEvent.defaultMessage || '');
    }
  }, [selectedEventId, selectedEvent]);

  const handleTrigger = () => {
    if (!selectedEventId) return;
    
    setStatus('loading');
    
    setTimeout(() => {
      // Simulate API success/fail
      const isSuccess = Math.random() > 0.1; // 90% success rate mock
      
      if (isSuccess) {
        triggerNotification(selectedEventId, message || 'Ping!', importance);
        setStatus('success');
        setMessage('');
        setTimeout(() => setStatus('idle'), 2500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent relative pt-12 pb-40 px-6 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">Quick Trigger</h1>
          <p className="text-[#8B7C71] text-sm mt-1 font-medium">Send an alert instantly</p>
        </div>
        <div>
          <button
            onClick={onScanQR}
            className="p-3 bg-white rounded-full text-[#5C6956] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#EAE4DC] focus:outline-none hover:bg-[#FDFBF7] transition-all"
          >
            <ScanLine className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-bold text-[#8B7C71] mb-4 tracking-wide">TARGET EVENT</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 scrollbar-hide">
            {joinedEvents.length === 0 ? (
              <div className="text-sm text-[#8B7C71] italic py-2">You haven't joined any events yet.</div>
            ) : (
              joinedEvents.map((act) => {
                const isSelected = selectedEventId === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => setSelectedEventId(act.id)}
                    className={cn(
                      "flex-shrink-0 w-36 py-5 px-4 rounded-[1.5rem] text-left transition-all duration-300",
                      isSelected
                        ? "bg-[#6B7A65] text-[#FDFBF7] shadow-lg shadow-[#6B7A65]/20"
                        : "bg-white border border-[#EAE4DC] text-[#3A312A] shadow-sm shadow-black/5 hover:border-[#6B7A65]/40"
                    )}
                  >
                    <div className="line-clamp-2 text-[15px] font-bold leading-snug mb-1">{act.name}</div>
                    <div className={cn("text-xs font-semibold mt-2", isSelected ? "text-[#E6EBE4]" : "text-[#A89F95]")}>
                      {act.subscribers.length} subs
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <AnimatePresence>
          {selectedEventId && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8 overflow-hidden relative"
            >
              <div>
                <h2 className="text-sm font-bold text-[#8B7C71] mb-4 tracking-wide">ACTION TYPE</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(['SILENT', 'REGULAR', 'URGENT'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setImportance(type)}
                      className={cn(
                        "py-3.5 rounded-[1.25rem] text-xs font-bold transition-all border",
                        importance === type
                          ? type === 'URGENT' ? "bg-[#D97E69] border-[#D97E69] text-white shadow-md shadow-[#D97E69]/20"
                          : type === 'REGULAR' ? "bg-[#6B7A65] border-[#6B7A65] text-white shadow-md shadow-[#6B7A65]/20"
                          : "bg-[#8A95A5] border-[#8A95A5] text-white shadow-md shadow-[#8A95A5]/20"
                          : "bg-white border-[#EAE4DC] text-[#7A6A5E] hover:bg-[#F3EFEA] shadow-sm shadow-black/5"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#8B7C71] mb-4 tracking-wide">MESSAGE</h2>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full bg-white border border-[#EAE4DC] rounded-[1.5rem] p-5 text-[15px] font-medium text-[#3A312A] placeholder:text-[#B5AFA6] focus:outline-none focus:ring-2 focus:ring-[#8A9A84] focus:border-transparent resize-none h-28 shadow-sm shadow-black/5"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={status !== 'idle'}
                onClick={handleTrigger}
                className={cn(
                  "w-full py-5 rounded-[1.5rem] font-bold text-[15px] flex items-center justify-center space-x-2 text-white shadow-xl transition-all border",
                  importance === 'URGENT'
                    ? "bg-[#D97E69] border-[#C8735F] shadow-[#D97E69]/30"
                    : importance === 'REGULAR'
                    ? "bg-[#6B7A65] border-[#5E6A59] shadow-[#6B7A65]/30"
                    : "bg-[#8A95A5] border-[#7D8896] shadow-[#8A95A5]/30",
                  status !== 'idle' ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                <span>Fire Notification</span>
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
         {status !== 'idle' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 z-50 flex items-center justify-center bg-[#FDFBF7] backdrop-blur-sm"
           >
             <div className="flex flex-col items-center justify-center space-y-6">
                <motion.div
                   initial={{ scale: 0.8 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", bounce: 0.5 }}
                >
                   {status === 'loading' && (
                     <div className="w-24 h-24 bg-[#EAE4DC] rounded-[2rem] flex items-center justify-center animate-pulse">
                        <Loader2 className="w-10 h-10 text-[#8B7C71] animate-spin" />
                     </div>
                   )}
                   {status === 'success' && (
                     <div className="w-24 h-24 bg-[#6B7A65] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#6B7A65]/30">
                        <Check className="w-12 h-12 text-white" strokeWidth={3} />
                     </div>
                   )}
                   {status === 'error' && (
                     <div className="w-24 h-24 bg-[#D97E69] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#D97E69]/30">
                        <AlertCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                     </div>
                   )}
                </motion.div>
                
                <div className="text-center">
                   {status === 'loading' && <div className="text-xl font-extrabold text-[#3A312A]">Sending Alert...</div>}
                   {status === 'success' && <div className="text-xl font-extrabold text-[#6B7A65]">Ping Delivered</div>}
                   {status === 'error' && <div className="text-xl font-extrabold text-[#D97E69]">Failed to Send</div>}
                   <div className="text-sm font-medium text-[#8B7C71] mt-2">
                       {status === 'loading' ? 'Encrypting payload and dispatching' : status === 'success' ? 'All channel members have been notified' : 'Network interruption detected'}
                   </div>
                </div>
             </div>
           </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}
