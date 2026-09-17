import React, { useState, useRef } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { executeEnhancedOcr } from '../../services/enhancedOcrEngine';
import { SAMPLE_REPORTS_LIST } from '../../data/sampleReportsData';
import {
  UploadCloud, FileText, CheckCircle2,
  Eye, AlertCircle, Sparkles, Zap,
  FileSpreadsheet, Activity, RefreshCw, X, HardDrive
} from 'lucide-react';

export const PatientDocumentUploadPanel = () => {
  const { session, addDocument, deleteDocument, authenticatedUser } = usePatientSession();
  const fileInputRef = useRef(null);

  const [selectedDocType, setSelectedDocType] = useState("Lab Report");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  const patientToken = authenticatedUser?.abhaId || session.identity?.token || "OPD-101";

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError("");
    setUploadSuccess("");

    // Strict 10MB File Size Validation
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the strict 10MB database limit. Please upload a file under 10MB.`);
      e.target.value = null;
      return;
    }

    setIsProcessing(true);
    setProgressPercent(15);
    setProgressMsg("Validating file stream & initializing enhanced Tesseract OCR engine...");

    try {
      const ocrResult = await executeEnhancedOcr(file, file.name, selectedDocType, (pct, msg) => {
        setProgressPercent(pct);
        setProgressMsg(msg);
      });

      const isActuallyValid = ocrResult.isValid;

      if (!isActuallyValid) {
        setUploadError(ocrResult.extracted?.validationExplanation || "This document is not valid. Please upload a correct medical report or prescription.");
        setIsProcessing(false);
        e.target.value = null;
        return;
      }

      const newDoc = {
        id: "DOC-" + Date.now(),
        patientToken,
        documentType: selectedDocType,
        documentDate: new Date().toISOString().split('T')[0],
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        confidenceScore: ocrResult.confidenceScore,
        rawOcrText: ocrResult.rawOcrText,
        extracted: ocrResult.extracted,
        ocrMode: ocrResult.ocrMode,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : (process.env.PUBLIC_URL + "/sample-reports/01_CBC_Hematology_Lab_Report.svg")
      };

      // Add to local session context (and syncs to Doctor Queue & Backend automatically)
      addDocument(newDoc);

      setUploadSuccess(`Valid Medical Document: ${ocrResult.extracted?.validationExplanation || file.name}`);
      setProgressPercent(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProgressPercent(0);
      }, 600);
    } catch (err) {
      setUploadError("Error processing document: " + err.message);
      setIsProcessing(false);
    }

    e.target.value = null;
  };

  const handleLoadSampleReport = async (sampleId) => {
    const sample = SAMPLE_REPORTS_LIST.find(r => r.id === sampleId);
    if (!sample) return;

    setUploadError("");
    setUploadSuccess("");
    setIsProcessing(true);
    setProgressPercent(10);
    setProgressMsg(`Loading authentic clinical sample: ${sample.title}...`);

    try {
      const ocrResult = await executeEnhancedOcr(sample.rawOcrText, sample.fileName, sample.category, (pct, msg) => {
        setProgressPercent(pct);
        setProgressMsg(msg);
      });

      const newDoc = {
        id: "DOC-SAMPLE-" + Date.now(),
        patientToken,
        documentType: sample.category,
        documentDate: sample.date,
        fileName: sample.fileName,
        fileSize: "24.5 KB",
        facility: sample.facility,
        confidenceScore: ocrResult.confidenceScore || 99,
        rawOcrText: ocrResult.rawOcrText || sample.rawOcrText,
        extracted: ocrResult.extracted,
        ocrMode: ocrResult.ocrMode || "Tesseract 5.0 Neural LSTM Engine",
        previewUrl: process.env.PUBLIC_URL + "/sample-reports/01_CBC_Hematology_Lab_Report.svg"
      };

      addDocument(newDoc);

      setUploadSuccess(`Sample Report "${sample.title}" processed with Tesseract Neural OCR & Groq LLaMA-3.3 70B!`);
      setProgressPercent(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProgressPercent(0);
      }, 500);
    } catch(err) {
      setUploadError("Error analyzing sample report: " + err.message);
      setIsProcessing(false);
    }
  };

  const patientDocs = session.documents || [];

  return (
    <div className="space-y-6 text-stone-100 font-sans">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                Patient Medical Vault (Max 10MB)
              </span>
              <span className="text-xs text-stone-400">• Real-Time EHR & Doctor Queue Sync</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2">
              <UploadCloud className="w-7 h-7 text-emerald-400" /> Upload & Manage Medical Records
            </h1>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
              Upload previous prescriptions, blood tests, or diagnostic scans. Any document uploaded here or at the kiosk reflects in real-time in your patient portal and your doctor's consultation workstation.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-stone-950 px-3 py-2 rounded-xl border border-stone-800 text-stone-300">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Vault: {patientDocs.length} Documents Active</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Uploader Box */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> Select Document Category
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">Step 1 of 2</span>
          </div>

          {/* Doc Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { type: "Lab Report", label: "Lab Test", icon: Activity },
              { type: "Prescription", label: "Prescription", icon: FileText },
              { type: "Discharge Summary", label: "Discharge", icon: FileSpreadsheet },
              { type: "Scan / Diagnostic", label: "Scan / MRI", icon: Sparkles }
            ].map(item => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedDocType(item.type)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                    selectedDocType === item.type
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-sm'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Drag & Drop / File Input Box */}
          <div
            onClick={() => !isProcessing && fileInputRef.current && fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
              isProcessing
                ? 'border-emerald-500/50 bg-emerald-950/20 cursor-wait'
                : 'border-stone-700 hover:border-emerald-500 bg-stone-950/70 hover:bg-stone-950'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.txt"
              className="hidden"
              onChange={handleFileSelected}
            />

            <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center shadow-lg">
              {isProcessing ? <RefreshCw className="w-7 h-7 animate-spin" /> : <UploadCloud className="w-7 h-7" />}
            </div>

            <div>
              <div className="text-sm font-bold text-white">
                {isProcessing ? "Processing Document with Tesseract OCR..." : "Click to Browse or Drag Medical File Here"}
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Supports PDF, JPG, PNG, WEBP, SVG and TXT files (Under 10MB)
              </p>
            </div>

            {isProcessing && (
              <div className="w-full max-w-md space-y-2 pt-2">
                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-semibold">{progressMsg}</div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-950/80 border border-rose-600/80 rounded-xl text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600/80 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>

        {/* Right 5 Cols: 15 Sample Reports Quick Loader */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> 15 Authentic Sample Reports
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Instant AI Test
            </span>
          </div>

          <p className="text-xs text-stone-400">
            Select any authentic diagnostic report from the 15 verified sample reports located in <code className="text-emerald-400 bg-stone-950 px-1 py-0.5 rounded font-mono text-[10px]">public/sample-reports/</code>.
          </p>

          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {SAMPLE_REPORTS_LIST.map((sample) => (
              <div
                key={sample.id}
                className="p-3 bg-stone-950 border border-stone-800 hover:border-emerald-700/80 rounded-xl flex items-center justify-between gap-3 transition text-xs group"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-stone-200 truncate group-hover:text-emerald-300">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-emerald-400">{sample.category}</span>
                    <span>•</span>
                    <span>{sample.date}</span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleLoadSampleReport(sample.id)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] shadow-sm transition shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3" /> Load & Parse
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uploaded Documents List with Real-time Delete Feature */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> Patient Medical Records ({patientDocs.length})
          </h2>
          <span className="text-xs text-stone-400">Real-time synchronized across Patient Portal, Kiosk & Doctor OPD Station</span>
        </div>

        {patientDocs.length === 0 ? (
          <div className="p-8 bg-stone-950 border border-stone-800 rounded-xl text-center space-y-2">
            <FileText className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="font-bold text-sm text-white">No Medical Documents Uploaded Yet</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Upload your lab reports or click any of the 15 sample reports above to test the Tesseract OCR and Groq LLaMA-3.3 70B Big Clinical Summary.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientDocs.map((doc, idx) => (
              <div key={doc.id || idx} className="p-4 bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl space-y-3 shadow-sm transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {doc.documentType || "Lab Report"}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1.5">{doc.fileName}</h3>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                      Date: {doc.documentDate || "2026-09-15"} • Size: {doc.fileSize || "18 KB"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1.5 bg-stone-900 hover:bg-emerald-900/60 text-emerald-400 border border-stone-800 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${doc.fileName}" from your medical record?`)) {
                          deleteDocument(doc.id);
                        }
                      }}
                      className="p-1.5 bg-stone-900 hover:bg-rose-950 text-stone-400 hover:text-rose-400 border border-stone-800 rounded-lg transition shadow-sm cursor-pointer"
                      title="Delete Document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {doc.extracted?.diagnosis && (
                  <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 text-xs text-stone-200">
                    <strong className="text-stone-400 font-mono text-[10px] block uppercase">AI Impression:</strong>
                    {doc.extracted.diagnosis}
                  </div>
                )}

                {doc.extracted?.validKeywords && doc.extracted.validKeywords.length > 0 && (
                  <div className="pt-1">
                    <div className="text-[10px] text-emerald-400 font-mono font-bold mb-1">
                      Matched Medical Terms ({doc.extracted.validKeywords.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doc.extracted.validKeywords.slice(0, 5).map((kw, kwIdx) => (
                        <span key={kwIdx} className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-mono border border-emerald-800">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {doc.extracted?.labValues && doc.extracted.labValues.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {doc.extracted.labValues.slice(0, 3).map((val, vIdx) => (
                      <span
                        key={vIdx}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          val.isAbnormal
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {val.name}: {val.value} {val.unit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL PREVIEW MODAL FOR BIG CLINICAL SUMMARY & VISUAL REPORT */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-5 text-stone-100 relative max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-800 pb-4">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                {previewDoc.documentType} • Clinical EHR Review
              </span>
              <h2 className="text-xl font-bold text-white mt-1.5">{previewDoc.fileName}</h2>
              <p className="text-xs text-stone-400">
                Confidence Score: {previewDoc.confidenceScore || 98}% • Engine: {previewDoc.ocrMode || "Groq LLaMA-3.3 70B & Tesseract 5.0"}
              </p>
              {previewDoc.extracted?.validationExplanation && (
                <div className="mt-2 p-2 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs font-mono">
                  {previewDoc.extracted.validationExplanation}
                </div>
              )}
            </div>

            {/* VISUAL REPORT / SCAN EMBED PREVIEW */}
            {previewDoc.previewUrl && (
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase text-stone-400">
                  Visual Scan / Diagnostic Document Rendering:
                </label>
                <div className="p-3 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-center max-h-72 overflow-hidden">
                  <img src={previewDoc.previewUrl} alt={previewDoc.fileName} className="max-h-68 w-auto object-contain rounded-xl shadow-md" />
                </div>
              </div>
            )}

            {/* EXTRACTED LAB VALUES & METRICS TABLE */}
            {previewDoc.extracted?.labValues && previewDoc.extracted.labValues.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-emerald-400">
                  Extracted Lab Analytes & Biomarkers:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {previewDoc.extracted.labValues.map((val, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs font-mono ${
                        val.isAbnormal
                          ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                          : 'bg-stone-950 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="text-[10px] text-stone-400 truncate">{val.name}</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {val.value} <span className="text-[11px] font-normal text-stone-400">{val.unit}</span>
                      </div>
                      <div className="text-[10px] mt-1 text-emerald-400">Ref: {val.refRange}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BIG CLINICAL SUMMARY BLOCK */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-emerald-400">
                Groq AI Big Clinical Summary Report:
              </label>
              <pre className="p-4 bg-stone-950 border border-stone-800 rounded-xl text-xs font-mono text-stone-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {previewDoc.extracted?.bigSummary || previewDoc.extracted?.summary || previewDoc.rawOcrText}
              </pre>
            </div>

            {/* RAW EXTRACTED OCR TEXT */}
            {previewDoc.rawOcrText && (
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-stone-400">
                  Raw Tesseract OCR Text Output:
                </label>
                <pre className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl text-[11px] font-mono text-stone-400 whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {previewDoc.rawOcrText}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
