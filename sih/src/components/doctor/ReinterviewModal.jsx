import React, { useState } from 'react';

export const ReinterviewModal = ({ isOpen, onClose, onConfirmReject }) => {
  const [selectedReason, setSelectedReason] = useState("Missing critical HPI / Onset information");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-kiosk-border">
        <h3 className="font-bold text-lg text-kiosk-text mb-1">Send for Patient Re-Interview</h3>
        <p className="text-xs text-kiosk-muted mb-4">Please select the reason to re-prompt the patient at the kiosk queue.</p>

        <div className="space-y-2 text-xs mb-4">
          {[
            "Missing critical HPI / Onset information",
            "Contradictory or unclear pain location",
            "Unreadable document photo — Retake needed",
            "Requires nurse-assisted manual case-taking"
          ].map((reason, idx) => (
            <label key={idx} className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-stone-50 cursor-pointer">
              <input
                type="radio"
                name="rejectReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="text-kiosk-teal"
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3.5 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-100">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReject(selectedReason);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-black text-white text-xs font-bold shadow-xs"
          >
            Confirm Re-Interview
          </button>
        </div>
      </div>
    </div>
  );
};
