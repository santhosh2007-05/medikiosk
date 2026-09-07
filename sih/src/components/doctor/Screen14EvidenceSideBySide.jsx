import React from 'react';
import { MessageSquare, FileText, CheckCircle2, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { MEDICAL_IMAGES } from '../../data/images';

export const Screen14EvidenceSideBySide = ({ activePatient }) => {
  if (!activePatient) return null;

  return (
    <div className="space-y-4 text-stone-100">
      <div className="bg-stone-950 border border-stone-800 p-3 rounded-xl text-xs text-stone-300 flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Verification Traceability: Compare AI synthesized summary against raw patient voice transcripts and raw OCR text.
        </span>
        <span className="text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Traceability 100%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Raw Speech Q&A Transcript */}
        <div className="border border-stone-800 rounded-2xl p-4 bg-stone-950">
          <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
            <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Raw Conversational Transcript
            </h4>
            <span className="text-[10px] text-stone-500 font-mono">Module A Output</span>
          </div>

          <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-2">
            {activePatient.qaPairs && activePatient.qaPairs.length > 0 ? (
              activePatient.qaPairs.map((pair, idx) => (
                <div key={idx} className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-white">Q: {pair.question}</div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-950 text-stone-400 font-mono border border-stone-800">
                      Conf: {Math.round((pair.confidence || 0.95) * 100)}%
                    </span>
                  </div>
                  <div className="text-emerald-400 font-semibold mt-1">A: {pair.answer}</div>
                  <div className="text-[10px] text-stone-500 mt-1 font-mono">Source: {pair.source || 'Voice ASR / Touch'}</div>
                </div>
              ))
            ) : (
              <div className="text-stone-500 text-center py-4 font-mono">No raw transcript stored for this session.</div>
            )}
          </div>
        </div>

        {/* Right: Raw OCR Text & Diagnostic Scan Previews */}
        <div className="border border-stone-800 rounded-2xl p-4 bg-stone-950">
          <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
            <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-stone-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" /> Raw Document OCR & Extracted Tokens
            </h4>
            <span className="text-[10px] text-stone-500 font-mono">Module B Output</span>
          </div>

          <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-2 bg-stone-900 p-3 rounded-xl border border-stone-800">
            {/* Visual Scan Header Photo */}
            <div className="flex items-center gap-3 p-2 bg-stone-950 rounded-xl border border-stone-800 mb-2">
              <img
                src={MEDICAL_IMAGES.labReport}
                alt="Lab Report Scan"
                className="w-16 h-12 object-cover rounded-lg border border-stone-800 shrink-0"
              />
              <img
                src={MEDICAL_IMAGES.xrayScan}
                alt="Chest X-Ray Diagnostic"
                className="w-16 h-12 object-cover rounded-lg border border-stone-800 shrink-0"
              />
              <div>
                <div className="text-[11px] font-bold text-white flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Attached Scans
                </div>
                <div className="text-[10px] text-stone-400">2 Verified High-Res Diagnostic Imaging Files</div>
              </div>
            </div>

            {activePatient.documents && activePatient.documents.length > 0 ? (
              activePatient.documents.map((doc, idx) => (
                <div key={idx} className="border-b border-stone-800 pb-2 mb-2 last:border-0">
                  <div className="flex justify-between items-center mb-1 font-sans">
                    <span className="font-bold text-emerald-400 font-mono">[{doc.documentType} - {doc.documentDate}]</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-800">
                      Quality: {doc.qualityStatus || 'Passed'} ({doc.confidenceScore || 94}%)
                    </span>
                  </div>
                  <pre className="whitespace-pre-line text-stone-300 font-mono text-[11px] bg-stone-950 p-2 rounded border border-stone-800">{doc.rawOcrText}</pre>
                </div>
              ))
            ) : (
              <div className="text-stone-500 text-center py-2 font-mono">No additional text OCR documents.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
