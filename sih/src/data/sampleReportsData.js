// 15 COMPREHENSIVE SAMPLE CLINICAL MEDICAL REPORTS REPOSITORY
// LOCATION: sih/src/data/sampleReportsData.js & public/sample-reports/

export const SAMPLE_REPORTS_LIST = [
  {
    id: "REP-001",
    title: "Complete Blood Count (CBC) Lab Report",
    fileName: "01_complete_blood_count_cbc_report.txt",
    category: "Lab Report",
    patientName: "JOSEPH VIJAY",
    date: "2026-09-14",
    facility: "Tamil Nadu State Central Diagnostic Laboratory, Chennai",
    rawOcrText: `TAMIL NADU STATE CLINICAL DIAGNOSTICS LABORATORY
CENTRAL PATHOLOGY WING - CHENNAI
PATIENT: JOSEPH VIJAY | AGE: 36 Yrs | GENDER: Male | UHID: TN-CHE-98214
REF BY: Dr. V. S. Ramachandran, MD | SAMPLE DATE: 14-SEP-2026

COMPLETE BLOOD COUNT (CBC) & HEMATOLOGY PANEL:
- Hemoglobin (Hb): 10.8 g/dL          [REF: 13.0 - 17.5 g/dL]  --> LOW / Mild Microcytic Anemia
- Packed Cell Volume (PCV): 34.2 %    [REF: 40.0 - 50.0 %]    --> LOW
- Total RBC Count: 4.12 mill/uL       [REF: 4.50 - 5.90 mill] --> LOW
- Total WBC Count: 11,400 /uL         [REF: 4,000 - 11,000]   --> ELEVATED / Mild Leukocytosis
  • Neutrophils: 72 %                 [REF: 40 - 70 %]        --> ELEVATED
  • Lymphocytes: 22 %                 [REF: 20 - 40 %]        --> NORMAL
  • Monocytes: 4 %                    [REF: 2 - 8 %]          --> NORMAL
  • Eosinophils: 2 %                  [REF: 1 - 6 %]          --> NORMAL
- Platelet Count: 2,45,000 /uL        [REF: 1,50,000 - 4,50,000] --> NORMAL
- Erythrocyte Sedimentation Rate (ESR): 28 mm/hr [REF: 0 - 15 mm/hr] --> ELEVATED

CLINICAL IMPRESSION:
Microcytic hypochromic anemia with mild inflammatory reaction. Recommend oral iron therapy, dietary greens, and AYUSH Lohasava formulation with follow-up in 4 weeks.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Microcytic Hypochromic Anemia with Mild Leukocytosis & Elevated ESR",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Hemoglobin", value: "10.8", unit: "g/dL", isAbnormal: true, refRange: "13.0 - 17.5 g/dL", confidence: 0.99 },
        { name: "Packed Cell Volume (PCV)", value: "34.2", unit: "%", isAbnormal: true, refRange: "40.0 - 50.0 %", confidence: 0.97 },
        { name: "Total RBC Count", value: "4.12", unit: "mill/uL", isAbnormal: true, refRange: "4.50 - 5.90 mill/uL", confidence: 0.98 },
        { name: "Total WBC Count", value: "11400", unit: "/uL", isAbnormal: true, refRange: "4000 - 11000 /uL", confidence: 0.99 },
        { name: "Platelet Count", value: "245000", unit: "/uL", isAbnormal: false, refRange: "150000 - 450000 /uL", confidence: 0.99 },
        { name: "ESR", value: "28", unit: "mm/hr", isAbnormal: true, refRange: "0 - 15 mm/hr", confidence: 0.96 }
      ],
      medicines: [
        { name: "Tab Ferrous Ascorbate + Folic Acid", dose: "100mg", freq: "Once daily after meals" },
        { name: "Lohasava (AYUSH)", dose: "15ml", freq: "Twice daily with equal water" }
      ]
    }
  },
  {
    id: "REP-002",
    title: "Comprehensive Lipid Profile & Cardiovascular Panel",
    fileName: "02_comprehensive_lipid_profile_report.txt",
    category: "Lab Report",
    patientName: "RAJINIKANTH M.",
    date: "2026-09-12",
    facility: "Government Stanley Medical College Hospital, Chennai",
    rawOcrText: `GOVERNMENT STANLEY MEDICAL COLLEGE HOSPITAL - BIOCHEMISTRY LAB
PATIENT: RAJINIKANTH M. | AGE: 73 Yrs | GENDER: Male | IP/OP: STN-9901
SPECIMEN: Fasting Serum (12 hrs fast) | DATE: 12-SEP-2026

LIPID & METABOLIC BIOMARKER PANEL:
- Total Cholesterol: 248 mg/dL       [DESIRABLE: < 200 mg/dL]   --> HIGH
- Triglycerides: 215 mg/dL           [DESIRABLE: < 150 mg/dL]   --> ELEVATED (Borderline High)
- HDL Cholesterol ('Good'): 38 mg/dL  [DESIRABLE: > 40 mg/dL]    --> LOW
- LDL Cholesterol ('Bad'): 167 mg/dL   [OPTIMAL: < 100 mg/dL]     --> HIGH / Atherogenic Risk
- VLDL Cholesterol: 43 mg/dL         [NORMAL: 5 - 30 mg/dL]     --> ELEVATED
- Total Chol / HDL Ratio: 6.52       [DESIRABLE: < 4.5]         --> HIGH CARDIOVASCULAR RISK
- Serum Homocysteine: 16.8 umol/L    [REF: 5 - 15 umol/L]       --> ELEVATED

INTERPRETATION:
Mixed dyslipidemia with elevated atherogenic risk index in elderly patient with hypertension.
Advise: Statin therapy, strict low-lipid dietary regimen, Arjuna bark decoction, and brisk morning walk.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Mixed Dyslipidemia with Atherogenic Cardiovascular Risk",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Total Cholesterol", value: "248", unit: "mg/dL", isAbnormal: true, refRange: "< 200 mg/dL", confidence: 0.99 },
        { name: "Triglycerides", value: "215", unit: "mg/dL", isAbnormal: true, refRange: "< 150 mg/dL", confidence: 0.98 },
        { name: "HDL Cholesterol", value: "38", unit: "mg/dL", isAbnormal: true, refRange: "> 40 mg/dL", confidence: 0.97 },
        { name: "LDL Cholesterol", value: "167", unit: "mg/dL", isAbnormal: true, refRange: "< 100 mg/dL", confidence: 0.99 },
        { name: "Chol/HDL Ratio", value: "6.52", unit: "ratio", isAbnormal: true, refRange: "< 4.5", confidence: 0.96 }
      ],
      medicines: [
        { name: "Tab Rosuvastatin", dose: "10mg", freq: "Once daily at bedtime" },
        { name: "Arjuna Ksheerapaka (AYUSH)", dose: "100ml", freq: "Twice daily morning & evening" }
      ]
    }
  },
  {
    id: "REP-003",
    title: "Fasting Blood Sugar & HbA1c Glycemic Report",
    fileName: "03_fasting_hba1c_diabetic_profile.txt",
    category: "Lab Report",
    patientName: "KAMAL HAASAN R.",
    date: "2026-09-10",
    facility: "Kilpauk Diabetes & Endocrinology Center, Chennai",
    rawOcrText: `KILPAUK DIABETES & METABOLIC SPECIALTY CENTER
PATIENT: KAMAL HAASAN R. | AGE: 69 Yrs | GENDER: Male | ID: KMC-8802
DATE: 10-SEP-2026 | FASTING DURATION: 10 Hours

GLYCEMIC CONTROL ASSESSMENT:
- Fasting Blood Sugar (FBS): 158 mg/dL    [NORMAL: 70 - 100 mg/dL]  --> ELEVATED (Diabetic Range)
- Post-Prandial Blood Sugar (PPBS): 224 mg/dL [NORMAL: < 140 mg/dL]  --> MARKEDLY ELEVATED
- Glycated Hemoglobin (HbA1c): 8.4 %      [NON-DIABETIC: < 5.7 %, TARGET: < 7.0 %] --> POOR CONTROL
- Estimated Average Glucose (eAG): 194 mg/dL
- Urine Sugar: ++ (Positive)
- Urine Ketones: Negative

DIAGNOSTIC SUMMARY:
Type 2 Diabetes Mellitus with sub-optimal glycemic control. Immediate initiation of dual oral hypoglycemic agents with lifestyle modifications and AYUSH Madhumehari Churna advised.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Type 2 Diabetes Mellitus with Uncontrolled Hyperglycemia (HbA1c 8.4%)",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Fasting Blood Sugar", value: "158", unit: "mg/dL", isAbnormal: true, refRange: "70 - 100 mg/dL", confidence: 0.99 },
        { name: "Post-Prandial Sugar", value: "224", unit: "mg/dL", isAbnormal: true, refRange: "< 140 mg/dL", confidence: 0.99 },
        { name: "HbA1c", value: "8.4", unit: "%", isAbnormal: true, refRange: "< 5.7 %", confidence: 0.99 }
      ],
      medicines: [
        { name: "Tab Metformin SR", dose: "500mg", freq: "Twice daily with meals" },
        { name: "Tab Glimepiride", dose: "1mg", freq: "Once daily before breakfast" },
        { name: "Madhumehari Churna (AYUSH)", dose: "5g", freq: "Twice daily with warm water" }
      ]
    }
  },
  {
    id: "REP-004",
    title: "12-Lead Electrocardiogram (ECG) Cardiac Report",
    fileName: "04_cardiology_12_lead_ecg_report.txt",
    category: "Scan / Diagnostic",
    patientName: "JOSEPH VIJAY",
    date: "2026-09-15",
    facility: "Rajiv Gandhi Government General Hospital - Department of Cardiology",
    rawOcrText: `RAJIV GANDHI GOVERNMENT GENERAL HOSPITAL - CARDIAC CATH LAB & ECG UNIT
PATIENT: JOSEPH VIJAY | AGE: 36 Yrs | GENDER: Male | TOKEN: OPD-101
RECORDING SPEED: 25 mm/s | VOLTAGE: 10 mm/mV | FILTER: 50 Hz | DATE: 15-SEP-2026

12-LEAD RESTING ECG INTERPRETATION:
- Heart Rate: 98 bpm (Sinus Tachycardia)
- Rhythm: Regular Sinus Rhythm
- PR Interval: 156 ms (Normal)
- QRS Duration: 88 ms (Normal)
- QT / QTc Interval: 392 / 454 ms (Borderline Prolonged)
- Frontal Axis: +60 degrees (Normal Axis)

ISCHEMIC / MORPHOLOGICAL FINDINGS:
• ST-segment depression of 1.5 mm observed in precordial leads V4, V5, V6
• Symmetrical T-wave inversion in Leads II, III, and aVF
• No pathological Q-waves identified
• Sokolow-Lyon Voltage Index: 28 mm (Within normal limits)

CLINICAL IMPRESSION:
Precordial ST-T segment changes suggestive of Acute Subendocardial Ischemia / Myocardial Strain.
RECOMMENDATION: Serial cardiac troponin-I enzyme assays, 2D Echocardiography, bed rest, and immediate cardiology consultation.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Precordial ST-T Depression / Acute Subendocardial Ischemia Suspected",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Heart Rate", value: "98", unit: "bpm", isAbnormal: true, refRange: "60 - 90 bpm", confidence: 0.99 },
        { name: "QTc Interval", value: "454", unit: "ms", isAbnormal: true, refRange: "< 440 ms", confidence: 0.97 },
        { name: "ST Depression V4-V6", value: "1.5", unit: "mm", isAbnormal: true, refRange: "0 mm", confidence: 0.98 }
      ],
      medicines: [
        { name: "Tab Aspirin (Ecosprin)", dose: "150mg", freq: "Stat single dose" },
        { name: "Tab Clopidogrel", dose: "75mg", freq: "Stat single dose" },
        { name: "Sorbiline / Prabhakar Vati (AYUSH)", dose: "1 tab", freq: "Twice daily" }
      ]
    }
  },
  {
    id: "REP-005",
    title: "Comprehensive Liver Function Test (LFT) Report",
    fileName: "05_liver_function_test_lft_report.txt",
    category: "Lab Report",
    patientName: "DHANUSH K.",
    date: "2026-09-08",
    facility: "Tirunelveli Medical College Hospital - Clinical Biochemistry",
    rawOcrText: `TIRUNELVELI MEDICAL COLLEGE HOSPITAL - HEPATOLOGY & CLINICAL BIOCHEMISTRY
PATIENT: DHANUSH K. | AGE: 41 Yrs | GENDER: Male | REG: TVL-7712
TEST PROFILE: Comprehensive Liver Function Assessment | DATE: 08-SEP-2026

HEPATIC ENZYMATIC & SYNTHETIC METRICS:
- Total Bilirubin: 1.8 mg/dL            [REF: 0.2 - 1.2 mg/dL]   --> ELEVATED (Mild Jaundice)
- Direct (Conjugated) Bilirubin: 0.7 mg/dL [REF: 0.0 - 0.3 mg/dL] --> ELEVATED
- Indirect (Unconjugated): 1.1 mg/dL    [REF: 0.1 - 0.9 mg/dL]   --> ELEVATED
- SGOT / AST: 68 U/L                    [REF: 10 - 40 U/L]       --> ELEVATED (Hepatocellular)
- SGPT / ALT: 74 U/L                    [REF: 10 - 45 U/L]       --> ELEVATED
- Alkaline Phosphatase (ALP): 142 U/L   [REF: 30 - 120 U/L]      --> ELEVATED
- Total Protein: 6.9 g/dL               [REF: 6.0 - 8.3 g/dL]    --> NORMAL
- Serum Albumin: 3.8 g/dL               [REF: 3.5 - 5.0 g/dL]    --> NORMAL
- A/G Ratio: 1.22                       [REF: 1.0 - 2.2]         --> NORMAL

IMPRESSION:
Mild acute transaminitis with conjugated hyperbilirubinemia. Advised ultrasound whole abdomen for fatty liver, avoid hepatotoxic drugs, and prescribe Liv-52 & Bhumyamalaki syrup.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Acute Hepatocellular Transaminitis & Mild Hyperbilirubinemia (Grade 1 Fatty Liver Suspect)",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Total Bilirubin", value: "1.8", unit: "mg/dL", isAbnormal: true, refRange: "0.2 - 1.2 mg/dL", confidence: 0.99 },
        { name: "SGOT (AST)", value: "68", unit: "U/L", isAbnormal: true, refRange: "10 - 40 U/L", confidence: 0.98 },
        { name: "SGPT (ALT)", value: "74", unit: "U/L", isAbnormal: true, refRange: "10 - 45 U/L", confidence: 0.98 },
        { name: "Alkaline Phosphatase", value: "142", unit: "U/L", isAbnormal: true, refRange: "30 - 120 U/L", confidence: 0.96 }
      ],
      medicines: [
        { name: "Liv-52 DS Syrup (AYUSH)", dose: "10ml", freq: "Twice daily before meals" },
        { name: "Bhumyamalaki Kashayam", dose: "15ml", freq: "Morning empty stomach" }
      ]
    }
  },
  {
    id: "REP-006",
    title: "Renal & Kidney Function Test (KFT / RFT)",
    fileName: "06_renal_kidney_function_test_kft.txt",
    category: "Lab Report",
    patientName: "VIKRAM C.",
    date: "2026-09-11",
    facility: "Thanjavur Medical College Hospital - Nephrology Wing",
    rawOcrText: `THANJAVUR MEDICAL COLLEGE HOSPITAL - CLINICAL NEPHROLOGY
PATIENT: VIKRAM C. | AGE: 58 Yrs | GENDER: Male | ID: TMCH-3319
DATE: 11-SEP-2026 | SPECIMEN: Serum & Electrolytes

RENAL FUNCTION PANEL:
- Blood Urea Nitrogen (BUN): 28 mg/dL    [REF: 7 - 20 mg/dL]     --> ELEVATED
- Serum Creatinine: 1.62 mg/dL           [REF: 0.7 - 1.3 mg/dL]  --> ELEVATED (Mild Renal Impairment)
- Estimated GFR (eGFR): 52 mL/min/1.73m2 [NORMAL: > 90 mL/min]   --> CKD Stage 3a (Mild-Moderate)
- Serum Uric Acid: 7.8 mg/dL             [REF: 3.5 - 7.2 mg/dL]  --> ELEVATED (Hyperuricemia)
- Serum Sodium (Na+): 138 mEq/L          [REF: 135 - 145 mEq/L]  --> NORMAL
- Serum Potassium (K+): 4.8 mEq/L        [REF: 3.5 - 5.0 mEq/L]  --> NORMAL
- Serum Calcium: 9.1 mg/dL               [REF: 8.5 - 10.5 mg/dL] --> NORMAL

IMPRESSION:
Stage 3a Renal Insufficiency with hyperuricemia. Requires fluid intake enhancement, avoidance of NSAIDs, and Punarnavadi Kashayam support.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Stage 3a Chronic Kidney Insufficiency with Hyperuricemia",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Serum Creatinine", value: "1.62", unit: "mg/dL", isAbnormal: true, refRange: "0.7 - 1.3 mg/dL", confidence: 0.99 },
        { name: "Blood Urea", value: "28", unit: "mg/dL", isAbnormal: true, refRange: "7 - 20 mg/dL", confidence: 0.97 },
        { name: "eGFR", value: "52", unit: "mL/min", isAbnormal: true, refRange: "> 90 mL/min", confidence: 0.98 },
        { name: "Serum Uric Acid", value: "7.8", unit: "mg/dL", isAbnormal: true, refRange: "3.5 - 7.2 mg/dL", confidence: 0.96 }
      ],
      medicines: [
        { name: "Tab Febuxostat", dose: "40mg", freq: "Once daily morning" },
        { name: "Punarnavadi Kashayam (AYUSH)", dose: "15ml", freq: "Twice daily with warm water" },
        { name: "Gokshuradi Guggulu", dose: "2 tabs", freq: "Twice daily after food" }
      ]
    }
  },
  {
    id: "REP-007",
    title: "Thyroid Profile (TSH, FT3, FT4) Diagnostic Report",
    fileName: "07_thyroid_profile_tsh_t3_t4_report.txt",
    category: "Lab Report",
    patientName: "TRISHA KRISHNAN",
    date: "2026-09-09",
    facility: "Tamil Nadu Endocrine & Hormone Institute, Chennai",
    rawOcrText: `TAMIL NADU STATE ENDOCRINE & METABOLIC LABORATORY
PATIENT: TRISHA KRISHNAN | AGE: 38 Yrs | GENDER: Female | REF: TN-CHE-1092
DATE: 09-SEP-2026 | METHOD: Chemiluminescence Immunoassay (CLIA)

THYROID HORMONE PANEL:
- Free Triiodothyronine (FT3): 2.1 pg/mL   [REF: 2.3 - 4.2 pg/mL]   --> LOW
- Free Thyroxine (FT4): 0.68 ng/dL         [REF: 0.89 - 1.76 ng/dL] --> LOW
- Thyroid Stimulating Hormone (TSH): 8.92 uIU/mL [REF: 0.35 - 4.94 uIU/mL] --> ELEVATED (Hypothyroidism)
- Anti-TPO Antibodies: 48 IU/mL           [REF: < 35 IU/mL]        --> BORDERLINE ELEVATED (Autoimmune)

CLINICAL IMPRESSION:
Primary Overt Hypothyroidism with mild autoimmune thyroiditis.
Advise: Start Thyroxine supplementation, selenium-rich diet, Kanchanara Guggulu (AYUSH), and repeat TSH after 6 weeks.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Primary Overt Hypothyroidism with Elevated TSH (8.92 uIU/mL)",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "TSH", value: "8.92", unit: "uIU/mL", isAbnormal: true, refRange: "0.35 - 4.94 uIU/mL", confidence: 0.99 },
        { name: "Free T4", value: "0.68", unit: "ng/dL", isAbnormal: true, refRange: "0.89 - 1.76 ng/dL", confidence: 0.98 },
        { name: "Free T3", value: "2.1", unit: "pg/mL", isAbnormal: true, refRange: "2.3 - 4.2 pg/mL", confidence: 0.97 }
      ],
      medicines: [
        { name: "Tab Levothyroxine Sodium", dose: "50mcg", freq: "Once daily morning 30 mins before tea" },
        { name: "Kanchanara Guggulu (AYUSH)", dose: "2 tabs", freq: "Twice daily after meals" }
      ]
    }
  },
  {
    id: "REP-008",
    title: "Digital Chest X-Ray Pulmonology Diagnostic Report",
    fileName: "08_chest_xray_pulmonology_report.txt",
    category: "Scan / Diagnostic",
    patientName: "NAYANTHARA V.",
    date: "2026-09-13",
    facility: "Madurai Government Rajaji Hospital - Radiology Department",
    rawOcrText: `GOVERNMENT RAJAJI HOSPITAL - DEPARTMENT OF RADIODIAGNOSIS, MADURAI
PATIENT: NAYANTHARA V. | AGE: 39 Yrs | GENDER: Female | X-RAY NO: GRH-RAD-4019
VIEW: Posteroanterior (PA) Chest Radiograph | DATE: 13-SEP-2026

RADIOLOGICAL OBSERVATIONS:
- Bony Thorax & Soft Tissues: Symmetrical thoracic cage. No rib fractures or osteolytic lesions.
- Trachea: Central, no mediastinal deviation.
- Cardiac Silhouette: Normal size and contour. Cardiothoracic ratio < 0.50.
- Lung Parenchyma: Prominent bronchovascular markings in bilateral lower lung zones. Haziness noted in right paracardiac region suggestive of early mild consolidation / bronchitis.
- Costophrenic & Cardiophrenic Angles: Clear and sharp bilaterally.
- Diaphragm: Normal domes, smooth contour.

CONCLUSION:
Features compatible with Acute Lower Respiratory Tract Bronchitis with right lower zone haziness. No active Koch's (TB) or pleural effusion identified.
Recommend: Steam inhalation with Eucalyptus, course of Azithromycin, Talisadi Churna, and rest.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Acute Bronchitis with Right Lower Lung Zone Bronchovascular Infiltrates",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Cardiothoracic Ratio", value: "0.46", unit: "ratio", isAbnormal: false, refRange: "< 0.50", confidence: 0.99 },
        { name: "Right Lower Zone Infiltrate", value: "Present", unit: "text", isAbnormal: true, refRange: "Clear", confidence: 0.96 }
      ],
      medicines: [
        { name: "Tab Azithromycin", dose: "500mg", freq: "Once daily for 5 days" },
        { name: "Talisadi Churna (AYUSH)", dose: "3g", freq: "Thrice daily with honey" },
        { name: "Vasavaleha Syrup", dose: "10ml", freq: "Twice daily after food" }
      ]
    }
  },
  {
    id: "REP-009",
    title: "AYUSH Nadi Pariksha & Panchakarma Discharge Summary",
    fileName: "09_ayurvedic_nadi_prakriti_discharge_summary.txt",
    category: "Discharge Summary",
    patientName: "SIVAKARTHIKEYAN G.",
    date: "2026-09-07",
    facility: "National Institute of Siddha & Ayurveda (AIIA), Chennai",
    rawOcrText: `NATIONAL INSTITUTE OF SIDDHA & AYUSH HOSPITAL - CHENNAI
DEPARTMENT OF KAYACHIKITSA & PANCHAKARMA
PATIENT: SIVAKARTHIKEYAN G. | AGE: 39 Yrs | GENDER: Male | IP NO: AYUSH-CHE-2026-88
ADMISSION: 01-SEP-2026 | DISCHARGE: 07-SEP-2026 | PRAKRITI: Vata-Pitta Pradhana

CLINICAL AYUSH EVALUATION & DOSHIC DIAGNOSIS:
• Nadi: Vata-Mandagata (Weak, erratic pulse indicative of Apana Vata vitiation)
• Agni: Vishama Agni (Variable digestive capacity with abdominal distension)
• Koshtha: Krura Koshtha (Chronic constipation tendency)
• Rogam: Sandhivata (Osteo-articular inflammation) with Gredhrasi (Sciatic nerve impingement)

TREATMENT ADMINISTERED:
1. Snehana & Swedana (Abhyanga with Mahanarayana Thailam followed by Bashpa Sweda) x 5 days
2. Matra Vasti with Sahacharadi Thailam (60ml) x 3 sessions
3. Kati Vasti with Murivenna for L4-L5 lumbar decompression

DISCHARGE CONDITION & ADVICE:
Significant pain relief (VAS score reduced from 8/10 to 2/10). Spinal flexibility restored.
DISCHARGE MEDICATIONS:
- Yogaraja Guggulu: 2 tablets twice daily after food with warm water
- Dashamoolarishta: 20ml twice daily with equal water after lunch & dinner
- Ksheerabala 101 Drops: 5 drops in warm milk at bedtime

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Sandhivata & Sciatic Neuralgia (Vata-Pitta Vitiation) - Post Panchakarma",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Pain VAS Score", value: "2", unit: "/10", isAbnormal: false, refRange: "0 - 3 (Mild)", confidence: 0.99 },
        { name: "Prakriti Dominance", value: "Vata-Pitta", unit: "type", isAbnormal: false, refRange: "Tridosha", confidence: 0.98 }
      ],
      medicines: [
        { name: "Yogaraja Guggulu (AYUSH)", dose: "2 tabs", freq: "Twice daily after food" },
        { name: "Dashamoolarishta", dose: "20ml", freq: "Twice daily after meals" },
        { name: "Ksheerabala 101 Drops", dose: "5 drops", freq: "Nightly in warm milk" }
      ]
    }
  },
  {
    id: "REP-010",
    title: "Knee Joint MRI & Orthopedic Musculoskeletal Report",
    fileName: "10_orthopedic_knee_joint_mri_report.txt",
    category: "Scan / Diagnostic",
    patientName: "SURIYA S.",
    date: "2026-09-06",
    facility: "Coimbatore Medical College Hospital - Advanced MRI Center",
    rawOcrText: `COIMBATORE MEDICAL COLLEGE HOSPITAL - ADVANCED 3.0T MRI SUITE
PATIENT: SURIYA S. | AGE: 48 Yrs | GENDER: Male | SCAN ID: CMCH-MRI-9912
INVESTIGATION: High-Resolution MRI Right Knee Joint | DATE: 06-SEP-2026

SCAN PROTOCOL:
Multiplanar, multisequence T1, T2, PD Fat-Suppressed imaging of right knee joint.

FINDINGS:
1. Menisci: Grade II linear intrameniscal signal alteration in posterior horn of medial meniscus. No definite articular surface extension (No frank tear). Lateral meniscus intact.
2. Cruciate & Collateral Ligaments: ACL, PCL, MCL, and LCL show normal signal intensity and thickness.
3. Articular Cartilage: Mild thinning of patellofemoral articular cartilage with marginal osteophyte formation at medial tibiofemoral joint (Grade 2 Osteoarthritis).
4. Joint Effusion: Minimal joint effusion noted in suprapatellar bursa.

DIAGNOSTIC IMPRESSION:
- Grade 2 Primary Knee Osteoarthritis with early medial compartment narrowing.
- Grade II Medial Meniscal Degeneration without displaced tear.
- Minimal suprapatellar joint effusion.

RECOMMENDATIONS: Quadriceps strengthening physiotherapy, intra-articular hyaluronic acid / PRP review, and Murivenna oil knee wrap.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Grade 2 Knee Osteoarthritis with Grade II Medial Meniscal Degeneration",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Osteoarthritis Grade", value: "2", unit: "Kellegren Grade", isAbnormal: true, refRange: "0 (Normal)", confidence: 0.99 },
        { name: "Joint Effusion", value: "Minimal", unit: "bursa", isAbnormal: true, refRange: "Nil", confidence: 0.96 }
      ],
      medicines: [
        { name: "Tab Glucosamine + Chondroitin", dose: "1500mg", freq: "Once daily morning" },
        { name: "Murivenna Thailam Wrap (AYUSH)", dose: "Local application", freq: "Nightly warm compress" }
      ]
    }
  },
  {
    id: "REP-011",
    title: "Hypertension & Cardiac Outpatient Prescription Slip",
    fileName: "11_hypertension_cardiac_prescription.txt",
    category: "Prescription",
    patientName: "VIJAY SETHUPATHI M.",
    date: "2026-09-15",
    facility: "Tiruchirappalli Government Medical College Hospital - OPD Clinic",
    rawOcrText: `GOVERNMENT MEDICAL COLLEGE HOSPITAL - TIRUCHIRAPPALLI
DEPARTMENT OF CARDIOLOGY & INTERNAL MEDICINE OPD
PATIENT: VIJAY SETHUPATHI M. | AGE: 46 Yrs | GENDER: Male | OPD NO: TRY-4401
VITAL SIGNS: BP 162/98 mmHg | Pulse: 84 bpm | SpO2: 98% | DATE: 15-SEP-2026

DIAGNOSIS: Essential Hypertension Stage 2 with Hypertensive Headache (Vata-Rakta)

PRESCRIPTION (Rx):
1. Tab Telmisartan 40mg + Hydrochlorothiazide 12.5mg (Telma-H) - 1 tab PO OD (Morning after breakfast) x 30 days
2. Tab Amlodipine 5mg (Amlong) - 1 tab PO OD (Night after dinner) x 30 days
3. Sarpagandha Vati (AYUSH formulation) - 1 tablet PO BD with water x 30 days
4. Tab Paracetamol 650mg (Dolo) - 1 tab SOS for headache (Max 3/day)

CLINICAL INSTRUCTIONS:
- Monitor Blood Pressure twice weekly in hospital or kiosk.
- Strict salt restriction (< 3g daily), avoid papad, pickles, and fried foods.
- Review in Cardiology OPD in 4 weeks with serum electrolytes.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Essential Hypertension Stage 2 with Hypertensive Headache",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Blood Pressure", value: "162/98", unit: "mmHg", isAbnormal: true, refRange: "< 120/80 mmHg", confidence: 0.99 },
        { name: "Pulse Rate", value: "84", unit: "bpm", isAbnormal: false, refRange: "60 - 100 bpm", confidence: 0.99 }
      ],
      medicines: [
        { name: "Tab Telmisartan + HCTZ", dose: "40mg/12.5mg", freq: "Once daily morning after food" },
        { name: "Tab Amlodipine", dose: "5mg", freq: "Once daily at night" },
        { name: "Sarpagandha Vati (AYUSH)", dose: "1 tab", freq: "Twice daily with water" },
        { name: "Tab Paracetamol", dose: "650mg", freq: "SOS for headache" }
      ]
    }
  },
  {
    id: "REP-012",
    title: "Pediatric Acute Bronchial & ENT Diagnostic Summary",
    fileName: "12_pediatric_fever_ent_report.txt",
    category: "Lab Report",
    patientName: "KEERTHY SURESH",
    date: "2026-09-14",
    facility: "Institute of Child Health & Hospital for Children, Chennai",
    rawOcrText: `INSTITUTE OF CHILD HEALTH & HOSPITAL FOR CHILDREN - CHENNAI
PATIENT: KEERTHY SURESH | AGE: 32 Yrs | GENDER: Female | OPD: ICH-5512
CHIEF COMPLAINTS: High-grade fever (101.4°F) x 3 days, throat pain, and painful swallowing.

EXAMINATION FINDINGS:
- Temperature: 101.4 °F | Pulse: 102 bpm | SpO2: 97% on room air
- Pharynx: Congested posterior pharyngeal wall with bilateral Grade 3 tonsillar enlargement and follicular exudates.
- Cervical Lymph Nodes: Tender anterior cervical lymphadenopathy.
- Lungs: Clear, no wheeze or crepitations.

DIAGNOSIS: Acute Follicular Tonsillitis with Secondary Pyrexia (Kaphaja Galaganda)

RECOMMENDED Rx:
1. Syp/Tab Amoxicillin + Clavulanic Acid 625mg - 1 tab BD x 5 days
2. Tab Ibuprofen + Paracetamol (Combiflam) - 1 tab TDS after meals x 3 days
3. Khadiradi Vati (AYUSH lozenges) - 1 tablet to be sucked 4 times daily
4. Warm saltwater gargle with Turmeric powder thrice daily.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Acute Follicular Tonsillitis with Pyrexia & Cervical Lymphadenopathy",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Body Temperature", value: "101.4", unit: "°F", isAbnormal: true, refRange: "98.6 °F", confidence: 0.99 },
        { name: "Heart Rate", value: "102", unit: "bpm", isAbnormal: true, refRange: "60 - 90 bpm", confidence: 0.98 }
      ],
      medicines: [
        { name: "Tab Amoxicillin-Clavulanate", dose: "625mg", freq: "Twice daily after food x 5 days" },
        { name: "Tab Combiflam", dose: "400mg/325mg", freq: "Thrice daily after food" },
        { name: "Khadiradi Vati (AYUSH)", dose: "1 lozenge", freq: "Suck 4 times daily" }
      ]
    }
  },
  {
    id: "REP-013",
    title: "Complete Urine Routine & Microscopy Examination",
    fileName: "13_urine_routine_microscopy_report.txt",
    category: "Lab Report",
    patientName: "SAMANTHA RUTH",
    date: "2026-09-13",
    facility: "Salem Government Mohan Kumaramangalam Medical College Hospital",
    rawOcrText: `GOVERNMENT MOHAN KUMARAMANGALAM MEDICAL COLLEGE - CLINICAL PATHOLOGY
PATIENT: SAMANTHA RUTH | AGE: 37 Yrs | GENDER: Female | ID: GMK-4491
TEST: Routine & Microscopic Urine Analysis | DATE: 13-SEP-2026

PHYSICAL & CHEMICAL FINDINGS:
- Color: Pale Yellow | Appearance: Slightly Turbid
- Specific Gravity: 1.020 [REF: 1.005 - 1.030]
- pH: 6.2 [REF: 4.6 - 8.0]
- Urine Protein / Albumin: + (Trace to 30 mg/dL) --> TRACE POSITIVE
- Urine Sugar: Nil (Negative)
- Urine Ketone Bodies: Negative
- Bile Salts & Pigments: Negative
- Nitrites: Positive (+) --> BACTERIAL INFECTION INDICATOR

MICROSCOPIC EXAMINATION:
- Pus Cells (Leukocytes): 18 - 22 / HPF [REF: 0 - 5 / HPF] --> ELEVATED (UTI)
- Red Blood Cells (RBCs): 2 - 4 / HPF   [REF: 0 - 2 / HPF] --> BORDERLINE
- Epithelial Cells: 6 - 8 / HPF         [REF: 2 - 5 / HPF]
- Bacteria: Moderate present (++)
- Crystals: Calcium Oxalate crystals (+)

CLINICAL IMPRESSION:
Acute Lower Urinary Tract Infection (UTI) with trace proteinuria (Krichra Mutra).
Advise: Urine culture sensitivity, hydration > 3L daily, Nitrofurantoin course, and Chandanasava (AYUSH).

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Acute Lower Urinary Tract Infection (UTI) with Trace Proteinuria",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Pus Cells (WBCs)", value: "18-22", unit: "/HPF", isAbnormal: true, refRange: "0 - 5 /HPF", confidence: 0.99 },
        { name: "Nitrites", value: "Positive (+)", unit: "indicator", isAbnormal: true, refRange: "Negative", confidence: 0.98 },
        { name: "Urine Protein", value: "Trace (+)", unit: "albumin", isAbnormal: true, refRange: "Negative", confidence: 0.97 }
      ],
      medicines: [
        { name: "Tab Nitrofurantoin", dose: "100mg", freq: "Twice daily after food x 7 days" },
        { name: "Chandanasava (AYUSH)", dose: "15ml", freq: "Twice daily with equal water" },
        { name: "Cranberry Extract Sachet", dose: "1 sachet", freq: "Once daily dissolved in water" }
      ]
    }
  },
  {
    id: "REP-014",
    title: "Upper GI Endoscopy Gastroenterology Report",
    fileName: "14_gastroenterology_endoscopy_report.txt",
    category: "Scan / Diagnostic",
    patientName: "ARYA K.",
    date: "2026-09-05",
    facility: "Vellore Government Medical College Hospital - Endoscopy Suite",
    rawOcrText: `GOVERNMENT MEDICAL COLLEGE HOSPITAL - VELLORE - DEPARTMENT OF GASTROENTEROLOGY
PATIENT: ARYA K. | AGE: 43 Yrs | GENDER: Male | ENDO NO: VLR-GI-8812
PROCEDURE: Video Upper Gastrointestinal Esophagogastroduodenoscopy (OGD) | DATE: 05-SEP-2026

ENDOSCOPIC FINDINGS:
1. Esophagus: Normal caliber, mucosal lining intact. Z-line regular at 38 cm. No varices or esophagitis.
2. Stomach:
   • Fundus & Body: Normal rugal folds.
   • Antrum: Marked patchy mucosal erythema with superficial erosions. Rapid Urease Test (RUT) for Helicobacter pylori turned Pink (Positive +).
3. Pylorus: Centrally placed, patent.
4. Duodenum: D1 and D2 show normal villous pattern without active ulceration.

ENDOSCOPIC IMPRESSION:
- H. Pylori Positive Antral Erosive Gastritis (Amlapitta / Parinama Shoola).
- No active peptic ulcer or malignancy.

MANAGEMENT: H. Pylori eradication 14-day triple therapy + Avipattikar Churna and lifestyle guidance.

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "H. Pylori Positive Antral Erosive Gastritis",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "H. Pylori Rapid Urease", value: "Positive (+)", unit: "biopsy", isAbnormal: true, refRange: "Negative", confidence: 0.99 },
        { name: "Gastric Mucosa", value: "Antral Erythema", unit: "mucosa", isAbnormal: true, refRange: "Normal", confidence: 0.98 }
      ],
      medicines: [
        { name: "Cap Omeprazole", dose: "20mg", freq: "Twice daily before breakfast & dinner" },
        { name: "Tab Clarithromycin", dose: "500mg", freq: "Twice daily for 14 days" },
        { name: "Tab Amoxicillin", dose: "1000mg", freq: "Twice daily for 14 days" },
        { name: "Avipattikar Churna (AYUSH)", dose: "5g", freq: "Twice daily with lukewarm water" }
      ]
    }
  },
  {
    id: "REP-015",
    title: "Emergency Room Triage & Vitals Observation Record",
    fileName: "15_emergency_vitals_triage_slip.txt",
    category: "Discharge Summary",
    patientName: "JOSEPH VIJAY",
    date: "2026-09-15",
    facility: "Tamil Nadu Emergency Care Network - Trauma Triage Desk",
    rawOcrText: `TAMIL NADU STATE EMERGENCY CARE & TRAUMA NETWORK
GOVERNMENT GENERAL HOSPITAL CASUALTY TRIAGE SLIP
PATIENT: JOSEPH VIJAY | AGE: 36 Yrs | GENDER: Male | TRIAGE: RED (PRIORITY 1)
TIME OF ARRIVAL: 09:10 AM | RECORDED BY: Staff Nurse Anitha R., RN

EMERGENCY OBJECTIVE VITALS SNAPSHOT:
• Blood Pressure (BP): 168 / 104 mmHg (Hypertensive Crisis / Stage 2 Range)
• Heart Rate: 108 bpm (Sinus Tachycardia, regular rhythm)
• Respiratory Rate: 24 breaths / min (Tachypnea)
• Pulse Oximetry (SpO2): 94 % on ambient room air
• Random Blood Glucose (RBG): 176 mg/dL
• Body Temperature: 98.6 °F (Normothermic)
• GCS Score: 15 / 15 (Alert, Oriented)

TRIAGE EVALUATION & NURSE NOTES:
Patient arrived with crushing retrosternal chest pain radiating to left jaw and shoulder with severe diaphoresis.
STAT Interventions: High flow Oxygen 4L/min via nasal prongs, Sublingual Nitroglycerin 0.5mg administered, STAT 12-lead ECG dispatched, IV cannula 18G secured in left antecubital fossa. Transferred to Cardiac Care Unit (CCU).

[SECURITY-WATERMARK: #MK-EHR-VALID-CLINICAL-REPORT-2026-NABL#]
[ENCRYPTED-SECURITY-TOKEN: XXXXXXYYYYYZZZZZZ]
[AUTHENTIC-SECURITY-KEY: MK-CERTIFIED-TN-HEALTH-9942]`,
    extracted: {
      diagnosis: "Hypertensive Crisis & Suspected Acute Coronary Syndrome (Triage Red)",
      apiStatus: "Groq LLaMA-3.3 70B & Clinical Parser Engine",
      labValues: [
        { name: "Blood Pressure", value: "168/104", unit: "mmHg", isAbnormal: true, refRange: "< 120/80 mmHg", confidence: 0.99 },
        { name: "Heart Rate", value: "108", unit: "bpm", isAbnormal: true, refRange: "60 - 90 bpm", confidence: 0.99 },
        { name: "Oxygen Saturation (SpO2)", value: "94", unit: "%", isAbnormal: true, refRange: "95 - 100 %", confidence: 0.99 },
        { name: "Respiratory Rate", value: "24", unit: "/min", isAbnormal: true, refRange: "12 - 18 /min", confidence: 0.98 }
      ],
      medicines: [
        { name: "Tab Nitroglycerin (Sublingual)", dose: "0.5mg", freq: "Stat emergency dose" },
        { name: "Oxygen Therapy", dose: "4 L/min", freq: "Continuous via nasal prongs" },
        { name: "IV Normal Saline", dose: "500ml", freq: "Slow drip" }
      ]
    }
  }
];

export const getSampleReportById = (id) => {
  return SAMPLE_REPORTS_LIST.find(r => r.id === id) || SAMPLE_REPORTS_LIST[0];
};
