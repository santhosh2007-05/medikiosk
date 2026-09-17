const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'sample-reports');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 15 Comprehensive Clinical Reports Definition
const reports = [
  {
    id: "CBC_Hematology_Lab_Report",
    title: "COMPLETE BLOOD COUNT (CBC) & HEMATOLOGY",
    category: "Hematology & Blood",
    patient: "JOSEPH VIJAY (Age 36, Male, ABHA: 91-7829-4412)",
    hospital: "Rajiv Gandhi Government General Hospital, Chennai",
    date: "2026-09-15",
    doctor: "Dr. V. S. Ramachandran, MD (Medicine)",
    rows: [
      ["Hemoglobin (Hb)", "11.2", "g/dL", "13.0 - 17.5", "LOW (Mild Microcytic Anemia)"],
      ["Total WBC Count", "11,400", "/uL", "4,000 - 11,000", "HIGH (Mild Leukocytosis)"],
      ["Platelet Count", "245,000", "/uL", "150,000 - 450,000", "NORMAL"],
      ["RBC Count", "3.90", "mil/uL", "4.5 - 5.9", "LOW"],
      ["Packed Cell Volume (PCV)", "34.5", "%", "40.0 - 50.0", "LOW"],
      ["MCV", "78.2", "fL", "80.0 - 96.0", "LOW (Microcytosis)"],
      ["MCH", "25.1", "pg", "27.0 - 33.0", "LOW"],
      ["Neutrophils", "74", "%", "40 - 70", "HIGH"],
      ["Lymphocytes", "20", "%", "20 - 40", "NORMAL"],
      ["Eosinophils", "4", "%", "1 - 6", "NORMAL"]
    ],
    diagnosis: "Microcytic Hypochromic Anemia with Reactive Leukocytosis",
    rx: "Tab Autrin (Ferrous Fumarate + Folic Acid) 1 tab OD after meals x 30 days + Punarnavadi Kwath 15ml BD"
  },
  {
    id: "Comprehensive_Metabolic_Panel",
    title: "COMPREHENSIVE METABOLIC & ELECTROLYTE PANEL",
    category: "Biochemistry",
    patient: "SUPRIYA SAHU (Age 42, Female, ABHA: 91-8841-3091)",
    hospital: "Government Multi Super Speciality Hospital, Omandurar",
    date: "2026-09-16",
    doctor: "Dr. K. Arumugam, MD (Biochemistry)",
    rows: [
      ["Fasting Blood Glucose", "128", "mg/dL", "70 - 99", "HIGH (Impaired Fasting Glucose)"],
      ["Blood Urea Nitrogen (BUN)", "18.5", "mg/dL", "7.0 - 20.0", "NORMAL"],
      ["Serum Creatinine", "0.95", "mg/dL", "0.60 - 1.20", "NORMAL"],
      ["eGFR (CKD-EPI)", "88", "mL/min", "> 60", "NORMAL"],
      ["Serum Sodium (Na+)", "141", "mEq/L", "136 - 145", "NORMAL"],
      ["Serum Potassium (K+)", "4.3", "mEq/L", "3.5 - 5.1", "NORMAL"],
      ["Serum Chloride (Cl-)", "102", "mEq/L", "98 - 107", "NORMAL"],
      ["Serum Calcium", "9.4", "mg/dL", "8.5 - 10.2", "NORMAL"]
    ],
    diagnosis: "Early Pre-Diabetes Mellitus (Dysglycemia)",
    rx: "Tab Metformin 500mg OD with dinner + Nishamalaki Churna 3g BD with warm water"
  },
  {
    id: "Lipid_Profile_Cholesterol_Report",
    title: "COMPREHENSIVE LIPID PROFILE & CARDIO-RISK",
    category: "Cardiology & Lipids",
    patient: "RAJINIKANTH M. (Age 54, Male, ABHA: 91-6629-1928)",
    hospital: "Government Stanley Medical College Hospital, Chennai",
    date: "2026-09-14",
    doctor: "Dr. S. Meenakshi, DM (Cardiology)",
    rows: [
      ["Total Cholesterol", "248", "mg/dL", "< 200", "HIGH (Hypercholesterolemia)"],
      ["Triglycerides", "215", "mg/dL", "< 150", "HIGH (Hypertriglyceridemia)"],
      ["HDL Cholesterol (Good)", "36", "mg/dL", "> 40", "LOW (Cardio-Risk Flag)"],
      ["LDL Cholesterol (Bad)", "169", "mg/dL", "< 100", "HIGH (Atherogenic Risk)"],
      ["VLDL Cholesterol", "43", "mg/dL", "5 - 30", "HIGH"],
      ["Total Chol / HDL Ratio", "6.88", "Ratio", "< 4.5", "ELEVATED RISK"]
    ],
    diagnosis: "Mixed Atherogenic Dyslipidemia (Fredrickson Type IIb)",
    rx: "Tab Rosuvastatin 10mg OD HS + Tab Fenofibrate 145mg OD + Guggulutiktam Kwatham 15ml BD"
  },
  {
    id: "Fasting_HbA1c_Diabetic_Report",
    title: "GLYCATED HEMOGLOBIN (HbA1c) DIABETIC PROFILE",
    category: "Diabetology",
    patient: "KAMAL HAASAN R. (Age 49, Male, ABHA: 91-5519-8821)",
    hospital: "Government Kilpauk Medical College Hospital, Chennai",
    date: "2026-09-15",
    doctor: "Dr. P. Sundaram, MD (Endocrinology)",
    rows: [
      ["HbA1c (Glycated Hemoglobin)", "8.6", "%", "< 5.7", "HIGH (Uncontrolled Diabetes)"],
      ["Estimated Average Glucose (eAG)", "200", "mg/dL", "< 117", "HIGH"],
      ["Fasting Plasma Glucose", "168", "mg/dL", "70 - 100", "HIGH"],
      ["Post-Prandial Plasma Glucose", "244", "mg/dL", "< 140", "HIGH"],
      ["Urine Microalbumin", "42.0", "mg/L", "< 20.0", "HIGH (Early Diabetic Nephropathy)"]
    ],
    diagnosis: "Type 2 Diabetes Mellitus with Sub-Optimal Glycemic Control",
    rx: "Tab Metformin 1000mg + Glimepiride 2mg BD before meals + Jambuasava 20ml BD"
  },
  {
    id: "Thyroid_Profile_TFT_Report",
    title: "THYROID FUNCTION TEST (TFT) PROFILE",
    category: "Endocrinology",
    patient: "TRISHA KRISHNAN (Age 32, Female, ABHA: 91-4412-9901)",
    hospital: "Government Royapettah Hospital, Chennai",
    date: "2026-09-12",
    doctor: "Dr. R. Kavitha, MD, DNB (Endocrine)",
    rows: [
      ["TSH - Thyroid Stimulating Hormone", "9.45", "uIU/mL", "0.35 - 4.94", "HIGH (Primary Hypothyroidism)"],
      ["Free T3 (Triiodothyronine)", "2.10", "pg/mL", "2.30 - 4.20", "LOW"],
      ["Free T4 (Thyroxine)", "0.68", "ng/dL", "0.89 - 1.76", "LOW"],
      ["Anti-TPO Antibodies", "142", "IU/mL", "< 34", "HIGH (Hashimoto Thyroiditis)"]
    ],
    diagnosis: "Primary Autoimmune Hypothyroidism (Hashimoto Disease)",
    rx: "Tab Thyronorm (Levothyroxine) 75mcg OD morning empty stomach + Kanchnar Guggulu 2 tabs BD"
  },
  {
    id: "Liver_Function_Test_LFT",
    title: "LIVER FUNCTION TEST (LFT) & ENZYME ASSAY",
    category: "Gastroenterology & Liver",
    patient: "DHANUSH K. (Age 38, Male, ABHA: 91-3310-7712)",
    hospital: "Madurai Government Rajaji Hospital, Madurai",
    date: "2026-09-13",
    doctor: "Dr. M. Senthil Nathan, DM (Hepatology)",
    rows: [
      ["Serum Total Bilirubin", "2.4", "mg/dL", "0.2 - 1.2", "HIGH (Hepatic Jaundice)"],
      ["Direct Bilirubin (Conjugated)", "1.6", "mg/dL", "0.0 - 0.3", "HIGH"],
      ["Indirect Bilirubin", "0.8", "mg/dL", "0.2 - 0.9", "NORMAL"],
      ["SGOT / AST", "88", "U/L", "10 - 40", "HIGH (Hepatocellular Injury)"],
      ["SGPT / ALT", "112", "U/L", "7 - 56", "HIGH (Marked Transaminitis)"],
      ["Alkaline Phosphatase (ALP)", "195", "U/L", "44 - 147", "HIGH"],
      ["Serum Total Protein", "6.8", "g/dL", "6.4 - 8.3", "NORMAL"],
      ["Serum Albumin", "3.8", "g/dL", "3.5 - 5.0", "NORMAL"]
    ],
    diagnosis: "Acute Transaminitis & Grade-1 Fatty Liver Disease (NASH)",
    rx: "Tab Udiliv 300mg BD + Tab Liv-52 DS 1 tab BD + Arogyavardhini Vati 2 tabs BD"
  },
  {
    id: "Renal_Kidney_Function_KFT",
    title: "RENAL FUNCTION TEST (KFT) & NEPHRO-PANEL",
    category: "Nephrology & Renal",
    patient: "AJITH KUMAR P. (Age 52, Male, ABHA: 91-2291-5503)",
    hospital: "Coimbatore Government Medical College Hospital",
    date: "2026-09-11",
    doctor: "Dr. K. Balasubramanian, DM (Nephrology)",
    rows: [
      ["Serum Creatinine", "1.78", "mg/dL", "0.70 - 1.30", "HIGH (Renal Impairment)"],
      ["Serum Urea", "54.0", "mg/dL", "15.0 - 45.0", "HIGH (Azotemia)"],
      ["Uric Acid", "8.2", "mg/dL", "3.5 - 7.2", "HIGH (Hyperuricemia)"],
      ["eGFR (CKD-EPI 2021)", "44", "mL/min/1.73m2", "> 90", "LOW (Stage 3a CKD)"],
      ["Serum Sodium", "138", "mEq/L", "135 - 145", "NORMAL"],
      ["Serum Potassium", "4.8", "mEq/L", "3.5 - 5.0", "NORMAL"]
    ],
    diagnosis: "Stage 3a Chronic Kidney Disease with Hyperuricemia",
    rx: "Tab Febuxostat 40mg OD + Tab Torsemide 10mg OD + Punarnavadi Kashayam 15ml BD"
  },
  {
    id: "Routine_Urine_Analysis",
    title: "URINE ROUTINE & MICROSCOPIC EXAMINATION",
    category: "Urology & Pathology",
    patient: "NAYANTHARA V. (Age 39, Female, ABHA: 91-1188-4429)",
    hospital: "Tirunelveli Government Medical College Hospital",
    date: "2026-09-14",
    doctor: "Dr. A. Jayashree, MD (Pathology)",
    rows: [
      ["Urine Color & Appearance", "Pale Yellow, Hazy", "", "Clear Straw", "HAZY"],
      ["Specific Gravity", "1.025", "", "1.005 - 1.030", "NORMAL"],
      ["pH", "6.0", "", "4.5 - 8.0", "NORMAL"],
      ["Protein / Albumin", "1+ (30 mg/dL)", "", "Nil", "POSITIVE"],
      ["Urine Glucose", "Nil", "", "Nil", "NORMAL"],
      ["Pus Cells (WBC)", "18 - 22", "/HPF", "0 - 5", "HIGH (Active Pyuria / UTI)"],
      ["RBCs", "2 - 4", "/HPF", "0 - 2", "MILD HEMATURIA"],
      ["Epithelial Cells", "6 - 8", "/HPF", "2 - 5", "MODERATE"],
      ["Bacteria", "Present (Moderate)", "", "Absent", "BACTERIURIA DETECTED"]
    ],
    diagnosis: "Acute Uncomplicated Urinary Tract Infection (Bacterial Cystitis)",
    rx: "Tab Nitrofurantoin 100mg BD x 7 days + Syp Citralka 2 tsp in glass water TDS + Gokshuradi Guggulu 2 tabs BD"
  },
  {
    id: "Cardiac_Troponin_ECG_Panel",
    title: "CARDIAC BIOMARKERS & TROPONIN-I PANEL",
    category: "Cardiology & Emergency",
    patient: "SURIYA S. (Age 45, Male, ABHA: 91-9988-1122)",
    hospital: "Salem Government Mohan Kumaramangalam Hospital",
    date: "2026-09-17",
    doctor: "Dr. G. Sivakumar, MD, DM (Cardio)",
    rows: [
      ["High Sensitivity Troponin-I", "0.012", "ng/mL", "< 0.040", "NORMAL (No Acute Myocardial Infarction)"],
      ["CK-MB Isoenzyme", "14.2", "U/L", "< 25.0", "NORMAL"],
      ["NT-proBNP", "88", "pg/mL", "< 125", "NORMAL"],
      ["Blood Pressure (Automated)", "148 / 92", "mmHg", "< 120 / 80", "HIGH (Stage 1 Hypertension)"],
      ["Resting Pulse", "78", "bpm", "60 - 100", "NORMAL REGULAR"]
    ],
    diagnosis: "Atypical Non-Cardiac Chest Pain & Essential Stage 1 Hypertension",
    rx: "Tab Telmisartan 40mg + Amlodipine 5mg OD morning + Sarpagandha Vati 1 tab HS"
  },
  {
    id: "12_Lead_Electrocardiogram",
    title: "12-LEAD ELECTROCARDIOGRAM (ECG) TRACING & INTERPRETATION",
    category: "Cardiology",
    patient: "KARTHI S. (Age 43, Male, ABHA: 91-8877-3344)",
    hospital: "Thanjavur Government Medical College Hospital",
    date: "2026-09-16",
    doctor: "Dr. N. Gopinath, MD (Medicine)",
    rows: [
      ["Rhythm", "Normal Sinus Rhythm", "", "Sinus Rhythm", "NORMAL"],
      ["Heart Rate", "72", "bpm", "60 - 100", "NORMAL"],
      ["PR Interval", "154", "ms", "120 - 200", "NORMAL"],
      ["QRS Duration", "88", "ms", "80 - 120", "NORMAL"],
      ["QT / QTc Interval", "390 / 425", "ms", "< 450", "NORMAL"],
      ["ST-T Wave Changes", "Non-specific T wave flattening in V5-V6", "", "Normal ST-T", "MILD ISCHEMIA EXCLUDED"]
    ],
    diagnosis: "Normal Sinus Rhythm with Non-Specific Repolarization Variants",
    rx: "Tab Metoprolol Succinate 25mg OD + Arjuna Tea (Terminalia arjuna bark) 1 cup daily"
  },
  {
    id: "Chest_XRay_Radiology_Summary",
    title: "CHEST X-RAY (POSTERO-ANTERIOR VIEW) RADIOLOGY REPORT",
    category: "Radiology & Pulmonology",
    patient: "SIVAKARTHIKEYAN G. (Age 37, Male, ABHA: 91-7766-5544)",
    hospital: "Tiruchirappalli Government Annal Gandhi Memorial Hospital",
    date: "2026-09-15",
    doctor: "Dr. D. Chandrasekar, MD (Radiodiagnosis)",
    rows: [
      ["Lung Parenchyma", "Clear, No consolidation or cavitary lesion", "", "Clear", "NORMAL"],
      ["Bronchovascular Markings", "Prominent peri-bronchial cuffing", "", "Normal", "MILD BRONCHITIS"],
      ["Cardiothoracic Ratio (CTR)", "0.46 (Normal heart size)", "", "< 0.50", "NORMAL"],
      ["Costophrenic Angles", "Sharp and clear bilaterally", "", "Sharp", "NO EFFUSION"],
      ["Hemidiaphragms", "Smooth contours, normal dome elevation", "", "Smooth", "NORMAL"],
      ["Trachea & Mediastinum", "Central, no shift or widening", "", "Central", "NORMAL"]
    ],
    diagnosis: "Acute Bronchitic Hyper-responsiveness (Non-Pneumonic)",
    rx: "Levosalbutamol + Ipratropium Respules via Nebulizer TDS x 3 days + Tab Montair-LC OD HS + Talisadi Churna 3g TDS"
  },
  {
    id: "Ultrasound_Abdomen_Sonography",
    title: "ULTRASOUND WHOLE ABDOMEN & PELVIS (USG)",
    category: "Radiology & Ultrasound",
    patient: "VIJAY SETHUPATHI M. (Age 46, Male, ABHA: 91-6655-4433)",
    hospital: "Vellore Government Medical College Hospital",
    date: "2026-09-14",
    doctor: "Dr. S. Preethi, MD (Radiology)",
    rows: [
      ["Liver", "Enlarged (16.2 cm), diffuse increase in echogenicity", "", "Normal < 15 cm", "GRADE 1 FATTY LIVER"],
      ["Gallbladder", "Normal wall thickness, no calculus or sludge", "", "Acalculous", "NORMAL"],
      ["Common Bile Duct (CBD)", "4.1 mm diameter", "", "< 6.0 mm", "NORMAL"],
      ["Pancreas", "Normal size and echo-architecture", "", "Normal", "NORMAL"],
      ["Spleen", "Normal size (9.8 cm), homogeneous", "", "< 12 cm", "NORMAL"],
      ["Right & Left Kidneys", "Right 10.4 cm, Left 10.8 cm, Corticomedullary differentiation preserved", "", "Normal", "NORMAL"],
      ["Urinary Bladder", "Well distended, normal lumen", "", "Normal", "NORMAL"]
    ],
    diagnosis: "Hepatomegaly with Grade-1 Diffuse Hepatic Steatosis (Fatty Liver)",
    rx: "Tab Udiliv 300mg BD + Tab Saroglitazar 4mg OD + Bhumyamalaki Churna 3g BD"
  },
  {
    id: "Vitamin_D3_B12_Deficiency_Assay",
    title: "VITAMIN D3 (25-OH) & VITAMIN B12 ASSAY",
    category: "Biochemistry & Nutrition",
    patient: "SAMANTHA RUTH (Age 35, Female, ABHA: 91-5544-3322)",
    hospital: "Kanyakumari Government Medical College Hospital",
    date: "2026-09-13",
    doctor: "Dr. M. Sangeetha, MD (Biochemistry)",
    rows: [
      ["25-Hydroxy Vitamin D3", "12.4", "ng/mL", "30.0 - 100.0", "DEFICIENT (< 20 ng/mL)"],
      ["Serum Vitamin B12 (Cobalamin)", "165", "pg/mL", "211 - 911", "LOW (< 200 pg/mL)"],
      ["Serum Folate", "8.9", "ng/mL", "> 4.0", "NORMAL"],
      ["Serum Ferritin", "24.5", "ng/mL", "13 - 150", "LOW-NORMAL"]
    ],
    diagnosis: "Severe Hypovitaminosis D3 with Symptomatic Cobalamin Deficiency",
    rx: "Cap Calcirol (Cholecalciferol 60,000 IU) 1 cap weekly x 8 weeks + Tab Neurobion Forte OD x 30 days"
  },
  {
    id: "Arterial_Blood_Gas_ABG_Report",
    title: "ARTERIAL BLOOD GAS (ABG) & RESPIRATORY STATUS",
    category: "Critical Care & Pulmonology",
    patient: "GAGANDEEP SINGH BEDI (Age 56, Male, ABHA: 91-4433-2211)",
    hospital: "Erode Government Headquarters Hospital",
    date: "2026-09-15",
    doctor: "Dr. P. Venkatesh, MD, FNB (Critical Care)",
    rows: [
      ["pH", "7.39", "", "7.35 - 7.45", "NORMAL"],
      ["pCO2 (Partial Pressure CO2)", "38.5", "mmHg", "35.0 - 45.0", "NORMAL"],
      ["pO2 (Partial Pressure O2)", "92.0", "mmHg", "80.0 - 100.0", "NORMAL"],
      ["HCO3 (Bicarbonate)", "23.8", "mEq/L", "22.0 - 26.0", "NORMAL"],
      ["Base Excess (BE)", "-0.4", "mEq/L", "-2.0 to +2.0", "NORMAL"],
      ["Oxygen Saturation (SaO2)", "97.5", "%", "> 95.0 %", "NORMAL"],
      ["Blood Lactate", "1.1", "mmol/L", "0.5 - 2.0", "NORMAL"]
    ],
    diagnosis: "Normal Acid-Base Homeostasis & Stable Arterial Oxygenation",
    rx: "Breathing Exercises (Pranayama - Anulom Vilom) 15 mins BD + Syp Vasaka 10ml BD"
  },
  {
    id: "Integrative_AYUSH_Discharge_Summary",
    title: "AYUSH & ALLOPATHIC INTEGRATIVE CLINICAL DISCHARGE SUMMARY",
    category: "AYUSH Integrative Medicine",
    patient: "SUPRIYA SAHU IAS (Age 48, Female, ABHA: 91-3322-1100)",
    hospital: "Government Ayurveda & Siddha Medical College Hospital, Chennai",
    date: "2026-09-16",
    doctor: "Dr. B. Vaidyanathan, MD (Ayurveda) & Dr. R. Sathish, MBBS",
    rows: [
      ["Ayush Prakriti Evaluation", "Pitta-Vata Predominant with Mandagni", "", "Tridosha Equilibrium", "VATA-PITTA DYSREGULATION"],
      ["Chief Presentation", "Chronic Cervical Spondylosis with Pain Score 7/10", "", "Pain Score 0/10", "MARKED IMPROVEMENT (Score 2/10)"],
      ["Nadi Pariksha", "Vata-Kaphaja Sthanika Vriddhi", "", "Sama Nadi", "MILD VATA REMAINING"],
      ["Greeva Basti Therapy", "7 Days Medicated Taila Retention", "", "Completed Protocol", "SUCCESSFULLY COMPLETED"],
      ["Cervical Spine ROM", "Flexion 45 deg, Extension 40 deg, Rotation Full", "", "Normal Range", "RESOLVED STIFFNESS"]
    ],
    diagnosis: "Cervical Spondylosis (Manyastambha) - Post-Integrative Discharge",
    rx: "Tab Yogaraj Guggulu 2 tabs BD with warm water + Dhanwantharam Mezhukupakam 1 cap BD + Mahamasha Tailam local application"
  }
];

