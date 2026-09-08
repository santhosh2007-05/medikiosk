// DETERMINISTIC 3,800 UNIQUE MEMBER HOSPITAL ROSTER & CLINICAL ANALYTICS ENGINE
// 380 HOSPITALS x 10 MEMBERS = 3,800 100% UNIQUE PERSONNEL & PATIENTS (+ 1 SUPER ADMIN = 3,801 TOTAL)

import { ALL_380_TN_HOSPITALS } from './tnHospitals';

const SOUTH_INDIAN_NAME_BASES = [
  "Joseph Vijay", "Rajinikanth M.", "Kamal Haasan R.", "Suriya S.", "Ajith Kumar P.",
  "Dhanush K.", "Vikram C.", "Karthi S.", "Sivakarthikeyan G.", "Vijay Sethupathi M.",
  "Trisha Krishnan", "Nayanthara V.", "Samantha Ruth", "Rashmika Mandanna", "Keerthy Suresh",
  "Jyothika S.", "Prashanth T.", "Arya K.", "Vishal Reddy", "Jayam Ravi",
  "Silambarasan TR", "Jiiva M.", "Siddharth R.", "Madhavan R.", "Dulquer Salmaan",
  "Fahadh Faasil", "Mammootty K.", "Mohanlal V.", "Prabhas Raju", "Mahesh Babu G.",
  "Allu Arjun", "Ram Charan T.", "NTR Jr. T.", "Yash Gowda", "Rishab Shetty",
  "Supriya Sahu IAS", "Gagandeep Singh Bedi IAS", "Irai Anbu IAS", "U. Sagayam IAS", "J. Radhakrishnan IAS",
  "Beela Rajesh IAS", "Santhosh Babu IAS", "M. K. Stalin", "Udhayanidhi Stalin", "K. Annamalai",
  "Ma. Subramanian", "P. T. R. Palanivel", "Thangam Thennarasu", "Duraimurugan K.", "Kanimozhi Karunanidhi",
  "Vanathi Srinivasan", "C. Vijayabaskar", "Madan Gowri", "Irfan View", "Village Cooking Chef",
  "TTF Vasan", "Pugazh KPY", "Bala KPY", "Yogi Babu", "Soori G.",
  "Vadivelu N.", "Goundamani K.", "Senthil V.", "Munishkanth R.", "Kaali Venkat",
  "Kavin Raj", "Harish Kalyan", "Kathir S.", "Kalaiyarasan", "Ashok Selvan",
  "Manikandan K.", "Santhosh Prathap", "Gautham Karthik", "Shanthnu Bhagyaraj", "Arav K.",
  "Aishwarya Rajesh", "Dushara Vijayan", "Mahima Nambiar", "Amritha Aiyer", "Reba Monica",
  "Shivani Narayanan", "Losliya Mariya", "Vani Bhojan", "Pavitra Lakshmi", "Andrea Jeremiah",
  "Ramya Krishnan", "Nazriya Nazim", "Nithya Menen", "Priyamani R.", "Kalyani Priyadarshan",
  "Pooja Hegde", "Hansika Motwani", "Nivetha Thomas", "Shruti Haasan", "Meena Durairaj",
  "Simran Bagga", "Sneha Prasanna", "Radhika Sarathkumar", "Revathi Menon", "Suhasini Maniratnam"
];

const SPECIALTIES = [
  "Cardiology & Ayush Integrative Care",
  "Orthopedics & Joint Trauma Care",
  "ENT & Respiratory Medicine",
  "Interventional Cardiology",
  "Internal Medicine & Metabolic Health",
  "Ayush Kayachikitsa & Panchakarma",
  "Spine & Sports Rehabilitation",
  "Respiratory & Critical Care"
];

const QUALIFICATIONS = [
  "MD (General Medicine), MS (Ayurveda)",
  "MS (Orthopedics), DNB",
  "MD (Pediatrics & ENT), FRCS",
  "MD, DM (Cardiology)",
  "MD (General Medicine), DNB",
  "BAMS, MD (Ayurveda)",
  "MS (Orthopedics), MCh",
  "MD (Pulmonology)"
];

