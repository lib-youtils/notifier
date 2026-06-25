import React, { useState } from 'react';
import { useApp } from '../store';
import { Users, Calendar, Settings2, QrCode, AlertTriangle, LogOut, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard({ onEditEvent, onShowQR, onQuickTriggerSetup }: { onEditEvent: (id: string) => void, onShowQR: (id: string) => void, onQuickTriggerSetup: (id: string) => void }) {
  const { events, currentUser, leaveEvent } = useApp();
  const [activeTab, setActiveTab] = useState<'joined' | 'my_events'>('joined');
  const [viewingEventId, setViewingEventId] = useState<string | null>(null);
  
  const [showUnsubscribeWarning, setShowUnsubscribeWarning] = useState(false);

  const myEvents = events.filter((e) => e.creatorId === currentUser.id && !e.isArchived);
  const joinedEvents = events.filter((e) => e.subscribers.includes(currentUser.id) && e.creatorId !== currentUser.id);

  const displayedEvents = activeTab === 'my_events' ? myEvents : joinedEvents;
  const viewingEvent = viewingEventId ? events.find(e => e.id === viewingEventId) : null;

  const handleUnsubscribe = () => {
    if (viewingEvent) {
      leaveEvent(viewingEvent.id);
      setViewingEventId(null);
      setShowUnsubscribeWarning(false);
    }
  };

  if (viewingEvent) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent pt-12 pb-40 px-6 min-h-screen flex flex-col relative">
        <button onClick={() => setViewingEventId(null)} className="mb-6 flex flex-row items-center space-x-2 text-[#8B7C71] font-bold text-sm tracking-wide bg-[#EAE4DC] w-max px-4 py-2 rounded-xl">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           <span>BACK</span>
        </button>
        <div className="flex justify-between items-start mb-6">
           <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">{viewingEvent.name}</h1>
           <div className="flex space-x-2">
             <button onClick={() => onShowQR(viewingEvent.id)} className="p-2.5 bg-white border border-[#EAE4DC] hover:bg-[#F3EFEA] rounded-full transition-colors focus:outline-none shadow-sm shadow-black/5">
               <QrCode className="w-5 h-5 text-[#8B7C71]" />
             </button>
             {viewingEvent.creatorId === currentUser.id && !viewingEvent.isArchived && (
               <button onClick={() => onEditEvent(viewingEvent.id)} className="p-2.5 bg-white border border-[#EAE4DC] hover:bg-[#F3EFEA] rounded-full transition-colors focus:outline-none shadow-sm shadow-black/5">
                 <Settings2 className="w-5 h-5 text-[#8B7C71]" />
               </button>
             )}
           </div>
        </div>
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-[1.5rem] border border-[#EAE4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
             <h3 className="text-xs font-bold text-[#8B7C71] mb-2 tracking-wide uppercase">Description</h3>
             <p className="text-[15px] text-[#3A312A] font-medium leading-relaxed">{viewingEvent.description || 'No description provided.'}</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-[1.5rem] border border-[#EAE4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-[#F5F7F4] text-[#6B7A65] rounded-full flex items-center justify-center mb-3">
                     <Users className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#3A312A]">{viewingEvent.subscribers.length}</div>
                  <div className="text-xs font-bold text-[#8B7C71] uppercase tracking-wide">Members</div>
               </div>
               
               <div className="bg-white p-5 rounded-[1.5rem] border border-[#EAE4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
                  <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                      viewingEvent.defaultMode === 'URGENT' ? "bg-[#FCECE8] text-[#9E4D36]"
                      : viewingEvent.defaultMode === 'REGULAR' ? "bg-[#F5F7F4] text-[#4F644B]"
                      : "bg-[#F5F6F8] text-[#8A95A5]"
                  )}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="text-lg font-extrabold text-[#3A312A]">{viewingEvent.defaultMode}</div>
                  <div className="text-xs font-bold text-[#8B7C71] uppercase tracking-wide">Default Mode</div>
               </div>
           </div>

           <div className="pt-4 grid grid-cols-1 gap-3">
             {viewingEvent.creatorId === currentUser.id && !viewingEvent.isArchived && (
                <button
                  onClick={() => onQuickTriggerSetup(viewingEvent.id)}
                  className="w-full bg-[#6B7A65] text-white py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center space-x-2 shadow-lg shadow-[#6B7A65]/20 hover:bg-[#5C6956] transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  <span>Add to Quick trigger</span>
                </button>
             )}

             {viewingEvent.creatorId !== currentUser.id && (
                <button
                  onClick={() => setShowUnsubscribeWarning(true)}
                  className="w-full bg-white border border-[#E8D9D5] text-[#9E4D36] py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center space-x-2 shadow-sm hover:bg-[#FDF8F6] transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Unsubscribe</span>
                </button>
             )}
           </div>
        </div>

        <AnimatePresence>
          {showUnsubscribeWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[2rem] p-6 shadow-2xl w-full max-w-sm"
              >
                <div className="w-12 h-12 bg-[#FCECE8] rounded-full flex items-center justify-center mb-4 mx-auto">
                   <AlertTriangle className="w-6 h-6 text-[#9E4D36]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#3A312A] text-center mb-2">Unsubscribe?</h3>
                <p className="text-center text-[#8B7C71] text-[15px] font-medium leading-relaxed mb-6">
                   You will no longer receive updates or pings from <strong className="text-[#3A312A]">{viewingEvent.name}</strong>. You'll need an invite code to join again.
                </p>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => setShowUnsubscribeWarning(false)} className="py-3.5 bg-[#F5F6F8] text-[#3A312A] font-bold rounded-xl text-[15px]">Cancel</button>
                   <button onClick={handleUnsubscribe} className="py-3.5 bg-[#D97E69] text-white font-bold rounded-xl text-[15px] shadow-lg shadow-[#D97E69]/20">Unsubscribe</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-transparent pt-12 pb-40 px-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">Events</h1>
        <p className="text-[#8B7C71] text-sm mt-1 font-medium">Manage your connections</p>
      </div>

      <div className="bg-[#EAE4DC] p-1.5 rounded-2xl flex mb-8 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('joined')}
          className={cn(
            "flex-1 py-2.5 text-[15px] font-bold rounded-xl transition-all",
            activeTab === 'joined' ? "bg-white text-[#3A312A] shadow-sm shadow-black/5" : "text-[#8B7C71]"
          )}
        >
          Joined
        </button>
        <button
          onClick={() => setActiveTab('my_events')}
          className={cn(
            "flex-1 py-2.5 text-[15px] font-bold rounded-xl transition-all",
            activeTab === 'my_events' ? "bg-white text-[#3A312A] shadow-sm shadow-black/5" : "text-[#8B7C71]"
          )}
        >
          Created by Me
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedEvents.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-[#8B7C71] font-medium text-[15px]">No events found.</p>
             </div>
          ) : (
            displayedEvents.map((event) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={event.id}
                onClick={() => setViewingEventId(event.id)}
                className={cn(
                  "bg-white p-5 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative overflow-hidden group cursor-pointer transition-colors text-left border",
                  "border-[#EAE4DC] hover:border-[#6B7A65]/30"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-extrabold text-[#3A312A] truncate pr-4">{event.name}</h3>
                  {activeTab === 'joined' && (
                     <div className="px-2.5 py-1 bg-[#F5F7F4] text-[#6B7A65] border border-[#6B7A65]/20 rounded-lg text-[10px] font-extrabold tracking-wide uppercase">
                        Subscribed
                     </div>
                  )}
                </div>
                <p className="text-[15px] text-[#7A6A5E] font-medium line-clamp-2 mb-5 leading-relaxed">
                  {event.description}
                </p>
                <div className="flex items-center text-xs font-bold text-[#A89F95] space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-[#8B7C71]" />
                    <span>{event.subscribers.length} {event.subscribers.length === 1 ? 'member' : 'members'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={cn(
                      "text-[10px] tracking-wide uppercase font-extrabold px-2 py-0.5 rounded-md",
                      event.defaultMode === 'URGENT' ? "bg-[#FCECE8] text-[#9E4D36]"
                      : event.defaultMode === 'REGULAR' ? "bg-[#F5F7F4] text-[#4F644B]"
                      : "bg-[#F5F6F8] text-[#8A95A5]"
                    )}>
                      {event.defaultMode}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