function generateReportSvg(rep) {
  const tableRows = rep.rows.map((r, idx) => {
    const y = 300 + idx * 30;
    const isAbnormal = r[4].includes('HIGH') || r[4].includes('LOW') || r[4].includes('POSITIVE') || r[4].includes('DEFICIENT');
    const color = isAbnormal ? '#dc2626' : '#166534';
    const tagBg = isAbnormal ? '#fee2e2' : '#dcfce7';
    return `
      <g transform="translate(0, ${y})">
        <rect x="30" y="-18" width="740" height="26" fill="${idx % 2 === 0 ? '#f8fafc' : '#ffffff'}" />
        <text x="40" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#1e293b">${r[0]}</text>
        <text x="280" y="0" font-family="Courier, monospace" font-size="12" font-weight="bold" fill="${color}">${r[1]}</text>
        <text x="370" y="0" font-family="Arial, sans-serif" font-size="11" fill="#64748b">${r[2]}</text>
        <text x="460" y="0" font-family="Arial, sans-serif" font-size="11" fill="#475569">${r[3]}</text>
        <rect x="580" y="-14" width="180" height="18" rx="4" fill="${tagBg}" />
        <text x="590" y="0" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="${color}">${r[4]}</text>
      </g>
    `;
  }).join('');

  const svgHeight = 400 + rep.rows.length * 30 + 180;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${svgHeight}" width="800" height="${svgHeight}">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect x="10" y="10" width="780" height="${svgHeight - 20}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#cardShadow)"/>
  <rect x="10" y="10" width="780" height="90" rx="12" fill="url(#headerGrad)"/>
  <rect x="10" y="80" width="780" height="20" fill="url(#headerGrad)"/>
  
  <text x="35" y="45" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#ffffff" letter-spacing="1">GOVERNMENT OF TAMIL NADU • HEALTH SYSTEM</text>
  <text x="35" y="70" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#a7f3d0">${rep.hospital.toUpperCase()}</text>
  <text x="640" y="45" font-family="Courier, monospace" font-size="11" font-weight="bold" fill="#ffffff">NABL ACCREDITED</text>
  <text x="640" y="65" font-family="Courier, monospace" font-size="10" fill="#d1fae5">ABDM CLOUD EHR</text>

  <rect x="30" y="115" width="740" height="40" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
  <text x="45" y="140" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">${rep.title}</text>
  <text x="600" y="140" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#059669">DATE: ${rep.date}</text>

  <g transform="translate(30, 175)">
    <rect x="0" y="0" width="740" height="65" rx="8" fill="#fafafa" stroke="#e5e7eb"/>
    <text x="15" y="24" font-family="Arial, sans-serif" font-size="11" fill="#64748b">PATIENT NAME &amp; ABHA ID:</text>
    <text x="190" y="24" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">${rep.patient}</text>

    <text x="15" y="48" font-family="Arial, sans-serif" font-size="11" fill="#64748b">CONSULTING PHYSICIAN:</text>
    <text x="190" y="48" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#047857">${rep.doctor}</text>
  </g>

  <g transform="translate(0, 265)">
    <rect x="30" y="-18" width="740" height="28" fill="#0f172a" rx="4"/>
    <text x="40" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">TEST / PARAMETER</text>
    <text x="280" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">RESULT</text>
    <text x="370" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">UNITS</text>
    <text x="460" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">REFERENCE RANGE</text>
    <text x="590" y="0" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">CLINICAL FLAG</text>
  </g>

  ${tableRows}

  <g transform="translate(30, ${svgHeight - 140})">
    <rect x="0" y="0" width="740" height="100" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="15" y="25" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">CLINICAL IMPRESSION / DIAGNOSIS:</text>
    <text x="240" y="25" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#b91c1c">${rep.diagnosis}</text>

    <text x="15" y="55" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a">RECOMMENDED MEDICATION / AYUSH RX:</text>
    <text x="15" y="75" font-family="Arial, sans-serif" font-size="10" font-family="Courier, monospace" fill="#334155">${rep.rx}</text>
  </g>
</svg>`;
}

function generateReportPdf(rep) {
  const contentLines = [
    `%PDF-1.4`,
    `1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj`,
    `2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj`,
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj`,
    `5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`
  ];

  let streamContent = `BT /F1 14 Tf 50 740 Td (${rep.hospital}) Tj ET\n`;
  streamContent += `BT /F1 12 Tf 50 720 Td (${rep.title}) Tj ET\n`;
  streamContent += `BT /F1 10 Tf 50 700 Td (Patient: ${rep.patient} | Date: ${rep.date}) Tj ET\n`;
  streamContent += `BT /F1 10 Tf 50 685 Td (Doctor: ${rep.doctor}) Tj ET\n`;
  streamContent += `BT /F1 10 Tf 50 665 Td (--------------------------------------------------------------------------------) Tj ET\n`;

  let curY = 645;
  rep.rows.forEach(r => {
    streamContent += `BT /F1 9 Tf 50 ${curY} Td (${r[0]}: ${r[1]} ${r[2]} [Ref: ${r[3]}] -> ${r[4]}) Tj ET\n`;
    curY -= 18;
  });

  curY -= 10;
  streamContent += `BT /F1 10 Tf 50 ${curY} Td (--------------------------------------------------------------------------------) Tj ET\n`;
  curY -= 20;
  streamContent += `BT /F1 10 Tf 50 ${curY} Td (DIAGNOSIS: ${rep.diagnosis}) Tj ET\n`;
  curY -= 20;
  streamContent += `BT /F1 9 Tf 50 ${curY} Td (PRESCRIPTION: ${rep.rx}) Tj ET\n`;

  const streamLength = Buffer.byteLength(streamContent, 'utf8');
  contentLines.push(`4 0 obj << /Length ${streamLength} >> stream\n${streamContent}\nendstream\nendobj`);
  contentLines.push(`xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000280 00000 n \n0000000225 00000 n `);
  contentLines.push(`trailer << /Size 6 /Root 1 0 R >>\nstartxref\n500\n%%EOF`);

  return contentLines.join('\n');
}

reports.forEach((rep, index) => {
  const numStr = String(index + 1).padStart(2, '0');
  const baseName = `${numStr}_${rep.id}`;

  const svgContent = generateReportSvg(rep);
  fs.writeFileSync(path.join(outputDir, `${baseName}.svg`), svgContent, 'utf8');

  const pdfContent = generateReportPdf(rep);
  fs.writeFileSync(path.join(outputDir, `${baseName}.pdf`), pdfContent, 'utf8');
});

console.log(`Generated 15 PDF and 15 SVG reports in ${outputDir}`);
