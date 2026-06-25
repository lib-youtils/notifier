import React, { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { LogOut, BellOff, Shield, Smartphone, ArchiveX, ChevronLeft, Calendar, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function SettingsScreen() {
  const { currentUser, events } = useApp();
  const [viewingArchived, setViewingArchived] = useState(false);
  const navigate = useNavigate();

  const archivedEvents = events.filter((e) => e.creatorId === currentUser.id && e.isArchived);

  if (viewingArchived) {
    return (
      <div className="flex-1 overflow-y-auto bg-transparent pt-12 pb-40 px-6 min-h-screen">
        <button 
          onClick={() => setViewingArchived(false)} 
          className="mb-8 flex flex-row items-center space-x-2 text-[#8B7C71] font-bold text-sm tracking-wide bg-[#EAE4DC] w-max px-4 py-2 rounded-xl"
        >
           <ChevronLeft className="w-5 h-5" />
           <span>BACK TO SETTINGS</span>
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">Archived Events</h1>
          <p className="text-[#8B7C71] text-sm mt-1 font-medium">Events you have archived</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {archivedEvents.length === 0 ? (
               <div className="text-center py-12">
                 <p className="text-[#8B7C71] font-medium text-[15px]">No archived events.</p>
               </div>
            ) : (
              archivedEvents.map((event) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={event.id}
                  className="bg-white p-5 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EAE4DC] text-left opacity-70"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-extrabold text-[#3A312A] truncate pr-4">{event.name}</h3>
                    <div className="px-2.5 py-1 bg-[#F5F6F8] text-[#8B7C71] border border-[#EAE4DC] rounded-lg text-[10px] font-extrabold tracking-wide uppercase">
                       Archived
                    </div>
                  </div>
                  <p className="text-[15px] text-[#7A6A5E] font-medium line-clamp-2 mb-5 leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-transparent pt-12 pb-40 px-6 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">Settings</h1>
      </div>

      <div className="bg-white rounded-[1.75rem] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EAE4DC] flex items-center space-x-5 mb-8">
        <img src={currentUser.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full bg-[#F3EFEA] border border-[#EAE4DC]" />
        <div>
          <h2 className="text-xl font-extrabold text-[#3A312A]">{currentUser.name}</h2>
          <p className="text-[15px] text-[#8B7C71] font-bold">{currentUser.handle}</p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-[1.75rem] border border-[#EAE4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
           <button className="w-full flex items-center px-5 py-5 hover:bg-[#FDFBF7] transition-colors border-b border-[#EAE4DC]/50">
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F4] flex items-center justify-center mr-4">
                 <BellOff className="w-5 h-5 text-[#6B7A65]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-bold text-[#3A312A]">Push Preferences</div>
                <div className="text-xs text-[#8B7C71] font-medium mt-0.5">Manage alert behaviors</div>
              </div>
           </button>
           <button className="w-full flex items-center px-5 py-5 hover:bg-[#FDFBF7] transition-colors border-b border-[#EAE4DC]/50">
              <div className="w-10 h-10 rounded-xl bg-[#FFF6F3] flex items-center justify-center mr-4">
                 <Shield className="w-5 h-5 text-[#D97E69]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-bold text-[#3A312A]">Privacy & Security</div>
                <div className="text-xs text-[#8B7C71] font-medium mt-0.5">Control who can ping you</div>
              </div>
           </button>
           <button onClick={() => setViewingArchived(true)} className="w-full flex items-center px-5 py-5 hover:bg-[#FDFBF7] transition-colors border-b border-[#EAE4DC]/50">
              <div className="w-10 h-10 rounded-xl bg-[#EFEBE4] flex items-center justify-center mr-4">
                 <ArchiveX className="w-5 h-5 text-[#8B7C71]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-bold text-[#3A312A]">Archived Events</div>
                <div className="text-xs text-[#8B7C71] font-medium mt-0.5">View and manage older events</div>
              </div>
           </button>
           <button className="w-full flex items-center px-5 py-5 hover:bg-[#FDFBF7] transition-colors border-b border-[#EAE4DC]/50">
              <div className="w-10 h-10 rounded-xl bg-[#EFEBE4] flex items-center justify-center mr-4">
                 <Smartphone className="w-5 h-5 text-[#8B7C71]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-bold text-[#3A312A]">Device Settings</div>
                <div className="text-xs text-[#8B7C71] font-medium mt-0.5">Vibration & System sounds</div>
              </div>
           </button>
           <button onClick={() => navigate('/test-route')} className="w-full flex items-center px-5 py-5 hover:bg-[#FDFBF7] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EFEBE4] flex items-center justify-center mr-4">
                 <Smartphone className="w-5 h-5 text-[#3A312A]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-bold text-[#3A312A]">Debug & Testing</div>
                <div className="text-xs text-[#8B7C71] font-medium mt-0.5">Test routes and components</div>
              </div>
           </button>
        </section>

        <section>
          <button className="w-full flex items-center justify-center py-5 bg-white rounded-[1.5rem] border border-[#EAE4DC] text-[#D97E69] font-bold text-[15px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:bg-[#FFF6F3] transition-colors">
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
}
