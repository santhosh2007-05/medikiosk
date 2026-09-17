import React, { useState } from 'react';
import { BatteryWarning, Send, CheckCircle2, X } from 'lucide-react';

export const KioskBatteryAlertBanner = ({ batteryMonitor, onOpenBatteryModal }) => {
  const [dispatchStatus, setDispatchStatus] = useState(null);

  if (!batteryMonitor) return null;

  const { level, isLow, isCritical, charging, alertDismissed, setAlertDismissed, sendMaintenanceAlert } = batteryMonitor;

  // Only show banner if battery is low or critical and not charging and not dismissed
  if (!isLow || charging || alertDismissed) {
    return null;
  }

  const handleSendDispatch = async () => {
    await sendMaintenanceAlert();
    setDispatchStatus("Maintenance Alert Sent to Engineering Desk!");
    setTimeout(() => {
      setDispatchStatus(null);
    }, 4000);
  };

  return (
    <div className={`w-full py-2.5 px-4 text-xs font-semibold shadow-md flex items-center justify-between border-b transition-all ${
      isCritical 
        ? 'bg-rose-950 text-rose-100 border-rose-800' 
        : 'bg-amber-950 text-amber-100 border-amber-800'
    }`}>
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold font-mono">
          <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
          <BatteryWarning className={`w-4 h-4 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
          <span className="uppercase tracking-wider">
            {isCritical ? "CRITICAL KIOSK BATTERY ALERT" : "LOW KIOSK BATTERY NOTICE"}:
          </span>
        </div>
        
        <span>
          Internal battery is at <strong className="underline font-mono">{level}%</strong>. Please connect power adapter to ensure uninterrupted patient intake.
        </span>

        {dispatchStatus && (
          <span className="bg-emerald-900/90 text-emerald-200 px-2 py-0.5 rounded-md font-mono text-[11px] border border-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {dispatchStatus}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleSendDispatch}
          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <Send className="w-3 h-3" /> Send Maintenance Alert
        </button>

        <button
          onClick={onOpenBatteryModal}
          className="px-2 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 text-[11px] font-mono border border-stone-700 transition cursor-pointer"
        >
          Diagnostics
        </button>

        <button
          onClick={() => setAlertDismissed(true)}
          className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
          title="Dismiss Alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