const DISEASE_CATEGORIES = [
  // Heart & Cardiac Care
  { category: "Heart & Cardiac Care", diag: "Ischemic Myocardial Strain", tab: "Tab Telmisartan 40mg + Sahacharadi Thailam 10ml", limit: 10, days: 8 },
  { category: "Heart & Cardiac Care", diag: "Essential Hypertension & Vata", tab: "Tab Amlodipine 5mg + Brahmi Rasayana 5g", limit: 14, days: 11 },
  { category: "Heart & Cardiac Care", diag: "Coronary Micro-Vascular Spasm", tab: "Tab Nitroglycerin 2.6mg + Prabhakar Vati", limit: 12, days: 9 },
  { category: "Heart & Cardiac Care", diag: "Paroxysmal Supraventricular Tachycardia", tab: "Tab Metoprolol 25mg + Sarpagandha Vati", limit: 10, days: 8 },
  { category: "Heart & Cardiac Care", diag: "Hyperlipidemia & Metabolic Vascular Risk", tab: "Tab Rosuvastatin 10mg + Arjuna Ksheerapaka", limit: 15, days: 12 },

  // Orthopedic & Joint Care
  { category: "Orthopedic & Joint Care", diag: "Patellofemoral Pain Syndrome", tab: "Tab Flexon MR + Murivenna Oil Massage", limit: 10, days: 9 },
  { category: "Orthopedic & Joint Care", diag: "Cervical Radiculopathy & Muscle Spasm", tab: "Tab Myospaz + Kottamchukkadi Thailam", limit: 12, days: 10 },
  { category: "Orthopedic & Joint Care", diag: "Lumbar Disc Bulge & Paraspinal Strain", tab: "Tab Ultracet + Dhanwantharam Thailam", limit: 14, days: 11 },
  { category: "Orthopedic & Joint Care", diag: "Biceps Tendonitis & Shoulder Impingement", tab: "Tab Aceclofenac 100mg + Pinda Thailam", limit: 10, days: 7 },
  { category: "Orthopedic & Joint Care", diag: "Lateral Ankle Ligament Sprain", tab: "Tab Chymoral Forte + Elastic Bandage + Murivenna", limit: 8, days: 6 },
  { category: "Orthopedic & Joint Care", diag: "Plantar Fasciitis & Calcaneal Spur", tab: "Tab Etoricoxib 60mg + Ortho Cushion", limit: 10, days: 8 },

  // Respiratory & ENT Care
  { category: "Respiratory & ENT Care", diag: "Chronic Allergic Bronchitis", tab: "Tab Montair-LC + Haridra Khanda 5g", limit: 10, days: 7 },
  { category: "Respiratory & ENT Care", diag: "Chronic Laryngitis & Vocal Strain", tab: "Tab Levocetirizine 5mg + Yashtimadhu Churna", limit: 7, days: 5 },
  { category: "Respiratory & ENT Care", diag: "Acute Frontal Sinusitis & Headache", tab: "Tab Sinarest + Anu Thailam Nasya Drops", limit: 7, days: 6 },
  { category: "Respiratory & ENT Care", diag: "Bronchial Asthma & Wheezing Bouts", tab: "Inhaler Foracort 200 + Vasavaleha 10g", limit: 14, days: 10 },
  { category: "Respiratory & ENT Care", diag: "Tonsillar Congestion & Pharyngitis", tab: "Tab Augmentin 625mg + Sitopaladi Churna", limit: 7, days: 5 },

  // Diabetes & Metabolic
  { category: "Diabetes & Metabolic", diag: "Type 2 Diabetes Mellitus", tab: "Tab Metformin 500mg SR + Nisamalaki Churna 3g", limit: 15, days: 12 },
  { category: "Diabetes & Metabolic", diag: "Subclinical Hypothyroidism & Fatigue", tab: "Tab Thyronorm 25mcg + Kanchanara Guggulu", limit: 20, days: 16 },
  { category: "Diabetes & Metabolic", diag: "Hyperuricemia & Gouty Arthritis", tab: "Tab Febuxostat 40mg + Kaishore Guggulu", limit: 10, days: 8 },
  { category: "Diabetes & Metabolic", diag: "Obesity & Metabolic Dysregulation", tab: "Tab Orlistat 60mg + Triphala Guggulu 500mg", limit: 20, days: 15 },
  { category: "Diabetes & Metabolic", diag: "Insulin Resistance & Fasting Hyperglycemia", tab: "Tab Teneligliptin 20mg + Chandraprabha Vati", limit: 14, days: 11 },

  // Ayush & Gastro Care
  { category: "Ayush & Gastro Care", diag: "Pitta-Vata Dyspepsia (Amlapitta)", tab: "Tab Pantocid 40mg + Avipattikar Churna 5g", limit: 10, days: 6 },
  { category: "Ayush & Gastro Care", diag: "Irritable Bowel Syndrome (Grahani Roga)", tab: "Tab Mebeverine 135mg + Kutajarishta 15ml", limit: 14, days: 11 },
  { category: "Ayush & Gastro Care", diag: "Grade-1 Fatty Liver (Yakrit Roga)", tab: "Tab Udiliv 300mg + Liv-52 DS + Arogyavardhini", limit: 15, days: 12 },
  { category: "Ayush & Gastro Care", diag: "Duodenal Peptic Ulcer & Gastritis", tab: "Tab Sucralfate Susp + Shankha Bhasma", limit: 10, days: 8 },
  { category: "Ayush & Gastro Care", diag: "Chronic Constipation & Hemorrhoids", tab: "Tab Cremaffin + Abhayarishta 20ml", limit: 10, days: 7 },

  // Dermatology & Neurology
  { category: "Ayush & Gastro Care", diag: "Allergic Contact Dermatitis", tab: "Tab Allegra 120mg + Mahamarichadi Thailam", limit: 10, days: 8 },
  { category: "Ayush & Gastro Care", diag: "Tension Headache & Insomnia", tab: "Tab Zapiz 0.25mg + Manasamitra Vatakam", limit: 10, days: 7 },
  { category: "Diabetes & Metabolic", diag: "Benign Prostatic Hyperplasia & Dysuria", tab: "Tab Tamsulosin 0.4mg + Gokshuradi Guggulu", limit: 15, days: 12 },
  { category: "Diabetes & Metabolic", diag: "Nephrolithiasis & Renal Colic", tab: "Tab Cystone Forte + Neeri KFT + Varunadi Kwath", limit: 12, days: 9 }
];

