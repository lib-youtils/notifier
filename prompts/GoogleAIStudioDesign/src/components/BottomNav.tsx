import React from 'react';
import { Home, LayoutDashboard, Bell, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export type TabKind = 'home' | 'dashboard' | 'notifications' | 'settings';

interface BottomNavProps {
  currentTab: TabKind;
  onChange: (tab: TabKind) => void;
}

export function BottomNav({ currentTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Trigger', icon: Home },
    { id: 'dashboard', label: 'Events', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="mx-4 mb-6 bg-white/80 backdrop-blur-3xl border border-[#EAE4DC]/60 shadow-[0_8px_32px_rgba(58,49,42,0.08)] rounded-[2rem] flex justify-around items-center h-[76px] px-2 relative z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as TabKind)}
            className="flex flex-col items-center justify-center w-full h-full space-y-1.5 relative group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-12 h-8">
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-[#EFEBE4] rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 relative z-10 transition-colors duration-200",
                  isActive ? "text-[#3A312A]" : "text-[#A89F95] group-hover:text-[#3A312A]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-bold tracking-wide transition-colors duration-200 z-10",
                isActive ? "text-[#3A312A]" : "text-[#A89F95] group-hover:text-[#3A312A]"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
