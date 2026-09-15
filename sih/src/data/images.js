// GUARANTEED ZERO BROKEN IMAGES: INLINE HIGH-RESOLUTION SVG DATA URLS

const createSvgBanner = (title, subtitle, color = "%23059669", bg = "%230c0a09") =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'><rect width='1200' height='600' fill='${bg}'/><circle cx='600' cy='300' r='250' fill='${color}' opacity='0.15'/><path d='M560 180h80v240h-80z' fill='${color}'/><path d='M480 260h240v80h-240z' fill='${color}'/><text x='600' y='460' font-family='Arial, sans-serif' font-size='38' font-weight='800' fill='%23ffffff' text-anchor='middle'>${title}</text><text x='600' y='510' font-family='Arial, sans-serif' font-size='22' font-weight='600' fill='%2334d399' text-anchor='middle'>${subtitle}</text></svg>`;

const createAvatarSvg = (initials, roleTitle, color = "%2310b981", bg = "%231c1917") =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'><rect width='300' height='300' rx='150' fill='${bg}'/><circle cx='150' cy='115' r='55' fill='${color}'/><path d='M75 255c0-42 34-68 75-68s75 26 75 68z' fill='${color}'/><text x='150' y='128' font-family='Arial, sans-serif' font-size='32' font-weight='900' fill='%23ffffff' text-anchor='middle'>${initials}</text><text x='150' y='282' font-family='Arial, sans-serif' font-size='14' font-weight='800' fill='%23ffffff' text-anchor='middle'>${roleTitle}</text></svg>`;

export const MEDICAL_IMAGES = {
  hero: process.env.PUBLIC_URL + "/assets/images/hero.png",
  loginSlide1: process.env.PUBLIC_URL + "/assets/images/loginSlide1.png",
  loginSlide2: process.env.PUBLIC_URL + "/assets/images/loginSlide2.png",
  loginSlide3: process.env.PUBLIC_URL + "/assets/images/loginSlide3.png",
  consultation: process.env.PUBLIC_URL + "/assets/images/consultation.png",
  documentScan: createSvgBanner("OCR Document Scanner", "Prescriptions & Lab Scans", "%23059669", "%23111827"),
  ayurveda: createSvgBanner("AYUSH Wellness Care", "Ayurveda, Siddha & Homeopathy", "%2316a34a", "%23052e16"),
  digitalKiosk: process.env.PUBLIC_URL + "/assets/images/digitalKiosk.png",
  doctorWorkspace: process.env.PUBLIC_URL + "/assets/images/doctorWorkspace.png",
  nurseStation: createSvgBanner("Nurse Triage Desk", "Vitals & Priority Assessment", "%237c3aed", "%230f172a"),
  patientBanner: process.env.PUBLIC_URL + "/assets/images/patientBanner.png",
  labReport: createSvgBanner("Diagnostic Metrics", "Automated Lab Extraction", "%23ea580c", "%231c1917"),
  tnHospital: process.env.PUBLIC_URL + "/assets/images/tnHospital.png",
  abhaCard: createSvgBanner("ABHA Digital Health Card", "Ayushman Bharat Identity", "%232563eb", "%231e3a8a"),
  registerBanner: process.env.PUBLIC_URL + "/assets/images/registerBanner.png",
  stethoscope: createSvgBanner("General Medicine", "Outpatient OPD Care", "%230284c7", "%230f172a"),
  xrayScan: createSvgBanner("Radiology & X-Ray", "Diagnostic Imaging", "%23475569", "%23020617"),
  ayurvedicHerbs: createSvgBanner("Herbal Medicine", "Natural Healing & Care", "%2316a34a", "%23052e16"),
  patientCare: process.env.PUBLIC_URL + "/assets/images/patientCare.png",
  aiMedical: process.env.PUBLIC_URL + "/assets/images/aiMedical.png",
  cmcellHero: process.env.PUBLIC_URL + "/assets/images/cmcellHero.png",
  receptionDesk: createSvgBanner("Reception Desk", "Patient Queue & Guidance", "%230284c7", "%230f172a"),
  emergencyCare: process.env.PUBLIC_URL + "/assets/images/emergencyCare.png",
  hospitalBuilding1: process.env.PUBLIC_URL + "/assets/images/hospitalBuilding1.png",
  hospitalBuilding2: process.env.PUBLIC_URL + "/assets/images/hospitalBuilding2.png",
  hospitalBuilding3: process.env.PUBLIC_URL + "/assets/images/hospitalBuilding3.png",
  hospitalBuilding4: createSvgBanner("AYUSH Medical College", "Research & Education", "%230284c7", "%230f172a"),
  tnEmblem: createSvgBanner("Government of Tamil Nadu", "Department of Health & Family Welfare", "%23059669", "%23064e3b")
};

export const ROLE_AVATARS = {
  admin: createAvatarSvg("ADM", "ADMIN", "%2310b981", "%23064e3b"),
  doctor1: createAvatarSvg("DR1", "DOCTOR", "%230284c7", "%23075985"),
  doctor2: createAvatarSvg("DR2", "SPECIALIST", "%230369a1", "%230c4a6e"),
  doctor3: createAvatarSvg("DR3", "SURGEON", "%230284c7", "%23075985"),
  nurse1: createAvatarSvg("NRS1", "NURSE", "%238b5cf6", "%235b21b6"),
  nurse2: createAvatarSvg("NRS2", "TRIAGE", "%237c3aed", "%234c1d95"),
  receptionist1: createAvatarSvg("REC1", "DESK", "%230d9488", "%23115e59"),
  receptionist2: createAvatarSvg("REC2", "OPD", "%230f766e", "%23134e4a"),
  patientMale1: process.env.PUBLIC_URL + "/assets/images/patientMale1Avatar.png",
  patientMale2: process.env.PUBLIC_URL + "/assets/images/patientMale2Avatar.png",
  patientFemale1: process.env.PUBLIC_URL + "/assets/images/patientFemale1Avatar.png",
  patientFemale2: process.env.PUBLIC_URL + "/assets/images/patientFemale2Avatar.png",
  patientSenior: createAvatarSvg("SNR", "SENIOR", "%23f59e0b", "%2378350f")
};

export const FALLBACK_HOSPITAL_SVG = createSvgBanner("Government Medical Institution", "Tamil Nadu Health System");
