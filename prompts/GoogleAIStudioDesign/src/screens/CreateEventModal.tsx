import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { NotificationImportance } from '../types';

export function CreateEventModal({ onClose, editingEventId }: { onClose: () => void, editingEventId?: string | null }) {
  const { createEvent, updateEvent, events } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultMessage, setDefaultMessage] = useState('');
  const [defaultMode, setDefaultMode] = useState<NotificationImportance>('REGULAR');
  const [isPublic, setIsPublic] = useState(true);
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'custom'>('none');
  const [scheduledTimeString, setScheduledTimeString] = useState('');

  const [isRecurrenceDropdownOpen, setIsRecurrenceDropdownOpen] = useState(false);

  useEffect(() => {
    if (editingEventId) {
      const eventToEdit = events.find(e => e.id === editingEventId);
      if (eventToEdit) {
        setName(eventToEdit.name);
        setDescription(eventToEdit.description || '');
        setDefaultMessage(eventToEdit.defaultMessage || '');
        setDefaultMode(eventToEdit.defaultMode);
        setIsPublic(eventToEdit.isPublic);
        setRecurrence(eventToEdit.recurrence);
        if (eventToEdit.scheduledTime) {
          const date = new Date(eventToEdit.scheduledTime);
          const tzoffset = (new Date()).getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
          setScheduledTimeString(localISOTime);
        }
      }
    }
  }, [editingEventId, events]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    let scheduledTime: number | undefined;
    if (scheduledTimeString) {
      scheduledTime = new Date(scheduledTimeString).getTime();
    }
    
    if (editingEventId) {
      updateEvent(editingEventId, { name, description, defaultMessage, defaultMode, isPublic, recurrence, scheduledTime });
    } else {
      createEvent({
        name,
        description,
        defaultMessage,
        defaultMode,
        isPublic,
        recurrence,
        scheduledTime,
      });
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-end justify-center bg-[#2B231D]/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="w-full max-w-md bg-[#FDFBF7] rounded-t-[2rem] rounded-b-none p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#3A312A]">{editingEventId ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="p-2.5 bg-[#EAE4DC] hover:bg-[#DECDBC] transition-colors rounded-full text-[#7A6A5E]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#8B7C71] uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Server Alerts"
              className="w-full bg-white border border-[#EAE4DC] rounded-xl px-5 py-4 text-[15px] font-bold text-[#3A312A] placeholder:text-[#B5AFA6] focus:outline-none focus:ring-2 focus:ring-[#85A090]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B7C71] uppercase tracking-wider mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this event for?"
              className="w-full bg-white border border-[#EAE4DC] rounded-xl px-5 py-4 text-[15px] font-medium text-[#3A312A] placeholder:text-[#B5AFA6] h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#85A090]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B7C71] uppercase tracking-wider mb-2">Default Message (Optional)</label>
            <input
              type="text"
              value={defaultMessage}
              onChange={(e) => setDefaultMessage(e.target.value)}
              placeholder="e.g. Server is down, please join call"
              className="w-full bg-white border border-[#EAE4DC] rounded-xl px-5 py-4 text-[15px] font-bold text-[#3A312A] placeholder:text-[#B5AFA6] focus:outline-none focus:ring-2 focus:ring-[#85A090]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-[#8B7C71] uppercase tracking-wider mb-2">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledTimeString}
                  onChange={(e) => setScheduledTimeString(e.target.value)}
                  className="w-full bg-white border border-[#EAE4DC] rounded-xl px-4 py-3 text-[14px] font-bold text-[#3A312A] placeholder:text-[#B5AFA6] focus:outline-none focus:ring-2 focus:ring-[#85A090]"
                />
             </div>
             
             <div>
                <label className="block text-xs font-bold text-[#8B7C71] uppercase tracking-wider mb-2">Recurrence</label>
                <div className="relative z-30">
                  <button
                    type="button"
                    onClick={() => setIsRecurrenceDropdownOpen(!isRecurrenceDropdownOpen)}
                    className="w-full flex items-center justify-between bg-white border border-[#EAE4DC] rounded-xl px-4 py-3 text-[14px] font-bold text-[#3A312A] focus:outline-none focus:ring-2 focus:ring-[#85A090]"
                  >
                    <span className="truncate">
                      {recurrence === 'none' ? 'Once' : recurrence === 'daily' ? 'Daily' : recurrence === 'weekly' ? 'Weekly' : 'Custom...'}
                    </span>
                    <ChevronDown className={cn("w-5 h-5 text-[#8B7C71] transition-transform", isRecurrenceDropdownOpen && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {isRecurrenceDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EAE4DC] shadow-xl shadow-black/5 rounded-xl overflow-hidden"
                      >
                        {[
                          { value: 'none', label: 'Once' },
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'custom', label: 'Custom...' },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setRecurrence(opt.value as any);
                              setIsRecurrenceDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-[14px] font-bold hover:bg-[#FDFBF7] transition-colors border-b border-[#EAE4DC]/50 last:border-0",
                              recurrence === opt.value ? "text-[#3A312A] bg-[#FDFBF7]" : "text-[#8B7C71]"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             </div>
          </div>

           <div>
            <label className="block text-xs font-bold text-[#8B7C71] uppercase tracking-wider mb-2">Default Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {(['SILENT', 'REGULAR', 'URGENT'] as NotificationImportance[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDefaultMode(mode)}
                  className={cn(
                    "py-3 rounded-xl text-xs font-bold capitalize transition-all border",
                    defaultMode === mode 
                      ? mode === 'URGENT' ? "bg-[#D97E69] text-white border-[#D97E69] shadow-md shadow-[#D97E69]/20"
                      : mode === 'REGULAR' ? "bg-[#6B7A65] text-white border-[#6B7A65] shadow-md shadow-[#6B7A65]/20"
                      : "bg-[#8A95A5] text-white border-[#8A95A5] shadow-md shadow-[#8A95A5]/20"
                    : "bg-white text-[#7A6A5E] border-[#EAE4DC] hover:bg-[#F3EFEA] shadow-sm"
                  )}
                >
                  {mode.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6B7A65] text-white font-bold py-5 rounded-[1.25rem] text-[15px] hover:bg-[#5C6956] transition-colors shadow-xl shadow-[#6B7A65]/20 mt-2"
          >
            {editingEventId ? 'Save Changes' : 'Create Event'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
