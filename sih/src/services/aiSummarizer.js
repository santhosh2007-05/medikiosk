// AI MODEL OCR SUMMARIZATION SERVICE (GROQ LLAMA-3.3 70B & GEMINI API INTEGRATION)
export const summarizeOcrTextWithAI = async (rawOcrText, docType = 'Prescription') => {
  const groqApiKey = process.env.REACT_APP_GROQ_API_KEY || '';
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY || '';

  // 1. LIVE GROQ LLAMA-3.3 70B API CALL
  if (groqApiKey && groqApiKey.startsWith('gsk_')) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert clinical medical AI auditor for a Hospital Kiosk.
Analyze the provided OCR text extracted from an uploaded image or document.
Determine if the text represents:
1) A VALID MEDICAL DOCUMENT (e.g. Lab Diagnostic Report, Doctor Prescription, AYUSH OPD Report, Discharge Summary).
   If valid: Provide a concise clinical summary covering Patient Name, Key Lab Values/Diagnostics, Prescribed Rx Medications, and Clinical Impression.
2) AN INVALID / NON-MEDICAL FILE (e.g. App UI menu screenshot, CareTrack Portal screenshot, computer code, IoT document, receipt, general screenshot).
   If non-medical or UI screenshot: Explicitly start with "⚠️ NON-MEDICAL CONTENT DETECTED:" and explain what the text actually contains (e.g. "This image contains CareTrack Doctor Portal navigation menu items: Doctor Role, Patients Caseload, Transport Desk, etc."). Clearly instruct that no clinical lab metrics or prescriptions were found, and advise uploading a genuine medical report.`
            },
            {
              role: 'user',
              content: `Selected Document Category: ${docType}\nExtracted OCR Text Content:\n"""\n${rawOcrText}\n"""`
            }
          ],
          temperature: 0.1
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        return {
          summary: data.choices[0].message.content,
          apiStatus: "Groq Llama-3.3 70B Live AI"
        };
      } else if (data.error?.message) {
        console.warn('Groq API Error:', data.error.message);
      }
    } catch (err) {
      console.warn('Groq API call failed, attempting fallback:', err);
    }
  }

  // 2. LIVE GEMINI API FALLBACK
  if (geminiApiKey && geminiApiKey.startsWith('AIzaSy')) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyze this OCR text. If medical, summarize diagnosis and medications. If non-medical (e.g. UI menu, CareTrack screenshot, code), state that it is non-medical and what it contains:\n\n${rawOcrText}` }] }]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          summary: data.candidates[0].content.parts[0].text,
          apiStatus: "Gemini 1.5 Flash Live API"
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed:', err);
    }
  }

  // 3. OFFLINE CLINICAL ANALYSIS
  const lower = rawOcrText.toLowerCase();
  let nlpSummary = `Analyzed uploaded file content: "${rawOcrText.slice(0, 150)}..."`;
  if (lower.includes('caretrack') || lower.includes('doctor role') || lower.includes('caseload') || lower.includes('transport desk') || lower.includes('settings') || lower.includes('help center')) {
    nlpSummary = "⚠️ NON-MEDICAL CONTENT DETECTED: Uploaded image contains CareTrack Doctor Portal UI navigation menus (Doctor Role, Caseload, Transport Desk, Settings). No diagnostic lab metrics or medical prescriptions found. Please upload a valid clinical report.";
  } else if (lower.includes('mobile') || lower.includes('computing') || lower.includes('iot')) {
    nlpSummary = "⚠️ NON-MEDICAL CONTENT DETECTED: This document contains technical research on Mobile & Edge IoT Computing. Please upload an official clinical lab report or prescription.";
  }

  return {
    summary: nlpSummary,
    apiStatus: "Offline Clinical NLP Engine"
  };
};

