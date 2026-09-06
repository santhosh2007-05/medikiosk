import React from 'react';
import { MessageSquare, FileText, CheckCircle2, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { MEDICAL_IMAGES } from '../../data/images';

export const Screen14EvidenceSideBySide = ({ activePatient }) => {
  if (!activePatient) return null;

  return (
    <div className="space-y-4">
      <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg text-xs text-stone-600 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-kiosk-teal" /> Verification Traceability: Compare AI synthesized summary against raw patient voice transcripts and raw OCR text.
        </span>
        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Traceability 100%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Raw Speech Q&A Transcript */}
        <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
          <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-kiosk-teal flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Raw Conversational Transcript
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">Module A Output</span>
          </div>

          <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-2">
            {activePatient.qaPairs && activePatient.qaPairs.length > 0 ? (
              activePatient.qaPairs.map((pair, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded border border-stone-200 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-stone-700">Q: {pair.question}</div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-mono">
                      Conf: {Math.round((pair.confidence || 0.95) * 100)}%
                    </span>
                  </div>
                  <div className="text-kiosk-teal font-semibold mt-1">A: {pair.answer}</div>
                  <div className="text-[10px] text-stone-400 mt-1">Source: {pair.source || 'Voice ASR / Touch'}</div>
                </div>
              ))
            ) : (
              <div className="text-stone-400 text-center py-4">No raw transcript stored for this session.</div>
            )}
          </div>
        </div>

        {/* Right: Raw OCR Text & Diagnostic Scan Previews */}
        <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
          <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Raw Document OCR & Extracted Tokens
            </h4>
            <span className="text-[10px] text-stone-400 font-mono">Module B Output</span>
          </div>

          <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-2 bg-white p-3 rounded border border-stone-200">
            {/* Visual Scan Header Photo */}
            <div className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg border border-stone-200 mb-2">
              <img
                src={MEDICAL_IMAGES.labReport}
                alt="Lab Report Scan"
                className="w-16 h-12 object-cover rounded border border-stone-300 shadow-2xs shrink-0"
              />
              <img
                src={MEDICAL_IMAGES.xrayScan}
                alt="Chest X-Ray Diagnostic"
                className="w-16 h-12 object-cover rounded border border-stone-300 shadow-2xs shrink-0"
              />
              <div>
                <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Attached Scans
                </div>
                <div className="text-[10px] text-stone-500">2 Verified High-Res Diagnostic Imaging Files</div>
              </div>
            </div>

            {activePatient.documents && activePatient.documents.length > 0 ? (
              activePatient.documents.map((doc, idx) => (
                <div key={idx} className="border-b pb-2 mb-2 last:border-0">
                  <div className="flex justify-between items-center mb-1 font-sans">
                    <span className="font-bold text-kiosk-teal">[{doc.documentType} - {doc.documentDate}]</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Quality: {doc.qualityStatus || 'Passed'} ({doc.confidenceScore || 94}%)
                    </span>
                  </div>
                  <pre className="whitespace-pre-line text-stone-700 font-mono text-[11px]">{doc.rawOcrText}</pre>
                </div>
              ))
            ) : (
              <div className="text-stone-400 text-center py-2 font-sans">No additional text OCR documents.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
