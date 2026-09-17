import React from 'react';
import { Activity, CheckCircle2, X, Battery, BatteryCharging, Zap } from 'lucide-react';

export const SystemStatusModal = ({ isOpen, onClose, batteryMonitor, onOpenBatteryDiagnostics }) => {
  if (!isOpen) return null;

  const batteryLevel = batteryMonitor?.level ?? 85;
  const isCharging = batteryMonitor?.charging ?? true;
  const isLow = batteryMonitor?.isLow ?? false;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-kiosk-border">
        <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            <h3 className="font-bold text-base text-kiosk-text">System, Power & AI Pipeline Status</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Real-time Battery Status Card */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isLow ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-stone-50 border-stone-200'
          }`}>
            <div>
              <div className="font-bold text-stone-800 flex items-center gap-1.5">
                {isCharging ? <BatteryCharging className="w-4 h-4 text-emerald-600" /> : <Battery className="w-4 h-4 text-stone-600" />}
                <span>Kiosk Hardware Battery & Power Supply</span>
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                Level: <strong>{batteryLevel}%</strong> • Mode: {isCharging ? 'AC Mainline Power' : 'Internal Backup Battery'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1 ${
                isCharging ? 'bg-emerald-100 text-emerald-800' : (isLow ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-700')
              }`}>
                {isCharging && <Zap className="w-3 h-3 fill-emerald-700 text-emerald-700" />}
                {isCharging ? 'CHARGING' : `${batteryLevel}%`}
              </span>
              {onOpenBatteryDiagnostics && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBatteryDiagnostics();
                  }}
                  className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-mono text-[10px] font-bold"
                >
                  Manage
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-800">Spring Boot REST Backend (Port 8080)</div>
              <div className="text-[11px] text-stone-500">Java 21 Spring Data JPA + H2 In-Memory DB</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> OPERATIONAL
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-800">Web Speech ASR (Multilingual)</div>
              <div className="text-[11px] text-stone-500">Browser Native • Regional Script Support (ta-IN, hi-IN, en-IN)</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> READY
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-800">OCR & Document Extraction Engine</div>
              <div className="text-[11px] text-stone-500">Tesseract.js Client Wasm + Cloud Vision Fallback</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> READY
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-800">FHIR R4 Serializer</div>
              <div className="text-[11px] text-stone-500">Transforms Session into Patient, Condition & Observation Bundles</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> COMPLIANT
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
