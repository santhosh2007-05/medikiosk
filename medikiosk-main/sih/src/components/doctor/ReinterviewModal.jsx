import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

export const ReinterviewModal = ({ isOpen, onClose, onConfirmReject }) => {
  const [selectedReason, setSelectedReason] = useState("Missing critical HPI / Onset information");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-800 text-stone-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" /> Send for Patient Re-Interview
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 rounded-lg bg-stone-950 border border-stone-800">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-stone-400 mb-4">Please select the reason to re-prompt the patient at the kiosk queue.</p>

        <div className="space-y-2 text-xs mb-4">
          {[
            "Missing critical HPI / Onset information",
            "Contradictory or unclear pain location",
            "Unreadable document photo — Retake needed",
            "Requires nurse-assisted manual case-taking"
          ].map((reason, idx) => (
            <label key={idx} className="flex items-center gap-2.5 p-3 border border-stone-800 rounded-xl bg-stone-950 hover:border-emerald-700 cursor-pointer transition">
              <input
                type="radio"
                name="rejectReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="accent-emerald-500"
              />
              <span className="text-stone-200">{reason}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-stone-800 bg-stone-950 text-xs font-semibold text-stone-300 hover:bg-stone-800">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReject(selectedReason);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
          >
            Confirm Re-Interview
          </button>
        </div>
      </div>
    </div>
  );
};
