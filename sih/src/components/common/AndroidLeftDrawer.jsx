import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import {
  Activity, Users, Calendar, Building2, UserPlus, FileSpreadsheet,
  ShieldCheck, LogOut, X, ChevronRight, LayoutDashboard, Stethoscope, User, UserCheck, HeartHandshake
} from 'lucide-react';

export const AndroidLeftDrawer = ({ isOpen, onClose, activeTab, onSelectTab }) => {
  const { viewMode, setViewMode, authenticatedUser } = usePatientSession();

  if (!isOpen) return null;

  const handleNavigate = (mode, tabName) => {
    setViewMode(mode);
    if (onSelectTab && tabName) {
      onSelectTab(tabName);
    }
    onClose(); // Automatically close / slide back after clicking as requested
  };

  const getActiveRoleLabel = () => {
    switch (viewMode) {
      case 'patient-portal': return 'PATIENT ROLE';
      case 'doctor': return 'DOCTOR ROLE';
      case 'nurse': return 'NURSE ROLE';
      case 'receptionist': return 'RECEPTIONIST ROLE';
      case 'admin': return 'CMCELL ROLE';
      case 'kiosk': return 'KIOSK OP INTAKE';
      default: return 'CMCELL ROLE';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
      {/* Dark Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Drawer Container - Dark Theme matching image media_1788784918423.jpg */}
      <div className="relative w-[85%] max-w-xs bg-stone-950 text-white h-full shadow-2xl flex flex-col justify-between z-10 transform transition-transform duration-300 ease-out overflow-y-auto border-r border-stone-800">
        
        {/* Top Header Section */}
        <div className="p-5 space-y-5">
          {/* Platform Avatar & Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-2xl text-stone-950 shadow-lg shadow-emerald-500/20 font-mono">
                M
              </div>
              <div>
                <h2 className="font-extrabold text-base text-white tracking-tight leading-tight">
                  MediKiosk Platform
                </h2>
                <div className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase mt-0.5">
                  HOSPITAL OPERATIONS AI
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white border border-stone-800 transition"
              aria-label="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logged in User/Role Card */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 space-y-1">
            <div className="text-[9px] uppercase font-mono font-bold text-stone-400 tracking-widest">
              LOGGED IN AS:
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="tracking-wide">{getActiveRoleLabel()}</span>
            </div>
            {authenticatedUser && (
              <div className="text-[11px] text-stone-300 font-semibold truncate pt-1 border-t border-stone-800/80 mt-1">
                {authenticatedUser.name}
              </div>
            )}
          </div>

          {/* CMCELL COMMAND CENTER Navigation Menu */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-1 pb-1">
              CMCELL COMMAND CENTER
            </div>

            <button
              onClick={() => handleNavigate('admin', 'command_center')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'admin' && activeTab === 'command_center'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>CMCELL Command Center</span>
            </button>

            <button
              onClick={() => handleNavigate('admin', 'patients')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'admin' && activeTab === 'patients'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Patients Management</span>
            </button>

            <button
              onClick={() => handleNavigate('appointments', 'calendar')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'appointments'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Appointments Calendar</span>
            </button>

            <button
              onClick={() => handleNavigate('admin', 'hospitals')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'admin' && activeTab === 'hospitals'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>TN Hospitals (380 Total)</span>
            </button>

            <button
              onClick={() => handleNavigate('receptionist', 'op_registration')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'receptionist'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Walk-in OP Registration</span>
            </button>

            <button
              onClick={() => handleNavigate('doctor', '360_portal')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'doctor'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Token Slips & Analytics (10)</span>
            </button>

            <button
              onClick={() => handleNavigate('admin', 'audit_logs')}
              className={`w-full p-3 rounded-2xl flex items-center gap-3 text-xs font-semibold transition ${
                viewMode === 'admin' && activeTab === 'audit_logs'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>System Audit Logs</span>
            </button>
          </div>
        </div>

        {/* Bottom Section: Switch Role Portal & Logout */}
        <div className="p-5 border-t border-stone-800/80 space-y-4 bg-stone-950">
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider">
              SWITCH ROLE PORTAL
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => handleNavigate('patient-portal')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-1.5 transition ${
                  viewMode === 'patient-portal'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <span className="text-emerald-400">▸</span> Patient
              </button>
              <button
                onClick={() => handleNavigate('receptionist')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-1.5 transition ${
                  viewMode === 'receptionist'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <span className="text-emerald-400">▸</span> Receptionist
              </button>
              <button
                onClick={() => handleNavigate('nurse')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-1.5 transition ${
                  viewMode === 'nurse'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <span className="text-emerald-400">▸</span> Nurse
              </button>
              <button
                onClick={() => handleNavigate('doctor')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-1.5 transition ${
                  viewMode === 'doctor'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                <span className="text-emerald-400">▸</span> Doctor
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNavigate('login')}
            className="w-full p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold flex items-center justify-center gap-2 border border-stone-800 transition"
          >
            <LogOut className="w-4 h-4 text-emerald-400" />
            <span>Logout CMCELL Desk</span>
          </button>

          <div className="text-center text-[11px] text-stone-500 font-mono pt-1">
            MediKiosk Hospital OS v2.4
          </div>
        </div>

      </div>
    </div>
  );
};
