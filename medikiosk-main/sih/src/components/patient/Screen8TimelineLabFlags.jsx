import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { REFERENCE_RANGES } from '../../data/referenceRanges';
import { TriangleAlert, CheckCircle2, Sparkles } from 'lucide-react';

export const Screen8TimelineLabFlags = () => {
  const { session, setCurrentStep } = usePatientSession();

  return (
    <section className="bg-white border border-kiosk-border rounded-2xl p-6 md:p-8 shadow-xs flex flex-col justify-between flex-1">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-kiosk-teal bg-kiosk-teal-light px-2 py-0.5 rounded">
              Timeline & Lab Reference
            </span>
            <h2 className="text-2xl font-bold text-kiosk-text mt-1">Extracted Clinical Timeline</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-kiosk-alert font-bold bg-kiosk-alert-light px-2 py-1 rounded border border-kiosk-alert/20">
              <TriangleAlert className="w-3.5 h-3.5" /> Abnormal Flag
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Normal Range
            </span>
          </div>
        </div>

        <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2">
          {session.documents.length === 0 ? (
            <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 text-xs text-center">
              No previous uploaded documents found for timeline. Proceeding with conversational intake history.
            </div>
          ) : (
            session.documents.map((doc, idx) => (
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
                          {lab.isAbnormal && <span className="block text-[10px]">⚠ Below/Above Range</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => setCurrentStep(7)}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          Back to Upload
        </button>
        <button
          onClick={() => setCurrentStep(9)}
          className="w-2/3 py-3.5 px-4 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2"
        >
          Synthesize Summary <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
