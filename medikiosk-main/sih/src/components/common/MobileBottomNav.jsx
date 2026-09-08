import React from 'react';
import { User, Mic, Stethoscope, HeartHandshake, UserCheck } from 'lucide-react';

export const MobileBottomNav = ({ viewMode, onNavigate }) => {
  const navItems = [
    { id: 'patient-portal', label: 'Patient', path: '/patient', icon: User },
    { id: 'kiosk', label: 'Voice Kiosk', path: '/kiosk', icon: Mic },
    { id: 'doctor', label: 'Doctor', path: '/doctor', icon: Stethoscope },
    { id: 'nurse', label: 'Nurse', path: '/nurse', icon: HeartHandshake },
    { id: 'receptionist', label: 'Walk-in OP', path: '/receptionist', icon: UserCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 py-1.5 px-2 flex items-center justify-around md:hidden shadow-xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = viewMode === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.path, item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-emerald-400 bg-emerald-950/80 font-bold scale-105 border border-emerald-800/80'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
