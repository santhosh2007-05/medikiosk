import React, { useState, useEffect } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { getPatientRiskMetrics } from '../../services/aiSummarizer';
import { Volume2, Sparkles, Leaf, CheckCircle2 } from 'lucide-react';

export const Screen9SummaryReadBack = () => {
  const { session, updateSummary, setCurrentStep, setDoctorQueue } = usePatientSession();
  const lang = session.identity.language || 'en-IN';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Compute live AI Risk Metrics based on patient intake data
  const riskMetrics = getPatientRiskMetrics({
    chiefComplaint: session.conversationalHistory.chiefComplaint,
    hpi: session.conversationalHistory.hpi,
    documents: session.documents,
    redFlag: session.conversationalHistory.redFlag,
    redFlagTriggers: session.conversationalHistory.redFlagTriggers
  });

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleReadBack = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const patientName = session.identity.name || (lang === 'ta-IN' ? "நோயாளி" : "Patient");
      const cc = session.conversationalHistory.chiefComplaint || (lang === 'ta-IN' ? "நெஞ்சு வலி" : "Chest pain");
      
      let textToRead = "";
      if (lang === 'ta-IN') {
        textToRead = `${patientName} அவர்களுக்கான மருத்துவ அறிக்கை. முக்கிய குறைபாடு: ${cc}. மருத்துவ இடர் நிலை: ${riskMetrics.riskLevel === 'HIGH' ? "அதிக ஆபத்து - உடனடி கவனிப்பு தேவை" : (riskMetrics.riskLevel === 'MODERATE' ? "மிதமான நிலை" : "நிலையானது")}. உங்கள் தகவல்கள் மருத்துவருக்கு அனுப்ப தயாராக உள்ளன.`;
      } else if (lang === 'hi-IN') {
        textToRead = `मरीज ${patientName} की क्लिनिकल समरी। मुख्य शिकायत: ${cc}। जोखिम स्तर: ${riskMetrics.riskLevel === 'HIGH' ? "उच्च जोखिम" : "सामान्य"}। आपकी जानकारी डॉक्टर को भेजने के लिए तैयार है।`;
      } else if (lang === 'te-IN') {
        textToRead = `పేషెంట్ ${patientName} గారి మెడికల్ సమ్మరీ. ప్రధాన సమస్య: ${cc}। డాక్టర్‌కు పంపడానికి సిద్ధంగా ఉంది.`;
      } else {
        textToRead = `Clinical summary for ${patientName}. Chief complaint: ${cc}. AI Risk Level: ${riskMetrics.riskLevel} with score ${riskMetrics.riskScore} percent. Your information is ready to be sent to your OPD doctor.`;
      }

      const msg = new SpeechSynthesisUtterance(textToRead);
      msg.lang = lang;
      msg.onend = () => setIsPlayingAudio(false);
      msg.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(msg);
      setIsPlayingAudio(true);
    }
  };

  const handleConfirmAndSend = () => {
    const generated = `1. CHIEF COMPLAINT:\n${session.conversationalHistory.chiefComplaint || 'Chest pain'}\n\n2. HISTORY OF PRESENT ILLNESS (HPI - SOCRATES):\nSite: ${session.conversationalHistory.hpi.site}\nOnset: ${session.conversationalHistory.hpi.onset}\nCharacter: ${session.conversationalHistory.hpi.character}\nRadiation: ${session.conversationalHistory.hpi.radiation}\nAssociated Symptoms: ${session.conversationalHistory.hpi.associated}\nSeverity: ${session.conversationalHistory.hpi.severity}\n\n3. PAST MEDICAL HISTORY:\nNot reported\n\n4. DRUG & ALLERGY HISTORY:\nNot reported\n\n5. FAMILY HISTORY:\nNot reported\n\n6. PERSONAL HISTORY:\nNot reported\n\n7. PRIOR INVESTIGATIONS SUMMARY:\n${session.documents.length > 0 ? session.documents.map(d => d.documentType + ': ' + (d.extracted.diagnosis || 'Digitized')).join(', ') : 'Not reported'}`;

    updateSummary({ generatedText: generated, status: 'draft' });

    const queueItem = {
      id: "Q-" + Date.now(),
      token: session.identity.token,
      name: session.identity.name || "Anonymous Patient",
      age: session.identity.age || "45",
      gender: session.identity.gender || "Male",
      language: session.identity.language || "en-IN",
      ayushMode: session.identity.ayushMode,
      chiefComplaint: session.conversationalHistory.chiefComplaint,
      redFlag: session.conversationalHistory.redFlag || riskMetrics.riskLevel === 'HIGH',
      redFlagTriggers: session.conversationalHistory.redFlagTriggers,
      riskLevel: riskMetrics.riskLevel,
      riskScore: riskMetrics.riskScore,
      riskColor: riskMetrics.riskColor,
      riskTitle: riskMetrics.riskTitle,
      riskReason: riskMetrics.riskReason,
      triagePriority: riskMetrics.triagePriority,
      status: "draft",
      waitingTime: "Just now",
      hpi: session.conversationalHistory.hpi,
      ayushParameters: session.conversationalHistory.ayushParameters,
      documents: session.documents,
      summaryText: generated
    };

    setDoctorQueue(prev => [queueItem, ...prev]);
    setCurrentStep(10);
  };

  return (
    <section className="bg-white border border-kiosk-border rounded-2xl p-6 md:p-8 shadow-xs flex flex-col justify-between flex-1">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-kiosk-teal bg-kiosk-teal-light px-2 py-0.5 rounded">
              Module C: Summary Synthesis & AI Risk Stratification
            </span>
            <h2 className="text-2xl font-bold text-kiosk-text mt-1">{getTranslation("reviewSummaryTitle", lang)}</h2>
          </div>
          
          <button
            onClick={toggleReadBack}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs border transition ${
              isPlayingAudio ? 'bg-kiosk-teal text-white border-kiosk-teal animate-pulse' : 'bg-stone-100 hover:bg-stone-200 text-kiosk-teal border-stone-300'
            }`}
          >
            <Volume2 className="w-4 h-4" /> {isPlayingAudio ? getTranslation("stopAudio", lang) : getTranslation("readBackBtn", lang)}
          </button>
        </div>

        {/* AI CLINICAL RISK STRATIFICATION CARD */}
        <div className={`p-4 rounded-xl border-2 mb-4 transition-all ${
          riskMetrics.riskLevel === 'HIGH' 
            ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-md shadow-rose-500/10' 
            : (riskMetrics.riskLevel === 'MODERATE' 
                ? 'bg-amber-50 border-amber-400 text-amber-950' 
                : 'bg-emerald-50 border-emerald-400 text-emerald-950')
        }`}>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-kiosk-teal" />
              <span className="font-extrabold text-sm uppercase tracking-wide">
                AI Clinical Risk Assessment
              </span>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black font-mono shadow-xs ${
              riskMetrics.riskLevel === 'HIGH' 
                ? 'bg-rose-600 text-white' 
                : (riskMetrics.riskLevel === 'MODERATE' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white')
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                riskMetrics.riskLevel === 'HIGH' ? 'bg-white animate-ping' : 'bg-white'
              }`} />
              {riskMetrics.badgeText}
            </span>
          </div>
          <p className="text-xs font-semibold leading-relaxed mt-1">
            {riskMetrics.riskReason}
          </p>
          <div className="mt-2 text-[11px] font-mono flex items-center justify-between text-stone-600 border-t border-stone-200/60 pt-2">
            <span>Triage Tier: <strong>{riskMetrics.triagePriority}</strong></span>
            <span>Evaluation Engine: <strong>Groq Llama-3.3 70B AI</strong></span>
          </div>
        </div>

        {/* Formatted Summary Blocks */}
        <div className="space-y-4 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm font-sans max-h-80 overflow-y-auto">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">1. Chief Complaint</div>
            <div className="text-stone-900 font-semibold bg-white p-2.5 rounded border border-stone-200 text-xs">
              {session.conversationalHistory.chiefComplaint || 'Not reported'}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">2. History of Present Illness (HPI - SOCRATES)</div>
            <div className="text-stone-700 bg-white p-2.5 rounded border border-stone-200 leading-relaxed text-xs">
              <strong>Site:</strong> {session.conversationalHistory.hpi.site}<br/>
              <strong>Onset:</strong> {session.conversationalHistory.hpi.onset}<br/>
              <strong>Character:</strong> {session.conversationalHistory.hpi.character}<br/>
              <strong>Radiation:</strong> {session.conversationalHistory.hpi.radiation}<br/>
              <strong>Associated:</strong> {session.conversationalHistory.hpi.associated}<br/>
              <strong>Severity:</strong> {session.conversationalHistory.hpi.severity}
            </div>
          </div>

          {session.identity.ayushMode && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-kiosk-ayush mb-1 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-kiosk-ayush" />
                <span>Dashavidha Pariksha (AYUSH Parameters)</span>
              </div>
              <div className="text-stone-700 bg-kiosk-ayush-light p-2.5 rounded border border-kiosk-ayush/20 text-xs">
                Prakriti: {session.conversationalHistory.ayushParameters.prakriti || 'Not reported'} • Agni: {session.conversationalHistory.ayushParameters.agni || 'Not reported'} • Koshtha: {session.conversationalHistory.ayushParameters.koshtha || 'Not reported'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">3. Past Medical History</div>
              <div className="text-stone-700 bg-white p-2.5 rounded border border-stone-200">Not reported</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">4. Drug & Allergy History</div>
              <div className="text-stone-700 bg-white p-2.5 rounded border border-stone-200">Not reported</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => setCurrentStep(8)}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          {getTranslation("back", lang)}
        </button>
        <button
          onClick={handleConfirmAndSend}
          className="w-2/3 py-3.5 px-4 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2"
        >
          {getTranslation("sendToDoctor", lang)} <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
