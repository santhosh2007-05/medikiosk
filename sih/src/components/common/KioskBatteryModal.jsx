import React, { useState } from 'react';
import { 
  Battery, BatteryCharging, BatteryWarning, Zap, ShieldCheck, 
  Send, X, RotateCcw, CheckCircle2, Sliders
} from 'lucide-react';

export const KioskBatteryModal = ({ isOpen, onClose, batteryMonitor }) => {
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState("");

  if (!isOpen || !batteryMonitor) return null;

  const {
    level, charging, dischargingTime, isLow, isCritical,
    isSupported, isSimulated, simulateBattery, resetSimulation, sendMaintenanceAlert
  } = batteryMonitor;

  const handleSendDispatch = async () => {
    await sendMaintenanceAlert(`[EMERGENCY BATTERY DISPATCH]: Kiosk #042 at ${level}% (${charging ? 'Charging' : 'Discharging'}). High priority field technician requested.`);
    setDispatchSuccessMsg(`Alert dispatched successfully! Message sent to Central Hospital Facility Admin.`);
    setTimeout(() => setDispatchSuccessMsg(""), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              isCritical ? 'bg-rose-100 text-rose-600' : (isLow ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-700')
            }`}>
              {charging ? <BatteryCharging className="w-5 h-5" /> : (isLow ? <BatteryWarning className="w-5 h-5" /> : <Battery className="w-5 h-5" />)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900">Kiosk Hardware Power & Battery Monitor</h3>
              <p className="text-[11px] text-stone-500 font-mono">KIOSK-TN-CHE-042 • Real-Time Power Telemetry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Battery Gauge Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isCritical 
            ? 'bg-rose-50 border-rose-300 text-rose-950' 
            : (isLow ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950')
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Power Status</span>
              <div className="text-3xl font-black font-mono tracking-tight flex items-center gap-2 mt-0.5">
                <span>{level}%</span>
                {charging && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700 text-white font-sans font-bold flex items-center gap-1"><Zap className="w-3 h-3 fill-white" /> AC Connected</span>}
                {!charging && isLow && <span className="text-xs px-2 py-0.5 rounded-full bg-rose-600 text-white font-sans font-bold animate-pulse">Low Battery</span>}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-stone-500 block">Operating Mode</span>
              <span className="text-xs font-bold font-mono">
                {charging ? "Mainline AC Power" : "Internal Backup Battery"}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-stone-300">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical ? 'bg-rose-500 animate-pulse' : (isLow ? 'bg-amber-500' : 'bg-emerald-500')
              }`}
              style={{ width: `${Math.max(5, level)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-stone-600 pt-2 border-t border-stone-200/60">
            <span>Hardware Telemetry: <strong>{isSupported ? 'Native Web Battery API' : 'Edge Power Controller'}</strong></span>
            {isSimulated && <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">Test Simulator Mode</span>}
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">Power State</span>
            <span className="font-bold text-stone-800">{charging ? "Charging (AC)" : "Discharging (Battery)"}</span>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">Discharge Estimate</span>
            <span className="font-bold text-stone-800 font-mono">
              {dischargingTime && dischargingTime !== Infinity ? `${Math.round(dischargingTime / 60)} min` : `${Math.round(level * 3.5)} min remaining`}
            </span>
          </div>

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block">Battery Health</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 98.4% Optimal
            </span>
          </div>
        </div>

        {/* Automated Alert Notification Action */}
        <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl space-y-2.5 border border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs">Emergency Low-Battery Dispatch Dispatcher</span>
            </div>
            <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">Auto SMS / Cloud API</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Sends an immediate high-priority maintenance notification to the Hospital Facility Engineering Team to plug in or replace the kiosk power source.
          </p>
          <button
            onClick={handleSendDispatch}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
          >
            <Send className="w-3.5 h-3.5" /> Send Kiosk Battery Alert Message Now
          </button>

          {dispatchSuccessMsg && (
            <div className="p-2.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{dispatchSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Real-time Testing Simulator */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Sliders className="w-4 h-4 text-stone-600" />
              <span>Interactive Battery Level Simulator (For Demo & Testing)</span>
            </div>
            {isSimulated && (
              <button 
                onClick={resetSimulation}
                className="text-[10px] text-stone-600 hover:text-stone-900 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Reset to Real Hardware
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => simulateBattery(100, true)}
              className="p-2 bg-white border border-stone-300 hover:border-emerald-600 rounded-xl font-mono text-[11px] font-bold text-emerald-800 transition text-center"
            >
              100% (AC)
            </button>
            <button
              onClick={() => simulateBattery(50, false)}
              className="p-2 bg-white border border-stone-300 hover:border-emerald-600 rounded-xl font-mono text-[11px] font-bold text-stone-700 transition text-center"
            >
              50% (Normal)
            </button>
            <button
              onClick={() => simulateBattery(15, false)}
              className="p-2 bg-amber-100 border border-amber-300 hover:border-amber-600 rounded-xl font-mono text-[11px] font-bold text-amber-900 transition text-center"
            >
              15% (Low Alert)
            </button>
            <button
              onClick={() => simulateBattery(8, false)}
              className="p-2 bg-rose-100 border border-rose-300 hover:border-rose-600 rounded-xl font-mono text-[11px] font-bold text-rose-900 transition text-center"
            >
              8% (Critical)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
