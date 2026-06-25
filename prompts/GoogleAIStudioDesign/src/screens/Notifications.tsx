import React from 'react';
import { useApp } from '../store';
import { formatDistanceToNow } from 'date-fns';
import { BellRing, ShieldAlert, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Notifications() {
  const { notifications, events, users, currentUser } = useApp();

  // Filter notifications for events I'm subscribed to
  const myNotifications = notifications.filter((n) => {
    const event = events.find((e) => e.id === n.eventId);
    return event && event.subscribers.includes(currentUser.id);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-transparent pt-12 pb-40 px-6 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">Notifications</h1>
          <p className="text-[#8B7C71] text-sm mt-1 font-medium">Recent pings from your events</p>
        </div>
        <div className="px-4 py-1.5 bg-[#EAE4DC] text-[#5C4D43] rounded-full text-xs font-bold shadow-sm">
          {myNotifications.length} New
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {myNotifications.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-[#8B7C71] font-medium text-[15px]">All caught up!</p>
             </div>
          ) : (
             myNotifications.map((notif) => {
              const event = events.find((e) => e.id === notif.eventId);
              const triggerUser = users.find((u) => u.id === notif.triggerUserId);

              const isUrgent = notif.importance === 'URGENT';
              const isSilent = notif.importance === 'SILENT';

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={notif.id}
                  className={cn(
                    "p-5 rounded-[1.5rem] relative overflow-hidden flex space-x-4 border",
                    isUrgent
                      ? "bg-[#FDF7F5] border-[#D97E69]/30 shadow-sm"
                      : "bg-white border-[#EAE4DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                  )}
                >
                  {isUrgent && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D97E69]" />
                  )}
                  
                  <div className="flex-shrink-0 mt-1">
                    {triggerUser ? (
                      <img src={triggerUser.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border border-[#EAE4DC] bg-[#F3EFEA]" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#F3EFEA] border border-[#EAE4DC]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-[11px] font-bold tracking-widest text-[#8B7C71] uppercase">
                        {event?.name}
                      </div>
                      <span className="text-[11px] text-[#A89F95] font-bold whitespace-nowrap">
                        {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                      </span>
                    </div>

                    <p className={cn(
                      "text-[15px] mb-2 leading-relaxed text-[#3A312A] font-medium",
                      isUrgent && "text-[#9E4D36] font-bold"
                    )}>
                      {notif.message}
                    </p>

                    <div className="flex items-center space-x-2 mt-3">
                       <span className="text-[12px] font-bold text-[#8B7C71]">
                         {triggerUser?.name}
                       </span>
                       {isUrgent && (
                         <span className="flex items-center text-[10px] tracking-wide text-[#9E4D36] font-extrabold bg-[#FCECE8] px-2 py-0.5 rounded-md">
                           <ShieldAlert className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} /> URGENT
                         </span>
                       )}
                       {isSilent && (
                         <span className="text-[10px] tracking-wide text-[#8A95A5] font-extrabold bg-[#F5F6F8] px-2 py-0.5 rounded-md">
                           SILENT
                         </span>
                       )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
