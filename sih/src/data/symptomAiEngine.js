import { getTranslation } from './translations';

export const generateSymptomQuestions = (complaintStr = "", lang = 'en-IN') => {
  const query = (complaintStr || "").toString().toLowerCase();
  const isTamil = lang === 'ta-IN';
  const isHindi = lang === 'hi-IN';
  const isTelugu = lang === 'te-IN';

  // 1. LEG PAIN / KNEE PAIN / JOINT PAIN
  if (query.includes('leg') || query.includes('knee') || query.includes('foot') || query.includes('calf') || query.includes('கால்') || query.includes('पैर')) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: "கால் வலி சரியாக எங்கு இருக்கிறது?",
          subtext: "இடம் (Leg Pain Site)",
          options: ["கெண்டைச் தசை (Calf muscle)", "முழங்கால் மூட்டு (Knee joint)", "தொடை பகுதி (Thigh)", "பாதம் / கணுக்கால் (Foot/Ankle)"]
        },
        {
          id: "onset",
          title: "இந்த கால் வலி எப்போது தொடங்கியது?",
          subtext: "ஆரம்பம் (Leg Pain Onset)",
          options: ["நடந்த பிறகு / உடற்பயிற்சிக்கு பின்", "இன்று திடீரென்று தொடங்கியது", "கடந்த சில நாட்களாக", "சில வாரங்களாக தொடரும் வலி"]
        },
        {
          id: "character",
          title: "கால் வலி எப்படி உணர்கிறது?",
          subtext: "வலி தன்மை (Leg Pain Character)",
          options: ["தசை பிடிப்பு (Muscle cramps)", "கூர்மையான மூட்டு வலி (Sharp joint pain)", "குத்தல் / குடைச்சல் வலி", "எரிச்சல் உணர்வு (Burning sensation)"]
        },
        {
          id: "associated",
          title: "காலில் வேறு ஏதேனும் அறிகுறிகள் உள்ளனவா?",
          subtext: "தொடர்புடைய அறிகுறிகள் (Associated Symptoms)",
          options: ["வீக்கம் மற்றும் சிவத்தல் (Swelling & Redness)", "மரத்துப்போதல் / உணர்ச்சியின்மை (Numbness)", "நடக்க இயலாமை (Difficulty walking)", "எதுவுமில்லை"]
        },
        {
          id: "severity",
          title: "1 முதல் 10 வரை, கால் வலி எவ்வளவு தீவிரமாக உள்ளது?",
          subtext: "தீவிரம் (Pain Severity Scale)",
          options: ["லேசானது (1 முதல் 3)", "மிதமானது (4 முதல் 6)", "கடுமையானது (7 முதல் 8)", "மிகக் கடுமையானது (9 முதல் 10)"]
        }
      ];
    } else if (isHindi) {
      return [
        {
          id: "site",
          title: "पैर का दर्द ठीक किस जगह हो रहा है?",
          subtext: "स्थान (Leg Pain Site)",
          options: ["पिंडली की मांसपेशी (Calf)", "घुटने का जोड़ (Knee joint)", "जांघ का हिस्सा (Thigh)", "पैर का पंजा / टखना (Foot/Ankle)"]
        },
        {
          id: "onset",
          title: "यह पैर का दर्द कब शुरू हुआ था?",
          subtext: "शुरुआत (Leg Pain Onset)",
          options: ["चलने / व्यायाम के बाद", "आज अचानक शुरू हुआ", "पिछले कुछ दिनों से", "कई हफ्तों से लगातार"]
        },
        {
          id: "character",
          title: "पैर का दर्द कैसा महसूस होता है?",
          subtext: "दर्द की प्रकृति (Leg Pain Character)",
          options: ["मांसपेशियों में ऐंठन (Cramps)", "जोड़ों में तेज दर्द (Sharp joint pain)", "मीठा लगातार दर्द (Dull ache)", "जलन महसूस होना (Burning)"]
        },
        {
          id: "associated",
          title: "क्या पैर में कोई अन्य लक्षण महसूस हो रहे हैं?",
          subtext: "संबंधित लक्षण (Associated Symptoms)",
          options: ["सूजन और लाली (Swelling & Redness)", "सुन्नपन / झुनझुनी (Numbness)", "चलने में परेशानी (Difficulty walking)", "कोई अन्य लक्षण नहीं"]
        },
        {
          id: "severity",
          title: "1 से 10 के पैमाने पर पैर का दर्द कितना तेज है?",
          subtext: "दर्द की तीव्रता (Severity Scale)",
          options: ["हल्का (1 से 3)", "मध्यम (4 से 6)", "तेज (7 से 8)", "अत्यधिक तेज (9 से 10)"]
        }
      ];
    } else {
      return [
        {
          id: "site",
          title: "Where exactly is the leg pain located?",
          subtext: "Site (Leg Pain Location)",
          options: ["Calf muscle", "Knee joint", "Thigh region", "Foot or Ankle"]
        },
        {
          id: "onset",
          title: "When did the leg pain start?",
          subtext: "Onset (Leg Pain Start)",
          options: ["After walking or exercise", "Sudden onset today", "Past few days", "Chronic for weeks"]
        },
        {
          id: "character",
          title: "How does the leg pain feel?",
          subtext: "Character (Pain Type)",
          options: ["Muscle cramps or tightness", "Sharp joint pain", "Dull throbbing ache", "Burning or tingling sensation"]
        },
        {
          id: "associated",
          title: "Do you notice any associated leg symptoms?",
          subtext: "Associated Symptoms",
          options: ["Leg swelling and redness", "Numbness or pins & needles", "Difficulty bearing weight", "None of the above"]
        },
        {
          id: "severity",
          title: "On a scale of 1 to 10, how severe is the leg pain?",
          subtext: "Severity Scale",
          options: ["Mild (1 to 3)", "Moderate (4 to 6)", "Severe (7 to 8)", "Excruciating (9 to 10)"]
        }
      ];
    }
  }

  // 2. STOMACH PAIN / ABDOMINAL CRAMPS
  if (query.includes('stomach') || query.includes('abdomen') || query.includes('belly') || query.includes('வயிறு') || query.includes('पेट')) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: "வயிறு வலி சரியாக எந்த இடத்தில் இருக்கிறது?",
          subtext: "இடம் (Abdominal Site)",
          options: ["மேல் வயிறு (Upper abdomen)", "கீழ் வயிறு (Lower abdomen)", "தொப்புள் சுற்றி (Around navel)", "வயிறு முழுவதும் (Entire stomach)"]
        },
        {
          id: "character",
          title: "வயிறு வலி எப்படி உணர்கிறது?",
          subtext: "வலி தன்மை (Abdominal Character)",
          options: ["வயிற்றுப் பிடிப்பு (Sharp cramps)", "எரிச்சல் உணர்வு (Burning acid)", "வயிறு உப்பசம் (Bloating & heaviness)", "லேசான வலி (Dull ache)"]
        },
        {
          id: "associated",
          title: "வயிறு வலியுடன் வேறு ஏதேனும் அறிகுறிகள் உள்ளனவா?",
          subtext: "தொடர்புடைய அறிகுறிகள்",
          options: ["குமட்டல் அல்லது வாந்தி (Nausea/Vomiting)", "ரத்தப்போக்கு / வயிற்றுப்போக்கு (Diarrhea)", "பசியின்மை (Loss of appetite)", "எதுவுமில்லை"]
        },
        {
          id: "severity",
          title: "1 முதல் 10 வரை, வயிறு வலி எவ்வளவு தீவிரமாக உள்ளது?",
          subtext: "தீவிரம் (Severity Scale)",
          options: ["லேசானது (1 முதல் 3)", "மிதமானது (4 முதல் 6)", "கடுமையானது (7 முதல் 8)", "மிகக் கடுமையானது (9 முதல் 10)"]
        }
      ];
    } else {
      return [
        {
          id: "site",
          title: "Where is the stomach pain located?",
          subtext: "Site (Abdominal Location)",
          options: ["Upper stomach", "Lower stomach", "Around navel", "Entire abdomen"]
        },
        {
          id: "character",
          title: "How does the stomach pain feel?",
          subtext: "Character (Pain Type)",
          options: ["Sharp abdominal cramps", "Burning acid feeling", "Heavy bloating", "Dull ache"]
        },
        {
          id: "associated",
          title: "Any associated digestive symptoms?",
          subtext: "Associated Symptoms",
          options: ["Nausea or vomiting", "Diarrhea or loose stools", "Constipation", "None of the above"]
        },
        {
          id: "severity",
          title: "On a scale of 1 to 10, how severe is the stomach pain?",
          subtext: "Severity Scale",
          options: ["Mild (1 to 3)", "Moderate (4 to 6)", "Severe (7 to 8)", "Excruciating (9 to 10)"]
        }
      ];
    }
  }

  // 3. HEADACHE / HEAD PAIN
  if (query.includes('headache') || query.includes('head') || query.includes('தலை') || query.includes('सिर')) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: "தலைவலி எங்கு இருக்கிறது?",
          subtext: "இடம் (Headache Site)",
          options: ["இரு பக்கமும் / பொட்டு பகுதியில் (Temples)", "நெற்றிப் பகுதியில் (Forehead)", "ஒரு பக்கத்தில் மட்டும் (One side)", "தலைக்கு பின்பக்கம் / കഴுத்து (Back of head/Neck)"]
        },
        {
          id: "character",
          title: "தலைவலி எப்படி உணர்கிறது?",
          subtext: "வலி தன்மை (Headache Character)",
          options: ["துடிதுடிக்கும் வலி (Pulsating/Throbbing)", "கனமான அழுத்தம் (Heavy pressure)", "கூர்மையான குத்தல் (Sharp stabbing)", "மந்தமான வலி (Dull ache)"]
        },
        {
          id: "associated",
          title: "தலைவலியுடன் வேறு ஏதேனும் அறிகுறிகள் உள்ளனவா?",
          subtext: "தொடர்புடைய அறிகுறிகள்",
          options: ["வெளிச்சம் / சத்தம் பிடிக்காமை (Light sensitivity)", "குமட்டல் / மயக்கம் (Nausea/Dizziness)", "கண் பார்வையில் மாற்றம் (Blurred vision)", "எதுவுமில்லை"]
        },
        {
          id: "severity",
          title: "1 முதல் 10 வரை, தலைவலி எவ்வளவு தீவிரமாக உள்ளது?",
          subtext: "தீவிரம் (Severity Scale)",
          options: ["லேசானது (1 முதல் 3)", "மிதமானது (4 முதல் 6)", "கடுமையானது (7 முதல் 8)", "மிகக் கடுமையானது (9 முதல் 10)"]
        }
      ];
    } else {
      return [
        {
          id: "site",
          title: "Where is the headache located?",
          subtext: "Site (Headache Location)",
          options: ["Both sides / Temples", "Forehead region", "One side of head only", "Back of head / Neck"]
        },
        {
          id: "character",
          title: "How does the headache feel?",
          subtext: "Character (Headache Type)",
          options: ["Pulsating or throbbing pain", "Heavy pressure band", "Sharp stabbing pain", "Dull ache"]
        },
        {
          id: "associated",
          title: "Do you notice any associated symptoms?",
          subtext: "Associated Symptoms",
          options: ["Sensitivity to light or sound", "Nausea or dizziness", "Visual disturbances", "None of the above"]
        },
        {
          id: "severity",
          title: "On a scale of 1 to 10, how severe is the headache?",
          subtext: "Severity Scale",
          options: ["Mild (1 to 3)", "Moderate (4 to 6)", "Severe (7 to 8)", "Excruciating (9 to 10)"]
        }
      ];
    }
  }

  // DEFAULT / GENERAL COMPLAINT GENERATOR FOR ANY OTHER SYMPTOM
  const symptomTitle = complaintStr || "your symptom";
  if (isTamil) {
    return [
      {
        id: "site",
        title: `${symptomTitle} உடலின் எந்தப் பகுதியில் ஏற்படுகிறது?`,
        subtext: "இடம் (Symptom Location)",
        options: ["குறிப்பிட்ட ஒரு இடத்தில்", "உடல் முழுவதும் பரவி", "இடது பகுதியில்", "வலது பகுதியில்"]
      },
      {
        id: "onset",
        title: `இந்த ${symptomTitle} எப்போது தொடங்கியது?`,
        subtext: "ஆரம்பம் (Symptom Onset)",
        options: ["திடீரென்று (இன்று)", "கடந்த 2-3 நாட்களாக", "கடந்த ஒரு வாரமாக", "நீண்ட நாட்களாக"]
      },
      {
        id: "character",
        title: `இந்த ${symptomTitle} உணர்வு எப்படி இருக்கிறது?`,
        subtext: "தன்மை (Symptom Character)",
        options: ["கடுமையான அசௌகரியம்", "லேசான தொடர் வலி", "எரிச்சல் / குத்தல்", "அவ்வப்போது வந்து போகும்"]
      },
      {
        id: "severity",
        title: `1 முதல் 10 வரை, இதன் தீவிரத்தன்மை எவ்வளவு?`,
        subtext: "தீவிரம் (Severity Scale)",
        options: ["லேசானது (1 முதல் 3)", "மிதமானது (4 முதல் 6)", "கடுமையானது (7 முதல் 8)", "மிகக் கடுமையானது (9 முதல் 10)"]
      }
    ];
  } else {
    return [
      {
        id: "site",
        title: `Where exactly is ${symptomTitle} located?`,
        subtext: "Site (Location)",
        options: ["Localized to one area", "Spreading across region", "Left side", "Right side"]
      },
      {
        id: "onset",
        title: `When did ${symptomTitle} start?`,
        subtext: "Onset (Duration)",
        options: ["Sudden (Today)", "2 to 3 days ago", "Past week", "Chronic / Long term"]
      },
      {
        id: "character",
        title: `How does ${symptomTitle} feel?`,
        subtext: "Character (Type)",
        options: ["Severe discomfort", "Mild continuous ache", "Burning or sharp sensation", "Intermittent / Comes and goes"]
      },
      {
        id: "severity",
        title: "On a scale of 1 to 10, how severe is it right now?",
        subtext: "Severity Scale",
        options: ["Mild (1 to 3)", "Moderate (4 to 6)", "Severe (7 to 8)", "Excruciating (9 to 10)"]
      }
    ];
  }
};