// Helper to find hospital index from ALL_380_TN_HOSPITALS
const findHospitalIndex = (hospitalName) => {
  const idx = ALL_380_TN_HOSPITALS.findIndex(h => h.name.toLowerCase() === hospitalName.toLowerCase());
  if (idx !== -1) return idx;
  let hash = 0;
  for (let i = 0; i < hospitalName.length; i++) hash = (hash << 5) - hash + hospitalName.charCodeAt(i);
  return Math.abs(hash) % 380;
};

// GENERATE 100% UNIQUE 10-MEMBER ROSTER FOR ANY HOSPITAL (0 OVERLAPS ACROSS ALL 380 HOSPITALS)
export const getHospitalRoster = (hospitalName, districtName = "Chennai") => {
  const hIdx = findHospitalIndex(hospitalName);

  // 1. UNIQUE DOCTOR 1 & DOCTOR 2 (760 Unique Doctors across 380 Hospitals)
  const dIdx1 = hIdx * 2;
  const dIdx2 = hIdx * 2 + 1;

  const doc1NameBase = SOUTH_INDIAN_NAME_BASES[dIdx1 % SOUTH_INDIAN_NAME_BASES.length];
  const doc2NameBase = SOUTH_INDIAN_NAME_BASES[dIdx2 % SOUTH_INDIAN_NAME_BASES.length];

  const doc1 = {
    id: `DOC-${1001 + dIdx1}`,
    name: `Dr. ${doc1NameBase} ${String.fromCharCode(65 + (dIdx1 % 26))}.`,
    qualification: QUALIFICATIONS[dIdx1 % QUALIFICATIONS.length],
    spec: SPECIALTIES[dIdx1 % SPECIALTIES.length],
    role: "Senior Consultant Doctor",
    curedCount: 18 + (dIdx1 % 10),
    totalCount: 20 + (dIdx1 % 10),
    cureRate: Math.round(((18 + (dIdx1 % 10)) / (20 + (dIdx1 % 10))) * 100),
    promoted: (dIdx1 % 3 === 0)
  };

  const doc2 = {
    id: `DOC-${1001 + dIdx2}`,
    name: `Dr. ${doc2NameBase} ${String.fromCharCode(65 + (dIdx2 % 26))}.`,
    qualification: QUALIFICATIONS[dIdx2 % QUALIFICATIONS.length],
    spec: SPECIALTIES[dIdx2 % SPECIALTIES.length],
    role: "Associate Specialist Doctor",
    curedCount: 14 + (dIdx2 % 8),
    totalCount: 16 + (dIdx2 % 8),
    cureRate: Math.round(((14 + (dIdx2 % 8)) / (16 + (dIdx2 % 8))) * 100),
    promoted: false
  };

  // 2. UNIQUE NURSE (380 Unique Nurses)
  const nIdx = hIdx;
  const nurseNameBase = SOUTH_INDIAN_NAME_BASES[(nIdx + 15) % SOUTH_INDIAN_NAME_BASES.length];
  const nurse = {
    id: `NRS-${1001 + nIdx}`,
    name: `Nurse ${nurseNameBase} ${String.fromCharCode(65 + (nIdx % 26))}.`,
    rank: nIdx % 2 === 0 ? "Senior Staff Nurse" : "Charge Nurse",
    shift: nIdx % 2 === 0 ? "Morning (08:00 - 16:00)" : "Evening (16:00 - 00:00)",
    dept: nIdx % 2 === 0 ? "Emergency Triage" : "OPD Ward Care",
    vitalsLoggedToday: 22 + (nIdx % 18)
  };

  // 3. UNIQUE RECEPTIONIST (380 Unique Receptionists)
  const rIdx = hIdx;
  const recepNameBase = SOUTH_INDIAN_NAME_BASES[(rIdx + 35) % SOUTH_INDIAN_NAME_BASES.length];
  const receptionist = {
    id: `REC-${1001 + rIdx}`,
    name: `Desk Officer ${recepNameBase} ${String.fromCharCode(65 + (rIdx % 26))}.`,
    desk: `Counter Desk #${(rIdx % 3) + 1}`,
    speed: `${(3.0 + (rIdx % 10) * 0.1).toFixed(1)} min/patient`,
    status: "Active",
    tokensIssuedToday: 45 + (rIdx % 35)
  };

  // 4. UNIQUE 6 PATIENTS (2,280 Unique Patients across 380 Hospitals)
  const patients = [];
  for (let pSlot = 0; pSlot < 6; pSlot++) {
    const pIdx = hIdx * 6 + pSlot;
    const patNameBase = SOUTH_INDIAN_NAME_BASES[(pIdx + 50) % SOUTH_INDIAN_NAME_BASES.length];
    const diseaseTemplate = DISEASE_CATEGORIES[pIdx % DISEASE_CATEGORIES.length];

    patients.push({
      id: `PAT-${1001 + pIdx}`,
      token: `OPD-${1001 + pIdx}`,
      name: `${patNameBase.toUpperCase()} ${String.fromCharCode(65 + (pIdx % 26))}.`,
      age: `${28 + (pIdx % 50)}`,
      gender: pIdx % 2 === 0 ? "Male" : "Female",
      phone: `9840${String(100000 + pIdx).padStart(6, '0')}`,
      category: pIdx % 5 === 0 ? "IAS / Public Dignitary" : (pIdx % 3 === 0 ? "Popular Creator / Influencer" : "South Indian Public Resident"),
      diseaseCategory: diseaseTemplate.category,
      chiefComplaint: `Clinical symptom presentation #${(pIdx % 9) + 1} requiring consultation`,
      diagnosis: diseaseTemplate.diag,
      tablets: diseaseTemplate.tab,
      prescribedDays: diseaseTemplate.limit,
      recoveryDays: diseaseTemplate.days,
      recoveryStatus: `Cured & Resolved (Day ${diseaseTemplate.days})`,
      cured: true,
      hospital: hospitalName,
      district: districtName,
      assignedDoctor: pSlot % 2 === 0 ? doc1.name : doc2.name
    });
  }

  // Calculate Disease Breakdown
  const diseaseBreakdown = [
    { category: "Heart & Cardiac Care", total: 0, cured: 0 },
    { category: "Orthopedic & Joint Care", total: 0, cured: 0 },
    { category: "Respiratory & ENT Care", total: 0, cured: 0 },
    { category: "Diabetes & Metabolic", total: 0, cured: 0 },
    { category: "Ayush & Gastro Care", total: 0, cured: 0 }
  ];

  patients.forEach(p => {
    const cat = diseaseBreakdown.find(d => d.category === p.diseaseCategory);
    if (cat) {
      cat.total += 1;
      if (p.cured) cat.cured += 1;
    }
  });

  const totalPatients = patients.length;
  const curedPatients = patients.filter(p => p.cured).length;
  const hospitalCureRate = Math.round((curedPatients / totalPatients) * 100);

  return {
    hospitalName,
    districtName,
    doctors: [doc1, doc2],
    nurse: nurse,
    receptionist: receptionist,
    patients: patients,
    diseaseBreakdown: diseaseBreakdown,
    summary: {
      totalMembers: 10,
      totalDoctors: 2,
      totalNurses: 1,
      totalReceptionists: 1,
      totalPatients: 6,
      curedPatients: curedPatients,
      activeTreatment: totalPatients - curedPatients,
      hospitalCureRate: hospitalCureRate,
      totalNetworkMembers: 3801
    }
  };
};

