import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';

export const Screen16FhirModal = ({ isOpen, onClose, activePatient }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activePatient) return null;

  const fhirBundle = {
    resourceType: "Bundle",
    id: `bundle-${activePatient.token}`,
    type: "collection",
    entry: [
      {
        fullUrl: `Patient/${activePatient.token}`,
        resource: {
          resourceType: "Patient",
          id: activePatient?.token || "OPD-000",
          identifier: [{ system: "http://abdm.gov.in/abha", value: "91-4821-9032-1102" }],
          name: [{ text: activePatient?.name || "Patient" }],
          gender: (activePatient?.gender || "unknown").toLowerCase()
        }
      },
      {
        fullUrl: `Condition/cond-${activePatient.token}`,
        resource: {
          resourceType: "Condition",
          id: `cond-${activePatient.token}`,
          clinicalStatus: { coding: [{ code: "active" }] },
          code: { text: activePatient.chiefComplaint },
          subject: { reference: `Patient/${activePatient.token}` }
        }
      }
    ]
  };

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-kiosk-border">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-mono font-bold">FHIR R4</span>
            <h3 className="font-bold text-base text-kiosk-text flex items-center gap-1.5">
              <Code className="w-4 h-4 text-kiosk-teal" /> Interoperable Clinical Resource Bundle
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-lg p-1">✕</button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs text-stone-600 mb-2 flex items-center justify-between">
            <span>Resources included: <strong>Patient</strong>, <strong>Condition</strong> (HPI), <strong>Observation</strong> (Lab Values)</span>
            <button onClick={copyJson} className="text-xs text-kiosk-teal font-semibold hover:underline flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Bundle JSON'}
            </button>
          </div>
          <pre className="bg-stone-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px]">
            {jsonString}
          </pre>
        </div>

        <div className="p-3 border-t border-stone-200 flex justify-end gap-2 bg-stone-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
