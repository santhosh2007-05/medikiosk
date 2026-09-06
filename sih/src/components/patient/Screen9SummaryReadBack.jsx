import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { Volume2, CheckCircle2 } from 'lucide-react';

export const Screen9SummaryReadBack = () => {
  const { session, updateSummary, setCurrentStep, setDoctorQueue } = usePatientSession();
  const lang = session.identity.language || 'en-IN';
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
        textToRead = `${patientName} அவர்களுக்கான மருத்துவ அறிக்கை. முக்கிய குறைபாடு: ${cc}. தீவிரத்தன்மை: ${session.conversationalHistory.hpi.severity || "மிதமானது"}. உங்கள் தகவல்கள் மருத்துவருக்கு அனுப்ப தயாராக உள்ளன.`;
      } else if (lang === 'hi-IN') {
        textToRead = `मरीज ${patientName} की क्लिनिकल समरी। मुख्य शिकायत: ${cc}। गंभीरता: ${session.conversationalHistory.hpi.severity || "सामान्य"}। आपकी जानकारी डॉक्टर को भेजने के लिए तैयार है।`;
      } else if (lang === 'te-IN') {
        textToRead = `పేషెంట్ ${patientName} గారి మెడికల్ సమ్మరీ. ప్రధాన సమస్య: ${cc}। డాక్టర్‌కు పంపడానికి సిద్ధంగా ఉంది.`;
      } else {
        textToRead = `Clinical summary for ${patientName}. Chief complaint: ${cc}. Severity: ${session.conversationalHistory.hpi.severity || "Reported"}. Your information is ready to be sent to your OPD doctor.`;
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
      redFlag: session.conversationalHistory.redFlag,
      redFlagTriggers: session.conversationalHistory.redFlagTriggers,
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
              Module C: Summary Synthesis
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

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-sm max-h-[380px] overflow-y-auto space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">1. Chief Complaint</div>
            <div className="font-semibold text-kiosk-text bg-white p-2.5 rounded border border-stone-200">
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
              <div className="text-xs font-bold uppercase tracking-wider text-kiosk-ayush mb-1">🌿 Dashavidha Pariksha (AYUSH Parameters)</div>
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
