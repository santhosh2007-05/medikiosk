import React from 'react';
import { REFERENCE_RANGES } from '../../data/referenceRanges';
import { TriangleAlert } from 'lucide-react';

export const Screen15TimelineAbnormalDoctor = ({ activePatient }) => {
  if (!activePatient) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-kiosk-text">Longitudinal Medical Timeline</h4>
        <span className="text-xs text-stone-500">Sorted by Extracted Document Date</span>
      </div>

      <div className="space-y-3">
        {activePatient.documents && activePatient.documents.length > 0 ? (
          activePatient.documents.map((doc, idx) => (
            <div key={idx} className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-kiosk-teal uppercase tracking-wider">{doc.documentType}</span>
                  <h4 className="font-bold text-sm text-kiosk-text">{doc.extracted.diagnosis || 'Extracted Clinical Record'}</h4>
                </div>
                <span className="text-xs text-stone-500 font-mono bg-white px-2 py-1 rounded border">{doc.documentDate}</span>
              </div>

              {doc.extracted.labValues && doc.extracted.labValues.length > 0 && (
                <div className="mt-3 pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {doc.extracted.labValues.map((lab, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                        lab.isAbnormal
                          ? 'bg-kiosk-alert-light border-kiosk-alert/30 text-kiosk-alert font-semibold'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{lab.name}</div>
                        <div className="text-[10px] text-stone-500">Ref Range: {REFERENCE_RANGES[lab.name] ? `${REFERENCE_RANGES[lab.name].min} - ${REFERENCE_RANGES[lab.name].max} ${REFERENCE_RANGES[lab.name].unit}` : 'Standard'}</div>
                      </div>
                      <div className="text-right font-mono font-bold text-sm">
                        {lab.value} {lab.unit}
                        {lab.isAbnormal && <span className="block text-[10px] flex items-center gap-0.5 justify-end"><TriangleAlert className="w-3 h-3" /> Out of Range</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 text-xs text-center">
            No historical documents uploaded for this patient.
          </div>
        )}
      </div>
    </div>
  );
};
