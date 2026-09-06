import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';

export const SystemStatusModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-kiosk-border">
        <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            <h3 className="font-bold text-base text-kiosk-text">System & AI Pipeline Status</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-base">✕</button>
        </div>

        <div className="space-y-3 text-xs">
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
