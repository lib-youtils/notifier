import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { BottomNav, TabKind } from './components/BottomNav';
import { QuickTrigger } from './screens/QuickTrigger';
import { Dashboard } from './screens/Dashboard';
import { Notifications } from './screens/Notifications';
import { SettingsScreen } from './screens/SettingsScreen';
import { CreateEventModal } from './screens/CreateEventModal';
import { QRModal } from './screens/QRModal';
import { Onboarding } from './screens/Onboarding';
import { TestRoute } from './screens/TestRoute';
import { Notifying } from './screens/Notifying';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<TabKind>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [qrModalType, setQrModalType] = useState<'scan' | 'show' | null>(null);
  const [qrModalEventId, setQrModalEventId] = useState<string | null>(null);

  const { setQuickTriggerEventId } = useApp();

  // Direction logic for slide transitions
  const tabOrder = ['home', 'dashboard', 'notifications', 'settings'];
  const currentIndex = tabOrder.indexOf(currentTab);
  
  // Keep track of previous index to determine slide direction
  const [prevIndex, setPrevIndex] = useState(0);

  const handleTabChange = (newTab: TabKind) => {
    setPrevIndex(currentIndex);
    setCurrentTab(newTab);
  };

  const direction = currentIndex > prevIndex ? 1 : -1;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      z: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="mx-auto max-w-md min-h-[100dvh] bg-[#FDFBF7] shadow-xl relative flex flex-col font-sans overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-transparent">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex flex-col"
          >
            {currentTab === 'home' && (
              <QuickTrigger 
                onScanQR={() => setQrModalType('scan')} 
              />
            )}
            {currentTab === 'dashboard' && <Dashboard onEditEvent={(id) => { setEditingEventId(id); setIsCreateModalOpen(true); }} onShowQR={(id) => { setQrModalEventId(id); setQrModalType('show'); }} onQuickTriggerSetup={(id) => { setQuickTriggerEventId(id); handleTabChange('home'); }} />}
            {currentTab === 'notifications' && <Notifications />}
            {currentTab === 'settings' && <SettingsScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {currentTab !== 'settings' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-32 right-6 z-40"
          >
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#3A312A] text-white p-4 rounded-2xl shadow-xl shadow-[#3A312A]/20 hover:scale-105 active:scale-95 transition-all focus:outline-none"
            >
              <Plus className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 w-full z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <BottomNav currentTab={currentTab} onChange={handleTabChange} />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateEventModal 
            editingEventId={editingEventId}
            onClose={() => {
              setIsCreateModalOpen(false);
              setEditingEventId(null);
            }} 
          />
        )}
        {qrModalType && <QRModal type={qrModalType} onClose={() => { setQrModalType(null); setQrModalEventId(null); }} initialEventId={qrModalEventId} />}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F0EBE1] flex justify-center">
          <div className="w-full max-w-md">
            <Routes>
              <Route path="/" element={<MainApp />} />
              <Route path="/onboard" element={<Onboarding />} />
              <Route path="/test-route" element={<TestRoute />} />
              <Route path="/notifying" element={<Notifying />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
