export const generateSymptomQuestions = (complaintStr = "", lang = 'en-IN') => {
  const query = (complaintStr || "").toString().toLowerCase();
  const isTamil = lang === 'ta-IN';
  const isHindi = lang === 'hi-IN';

  // 1. FEVER / HIGH FEVER / CHILLS (No "where is pain located" nonsense for fever!)
  if (query.includes('fever') || query.includes('temperature') || query.includes('chills') || query.includes('காய்ச்சல்') || query.includes('बुखार')) {
    if (isTamil) {
      return [
        {
          id: "severity",
          title: "காய்ச்சலின் அளவு அல்லது தன்மை எவ்வாறு உள்ளது?",
          subtext: "காய்ச்சல் நிலை (Fever Grade)",
          options: ["அதிக காய்ச்சல் (>101°F)", "மிதமான காய்ச்சல் (99-100°F)", "குளிர் மற்றும் நடுக்கத்துடன் காய்ச்சல்", "விட்டு விட்டு வரும் காய்ச்சல்"]
        },
        {
          id: "onset",
          title: "இந்த காய்ச்சல் எத்தனை நாட்களாக உள்ளது?",
          subtext: "கால அளவு (Fever Duration)",
          options: ["இன்று திடீரென்று தொடங்கியது", "கடந்த 2-3 நாட்களாக", "ஒரு வாரத்திற்கு மேலாக", "மாலை நேரத்தில் மட்டும் வரும் காய்ச்சல்"]
        },
        {
          id: "associated",
          title: "காய்ச்சலுடன் வேறு என்ன அறிகுறிகள் உள்ளன?",
          subtext: "தொடர்புடைய அறிகுறிகள் (Associated Symptoms)",
          options: ["உடல் வலி மற்றும் தலைவலி", "இருமல் மற்றும் தொண்டை வலி", "குமட்டல், வாந்தி அல்லது வயிற்றுப்போக்கு", "சருமத்தில் சிவப்பு புள்ளிகள் / தடிப்புகள்"]
        },
        {
          id: "medication",
          title: "காய்ச்சலுக்கு ஏதேனும் மருந்து உட்கொண்டீர்களா?",
          subtext: "முந்தைய மருந்துகள் (Medication History)",
          options: ["பாரசிட்டமால் உட்கொண்டேன் - காய்ச்சல் குறைந்தது", "மருந்து உட்கொண்டும் காய்ச்சல் குறையவில்லை", "இதுவரை எந்த மருந்தும் உட்கொள்ளவில்லை"]
        }
      ];
    } else if (isHindi) {
      return [
        {
          id: "severity",
          title: "बुखार का स्तर कैसा महसूस हो रहा है?",
          subtext: "बुखार की तीव्रता (Fever Grade)",
          options: ["तेज बुखार (>101°F)", "हल्का बुखार (99-100°F)", "कंपकंपी और ठंड के साथ बुखार", "आने-जाने वाला बुखार"]
        },
        {
          id: "onset",
          title: "यह बुखार कितने दिनों से है?",
          subtext: "अवधि (Fever Duration)",
          options: ["आज अचानक शुरू हुआ", "पिछले 2-3 दिनों से", "एक हफ्ते से अधिक", "केवल शाम को आने वाला बुखार"]
        },
        {
          id: "associated",
          title: "बुखार के साथ और कौन से लक्षण हैं?",
          subtext: "संबंधित लक्षण (Associated Symptoms)",
          options: ["शरीर में दर्द और सिरदर्द", "खांसी और गले में खराश", "उल्टी या दस्त", "त्वचा पर लाल चकत्ते"]
        },
        {
          id: "medication",
          title: "क्या आपने बुखार की कोई दवा ली है?",
          subtext: "दवा का इतिहास (Medication Status)",
          options: ["पैरासिटामोल ली - बुखार कम हुआ", "दवा लेने पर भी बुखार कम नहीं हुआ", "अभी तक कोई दवा नहीं ली"]
        }
      ];
    } else {
      return [
        {
          id: "severity",
          title: "What is your current fever temperature or grade?",
          subtext: "Fever Grade & Pattern",
          options: ["High fever (>101°F / 38.3°C)", "Mild fever (99-100°F)", "Fever with severe chills & shivering", "Intermittent fever (comes & goes)"]
        },
        {
          id: "onset",
          title: "How long have you had this fever?",
          subtext: "Duration",
          options: ["Sudden onset today", "Past 2 to 3 days", "Over a week", "Fever spikes mostly in evenings"]
        },
        {
          id: "associated",
          title: "Do you have any associated symptoms with the fever?",
          subtext: "Associated Symptoms",
          options: ["Severe body pain & headache", "Cough & sore throat", "Nausea, vomiting, or diarrhea", "Skin rash or red spots"]
        },
        {
          id: "medication",
          title: "Have you taken any fever reduction medicines?",
          subtext: "Medication Status",
          options: ["Taken Paracetamol - fever dropped temporarily", "Taken medicine - fever persists", "Have not taken any medication yet"]
        }
      ];
    }
  }

  // 2. COUGH / COLD / BREATHING DIFFICULTIES
  if (query.includes('cough') || query.includes('cold') || query.includes('breath') || query.includes('இருமல்') || query.includes('खांसी')) {
    if (isTamil) {
      return [
        {
          id: "character",
          title: "இருமல் எந்த வகையானது?",
          subtext: "இருமல் வகை (Cough Type)",
          options: ["வரட்டு இருமல் (Dry cough)", "சளியுடன் கூடிய இருமல் (Wet cough with phlegm)", "மூச்சுத்திணறலுடன் கூடிய இருமல்", "தொண்டை அரிப்புடன் இருமல்"]
        },
        {
          id: "onset",
          title: "இருமல் அல்லது சளி எப்போது தொடங்கியது?",
          subtext: "கால அளவு (Onset)",
          options: ["கடந்த 1-2 நாட்களாக", "கடந்த ஒரு வாரமாக", "2 வாரங்களுக்கு மேலாக", "இரவில் மட்டும் அதிகமாகும் இருமல்"]
        },
        {
          id: "sputum",
          title: "சளி இருந்தால் அதன் நிறம் என்ன?",
          subtext: "சளி நிறம் (Phlegm Color)",
          options: ["வெள்ளை / நிறமற்றது", "மஞ்சள் அல்லது பச்சை நிறம்", "இரத்தம் தோய்ந்தது (Blood-tinged)", "வரட்டு இருமல் - சளி இல்லை"]
        },
        {
          id: "associated",
          title: "மூச்சு விடுவதில் சிரமம் அல்லது மார்பு சத்தம் உள்ளதா?",
          subtext: "சுவாச அறிகுறிகள் (Respiratory Symptoms)",
          options: ["வேகமாக நடக்கும்போது மூச்சு வாங்குதல்", "மார்பில் கூச்சல் சத்தம் (Wheezing)", "தொண்டை அடைப்பு மற்றும் கரகரப்பு", "எதுவுமில்லை"]
        }
      ];
    } else {
      return [
        {
          id: "character",
          title: "What type of cough are you experiencing?",
          subtext: "Cough Type",
          options: ["Dry tickling cough", "Productive cough with phlegm", "Cough with wheezing & tightness", "Throat irritation cough"]
        },
        {
          id: "onset",
          title: "When did the cough or respiratory symptoms start?",
          subtext: "Duration",
          options: ["Past 1 to 2 days", "Past week", "More than 2 weeks", "Worse at night time"]
        },
        {
          id: "sputum",
          title: "What color is the sputum / phlegm if present?",
          subtext: "Phlegm Color",
          options: ["Clear or white", "Yellowish or greenish", "Blood-stained / Rusty", "Dry cough (no sputum)"]
        },
        {
          id: "associated",
          title: "Are you experiencing any breathing difficulties?",
          subtext: "Respiratory Status",
          options: ["Shortness of breath on walking", "Wheezing sound in chest", "Sore throat & hoarseness", "No shortness of breath"]
        }
      ];
    }
  }

  // 3. CHEST PAIN / CARDIAC RED FLAG
  if (query.includes('chest') || query.includes('மார்பு') || query.includes('सीने')) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: "மார்பு வலி சரியாக எந்த இடத்தில் இருக்கிறது?",
          subtext: "இடம் (Chest Pain Site)",
          options: ["இடது பக்க மார்பு (Left side)", "மார்பின் நடுப்பகுதி (Center chest)", "இடது கை / தாடைக்கு பரவும் வலி", "வலது பக்க மார்பு"]
        },
        {
          id: "character",
          title: "மார்பு வலி எப்படி உணர்கிறது?",
          subtext: "வலி தன்மை (Chest Pain Character)",
          options: ["கனமான அழுத்தம் / பிழிவது போன்ற வலி (Heavy pressure)", "கூர்மையான குத்தல் வலி (Sharp stabbing)", "நெஞ்செரிச்சல் (Heartburn)", "மந்தமான வலி"]
        },
        {
          id: "associated",
          title: "மார்பு வலியுடன் வேறு ஏதேனும் அறிகுறிகள் உள்ளனவா?",
          subtext: "சிவப்பு கொடி அறிகுறிகள் (Red Flag Symptoms)",
          options: ["மூச்சுத்திணறல் மற்றும் அதிக வேர்வை (Breathing distress & Sweating)", "மயக்கம் மற்றும் தலைச்சுற்றல்", "படபடப்பு (Palpitations)", "எதுவுமில்லை"]
        },
        {
          id: "severity",
          title: "1 முதல் 10 வரை, மார்பு வலி எவ்வளவு தீவிரமாக உள்ளது?",
          subtext: "தீவிரம் (Pain Severity)",
          options: ["லேசானது (1-3)", "மிதமானது (4-6)", "கடுமையானது (7-8)", "மிகக் கடுமையானது (9-10)"]
        }
      ];
    } else {
      return [
        {
          id: "site",
          title: "Where exactly is the chest discomfort felt?",
          subtext: "Chest Location",
          options: ["Left side of chest", "Center of chest (Substernal)", "Radiating to left arm, neck or jaw", "Right side of chest"]
        },
        {
          id: "character",
          title: "How would you describe the chest pain quality?",
          subtext: "Pain Character",
          options: ["Heavy crushing pressure or tightness", "Sharp stabbing pain when taking breath", "Burning acid heartburn", "Dull ache"]
        },
        {
          id: "associated",
          title: "Do you have any critical associated symptoms?",
          subtext: "Associated Symptoms (Red Flags)",
          options: ["Shortness of breath & profuse sweating", "Dizziness or near fainting", "Heart palpitations or rapid pulse", "None of the above"]
        },
        {
          id: "severity",
          title: "On a scale of 1 to 10, how severe is the chest discomfort?",
          subtext: "Severity Scale",
          options: ["Mild (1 to 3)", "Moderate (4 to 6)", "Severe (7 to 8)", "Excruciating (9 to 10)"]
        }
      ];
    }
  }

  // 4. SKIN RASH / ALLERGY / ITCHING
  if (query.includes('skin') || query.includes('rash') || query.includes('itch') || query.includes('தடிப்பு') || query.includes('खुजली')) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: "தோல் தடிப்பு அல்லது அரிப்பு எங்குள்ளது?",
          subtext: "இடம் (Rash Location)",
          options: ["முகம் மற்றும் கழுத்து", "கைகள் மற்றும் கால்கள்", "மார்பு மற்றும் முதுகு", "உடல் முழுவதும் பரவி"]
        },
        {
          id: "character",
          title: "தடிப்பு எப்படி காணப்படுகிறது?",
          subtext: "தோற்றம் (Rash Appearance)",
          options: ["சிவப்பு நிற தடிப்புகள்", "கொப்பளங்கள் / நீர் தடிப்புகள்", "வரண்ட செதில் போன்ற தோல்", "அரிப்புடன் கூடிய தடிப்புகள்"]
        },
        {
          id: "associated",
          title: "வேறு ஏதேனும் அறிகுறிகள் உள்ளதா?",
          subtext: "தொடர்புடைய அறிகுறிகள்",
          options: ["கடுமையான அரிப்பு", "எரிச்சல் மற்றும் வலி", "காய்ச்சல்", "எதுவுமில்லை"]
        }
      ];
    } else {
      return [
        {
          id: "site",
          title: "Where is the skin rash or itching located?",
          subtext: "Location",
          options: ["Face and neck", "Arms and legs", "Chest and back", "Widespread over entire body"]
        },
        {
          id: "character",
          title: "What does the skin rash look like?",
          subtext: "Appearance",
          options: ["Red raised spots / hives", "Fluid-filled blisters", "Dry scaly skin patches", "Red itchy patches"]
        },
        {
          id: "associated",
          title: "Are you experiencing any associated symptoms?",
          subtext: "Associated Symptoms",
          options: ["Severe itching", "Burning sensation or pain", "Accompanying fever", "None of the above"]
        }
      ];
    }
  }

  // 5. LEG PAIN / KNEE PAIN / JOINT PAIN
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

  // 6. STOMACH PAIN / ABDOMINAL CRAMPS
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
          options: ["குமட்டல் அல்லது வாந்தி (Nausea/Vomiting)", "வயிற்றுப்போக்கு (Diarrhea)", "பசியின்மை (Loss of appetite)", "எதுவுமில்லை"]
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

  // 7. HEADACHE / HEAD PAIN
  if (query.includes('headache') || query.includes('head') || query.includes('தலை') || query.includes('सिर')) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: "தலைவலி எங்கு இருக்கிறது?",
          subtext: "இடம் (Headache Site)",
          options: ["இரு பக்கமும் / பொட்டு பகுதியில் (Temples)", "நெற்றிப் பகுதியில் (Forehead)", "ஒரு பக்கத்தில் மட்டும் (One side)", "தலைக்கு பின்பக்கம் / கழுத்து (Back of head/Neck)"]
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

  // 8. GENERAL PAIN ENGINE (When "pain" is in the complaint string)
  const isPainComplaint = query.includes('pain') || query.includes('ache') || query.includes('வலி') || query.includes('दर्द');
  const symptomTitle = complaintStr || "your symptom";

  if (isPainComplaint) {
    if (isTamil) {
      return [
        {
          id: "site",
          title: `${symptomTitle} உடலின் எந்தப் பகுதியில் இருக்கிறது?`,
          subtext: "இடம் (Pain Location)",
          options: ["குறிப்பிட்ட ஒரு இடத்தில்", "சுற்றியுள்ள பகுதிக்கு பரவுகிறது", "இடது பகுதியில்", "வலது பகுதியில்"]
        },
        {
          id: "onset",
          title: `இந்த ${symptomTitle} எப்போது தொடங்கியது?`,
          subtext: "ஆரம்பம் (Onset)",
          options: ["இன்று திடீரென்று தொடங்கியது", "கடந்த 2-3 நாட்களாக", "கடந்த ஒரு வாரமாக", "நீண்ட நாட்களாக உள்ளது"]
        },
        {
          id: "character",
          title: `இந்த ${symptomTitle} உணர்வு எப்படி இருக்கிறது?`,
          subtext: "தன்மை (Pain Character)",
          options: ["கூர்மையான குத்தல் வலி", "துடிக்கும் வலி", "மந்தமான தொடர் வலி", "எரிச்சல் உணர்வு"]
        },
        {
          id: "severity",
          title: "1 முதல் 10 வரை, வலி எவ்வளவு தீவிரமாக உள்ளது?",
          subtext: "தீவிரம் (Severity Scale)",
          options: ["லேசானது (1 முதல் 3)", "மிதமானது (4 முதல் 6)", "கடுமையானது (7 முதல் 8)", "மிகக் கடுமையானது (9 முதல் 10)"]
        }
      ];
    } else {
      return [
        {
          id: "site",
          title: `Where exactly is ${symptomTitle} located?`,
          subtext: "Site (Pain Location)",
          options: ["Localized to one exact spot", "Radiating / Spreading to surrounding area", "Left side", "Right side"]
        },
        {
          id: "onset",
          title: `When did ${symptomTitle} start?`,
          subtext: "Onset (Duration)",
          options: ["Sudden onset today", "Past 2 to 3 days", "Past week", "Chronic / Longstanding"]
        },
        {
          id: "character",
          title: `How does ${symptomTitle} feel?`,
          subtext: "Character (Pain Type)",
          options: ["Sharp stabbing pain", "Throbbing / Pulsating pain", "Dull continuous ache", "Burning or tingling sensation"]
        },
        {
          id: "severity",
          title: "On a scale of 1 to 10, how severe is the pain?",
          subtext: "Severity Scale",
          options: ["Mild (1 to 3)", "Moderate (4 to 6)", "Severe (7 to 8)", "Excruciating (9 to 10)"]
        }
      ];
    }
  }

  // 9. NON-PAIN GENERAL SYMPTOMS ENGINE
  if (isTamil) {
    return [
      {
        id: "onset",
        title: `${symptomTitle} எப்போது தொடங்கியது?`,
        subtext: "ஆரம்பம் (Duration)",
        options: ["இன்று திடீரென்று தொடங்கியது", "கடந்த 2-3 நாட்களாக", "கடந்த ஒரு வாரமாக", "நீண்ட நாட்களாக"]
      },
      {
        id: "character",
        title: `இந்த ${symptomTitle} அசௌகரியம் எவ்வாறு உணரப்படுகிறது?`,
        subtext: "தன்மை (Symptom Character)",
        options: ["மிதமான அசௌகரியம்", "அவ்வப்போது வந்து போகும்", "தொடர்ச்சியான சிரமம்", "இரவில் அதிகம்"]
      },
      {
        id: "severity",
        title: "இதன் தீவிரத்தன்மை எவ்வாறு உள்ளது?",
        subtext: "தீவிரம் (Severity Scale)",
        options: ["லேசானது", "மிதமானது", "கடுமையானது", "மிகக் கடுமையானது"]
      }
    ];
  } else {
    return [
      {
        id: "onset",
        title: `When did ${symptomTitle} start?`,
        subtext: "Onset (Duration)",
        options: ["Sudden onset today", "Past 2 to 3 days", "Past week", "Chronic / Longstanding"]
      },
      {
        id: "character",
        title: `How would you describe the ${symptomTitle} discomfort?`,
        subtext: "Character (Symptom Type)",
        options: ["Mild discomfort", "Intermittent / Comes and goes", "Continuous distress", "Worse during night time"]
      },
      {
        id: "severity",
        title: "How severe is this symptom affecting your daily routine?",
        subtext: "Severity Scale",
        options: ["Mild (Noticeable but easy)", "Moderate (Bothersome)", "Severe (Interferes with routine)", "Excruciating (Incapacitating)"]
      }
    ];
  }
};