// GENERATE ALL 2,280 UNIQUE NETWORK PATIENTS ACROSS ALL 380 HOSPITALS
export const getAllNetworkPatients = () => {
  const allPatients = [];
  ALL_380_TN_HOSPITALS.forEach((h, hIdx) => {
    for (let pSlot = 0; pSlot < 6; pSlot++) {
      const pIdx = hIdx * 6 + pSlot;
      const patNameBase = SOUTH_INDIAN_NAME_BASES[(pIdx + 50) % SOUTH_INDIAN_NAME_BASES.length];
      const diseaseTemplate = DISEASE_CATEGORIES[pIdx % DISEASE_CATEGORIES.length];

      const doc1NameBase = SOUTH_INDIAN_NAME_BASES[(hIdx * 2) % SOUTH_INDIAN_NAME_BASES.length];
      const doc2NameBase = SOUTH_INDIAN_NAME_BASES[(hIdx * 2 + 1) % SOUTH_INDIAN_NAME_BASES.length];

      allPatients.push({
        id: `PAT-${1001 + pIdx}`,
        token: `OPD-${1001 + pIdx}`,
        name: `${patNameBase.toUpperCase()} ${String.fromCharCode(65 + (pIdx % 26))}.`,
        age: `${28 + (pIdx % 50)}`,
        gender: pIdx % 2 === 0 ? "Male" : "Female",
        phone: `9840${String(100000 + pIdx).padStart(6, '0')}`,
        category: pIdx % 5 === 0 ? "IAS / Public Dignitary" : (pIdx % 3 === 0 ? "Popular Creator / Influencer" : "South Indian Public Resident"),
        diseaseCategory: diseaseTemplate.category,
        chiefComplaint: `Clinical symptom presentation #${(pIdx % 9) + 1} requiring consultation`,
        diagnosis: diseaseTemplate.diag,
        tablets: diseaseTemplate.tab,
        prescribedDays: diseaseTemplate.limit,
        recoveryDays: diseaseTemplate.days,
        recoveryStatus: `Cured & Resolved (Day ${diseaseTemplate.days})`,
        cured: true,
        hospital: h.name,
        district: h.district,
        assignedDoctor: pSlot % 2 === 0 ? `Dr. ${doc1NameBase}` : `Dr. ${doc2NameBase}`,
        time: `${String(8 + (pIdx % 8)).padStart(2, '0')}:${String((pIdx * 7) % 60).padStart(2, '0')} AM`,
        status: pIdx % 4 === 0 ? "Completed" : (pIdx % 3 === 0 ? "In Queue" : "Registered Offline")
      });
    }
  });
  return allPatients;
};
