import React from 'react';
import { Plus, ShieldCheck, PhoneCall, Building } from 'lucide-react';

export const AppFooter = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-10 pb-8 mt-auto text-xs">
      <div className="w-full px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-800">
        {/* Col 1: Platform Brand */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-base">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">MediKiosk Platform</span>
          </div>
          <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
            All India Institute of Ayurveda (AIIA) & Ministry of Ayush AI First-Mile Clinical History Intake Platform. Securing patient care across 38 districts of Tamil Nadu.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[10px]">
              <ShieldCheck className="w-3 h-3 inline mr-1" /> ABDM Compliant (DPDP Act 2023)
            </span>
          </div>
        </div>

        {/* Col 2: Quick Links / Routes */}
        <div className="md:col-span-3 space-y-2.5">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Healthcare Portals</h4>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button onClick={() => onNavigate && onNavigate('/patient')} className="hover:text-emerald-400 transition flex items-center gap-1">
                ▸ Patient Health Portal (JOSEPH VIJAY)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate && onNavigate('/kiosk')} className="hover:text-emerald-400 transition flex items-center gap-1">
                ▸ OPD Voice Kiosk Case Intake
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate && onNavigate('/doctor')} className="hover:text-emerald-400 transition flex items-center gap-1">
                ▸ Doctor 2-Pane EHR Station
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate && onNavigate('/nurse')} className="hover:text-emerald-400 transition flex items-center gap-1">
                ▸ Staff Nurse Triage Station
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate && onNavigate('/receptionist')} className="hover:text-emerald-400 transition flex items-center gap-1">
                ▸ Receptionist Desk (Offline Walk-ins)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate && onNavigate('/admin')} className="hover:text-emerald-400 transition flex items-center gap-1">
                ▸ Hospital Desk Counter Offline OP
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Tamil Nadu Emergency Contacts */}
        <div className="md:col-span-3 space-y-2.5">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Emergency Services</h4>
          <div className="space-y-2 text-stone-400">
            <div className="flex items-center gap-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">108 Emergency Ambulance</div>
                <div className="text-[10px] text-stone-500">24x7 Toll-Free Medical Support</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <Building className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-white">104 Health Helpline TN</div>
                <div className="text-[10px] text-stone-500">Tamil Nadu State Tele-Consultation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: ABDM Health ID Notice */}
        <div className="md:col-span-2 space-y-2">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">ABDM Security</h4>
          <p className="text-stone-400 text-[11px]">
            Fully integrated with Ayushman Bharat Digital Mission (ABHA) standards and FHIR R4 interoperability specifications.
          </p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 pt-6 flex items-center justify-between flex-wrap gap-4 text-stone-500 text-[11px]">
        <div>
          © 2026 MediKiosk Platform • All India Institute of Ayurveda & Ministry of Ayush. All Rights Reserved.
        </div>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-stone-300 transition">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-stone-300 transition">Terms of Service</a>
          <span>•</span>
          <a href="#dpdp" className="hover:text-stone-300 transition">DPDP Act Compliance</a>
        </div>
      </div>
    </footer>
  );
};
