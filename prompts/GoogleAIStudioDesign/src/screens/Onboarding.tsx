import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BellRing, Users, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 'connect',
    title: 'Connect with Groups',
    description: 'Create or join event channels with your friends, family, or team using QR codes.',
    icon: Users,
    color: 'bg-[#EAE4DC]',
    iconColor: 'text-[#8B7C71]'
  },
  {
    id: 'notify',
    title: 'Reach Them Instantly',
    description: 'Send silent pings or break through DND modes with urgent full-screen alerts.',
    icon: BellRing,
    color: 'bg-[#FCECE8]',
    iconColor: 'text-[#9E4D36]'
  },
  {
    id: 'trigger',
    title: 'Quick Actions',
    description: 'Set up quick triggers to notify your circle in seconds when you need them most.',
    icon: Zap,
    color: 'bg-[#E9EDE7]',
    iconColor: 'text-[#6B7A65]'
  }
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      navigate('/');
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-md min-h-[100dvh] bg-[#FDFBF7] shadow-xl relative flex flex-col font-sans overflow-hidden">
      <div className="flex justify-end p-6 z-20">
        <button onClick={handleSkip} className="text-sm font-bold text-[#8B7C71] uppercase tracking-wide px-4 py-2">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-[-60px]"
          >
            <div className={`w-32 h-32 rounded-full ${slides[currentSlide].color} flex items-center justify-center mb-8`}>
              {React.createElement(slides[currentSlide].icon, { className: `w-14 h-14 ${slides[currentSlide].iconColor}` })}
            </div>
            
            <h2 className="text-3xl font-extrabold text-[#3A312A] mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-[#8B7C71] text-lg font-medium leading-relaxed max-w-[280px]">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 pb-12">
        <div className="flex justify-center space-x-2 mb-10">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-[#3A312A]' : 'w-2.5 bg-[#EAE4DC]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-[#3A312A] text-white py-4 rounded-[1.25rem] font-bold text-lg flex items-center justify-center space-x-2 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
          {currentSlide === slides.length - 1 ? (
             <Check className="w-5 h-5" />
          ) : (
             <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
