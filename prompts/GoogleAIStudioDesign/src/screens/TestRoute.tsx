import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Compass, BellRing } from 'lucide-react';

export function TestRoute() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md min-h-[100dvh] bg-[#FDFBF7] shadow-xl relative flex flex-col font-sans px-6 pt-12 pb-24">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex flex-row items-center space-x-2 text-[#8B7C71] font-bold text-sm tracking-wide bg-[#EAE4DC] w-max px-4 py-2 rounded-xl"
      >
         <ChevronLeft className="w-5 h-5" />
         <span>BACK</span>
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#3A312A]">Test Routes</h1>
        <p className="text-[#8B7C71] text-sm mt-1 font-medium">Navigate to different standalone modes</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('/onboard')}
          className="w-full bg-white p-6 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EAE4DC] flex items-center justify-between group hover:border-[#3A312A]/30 transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#E9EDE7] rounded-xl flex items-center justify-center">
               <Compass className="w-6 h-6 text-[#6B7A65]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#3A312A]">Onboarding Flow</h3>
              <p className="text-[#8B7C71] text-sm font-medium">View the 3-step intro sliders</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/notifying')}
          className="w-full bg-white p-6 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EAE4DC] flex items-center justify-between group hover:border-[#9E4D36]/30 transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#FCECE8] rounded-xl flex items-center justify-center">
               <BellRing className="w-6 h-6 text-[#9E4D36]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#3A312A]">Urgent Notify Page</h3>
              <p className="text-[#8B7C71] text-sm font-medium">Simulate an incoming urgent SOS</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
