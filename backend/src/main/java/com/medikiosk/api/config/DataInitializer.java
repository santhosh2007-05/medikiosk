package com.medikiosk.api.config;

import com.medikiosk.api.model.PatientProfileEntity;
import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.repository.PatientProfileRepository;
import com.medikiosk.api.repository.PatientSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PatientProfileRepository profileRepository;

    @Autowired
    private PatientSessionRepository sessionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (sessionRepository.count() == 0) {
            seedTamilActorPatients();
        }
    }

    private void seedTamilActorPatients() {
        // 1. JOSEPH VIJAY
        createRecord(
                "OPD-101", "JOSEPH VIJAY", "36", "Male", "9840123456", "91-7829-1092-4412",
                "Rajiv Gandhi Government General Hospital, Chennai", "General Medicine OPD", "09:15 AM",
                "Severe right thigh muscle strain & knee joint stiffness after stunt scene",
                "Right Gastrocnemius Muscle Strain (Mild Ischemia Risk)",
                "Patient presenting with acute right thigh muscle tightness and localized tenderness after physical exertion. BP: 130/85 mmHg, Pulse: 78 bpm, SpO2: 98%. Recommended Ayush Sahacharadi Thailam application and mild rest.",
                "In Queue", true, "130", "85", "78", "98%", "98.6°F", "Pitta-Kapha", "Sama Agni", "Madhyama", false
        );

        // 2. RAJINIKANTH M.
        createRecord(
                "OPD-102", "RAJINIKANTH M.", "73", "Male", "9840192837", "91-8823-4412-9901",
                "Government Stanley Medical College Hospital, Chennai", "General Medicine OPD", "09:30 AM",
                "Mild hypertension, general fatigue & joint stiffness in morning",
                "Essential Hypertension & Vata Imbalance (Vata Vyadhi)",
                "Senior patient complaining of general exhaustion and early morning joint stiffness. BP: 145/90 mmHg, Pulse: 70 bpm, SpO2: 97%. Prescribed Brahmi Rasayana & Vata calming regimen.",
                "With Nurse", true, "145", "90", "70", "97%", "98.4°F", "Vata-Pitta Combined", "Manda Agni", "Krura Koshtha", false
        );

        // 3. KAMAL HAASAN R.
        createRecord(
                "OPD-103", "KAMAL HAASAN R.", "69", "Male", "9444102938", "91-9921-3312-8802",
                "Government Kilpauk Medical College Hospital, Chennai", "ENT & Respiratory Care", "09:45 AM",
                "Chronic throat irritation & vocal cord fatigue after extended speeches",
                "Chronic Laryngitis & Vocal Strain (Kaphaja Swarabheda)",
                "Patient presenting with persistent hoarseness of voice and pharyngeal dryness. BP: 125/82 mmHg, Pulse: 74 bpm, SpO2: 99%. Prescribed Yashtimadhu churna with lukewarm milk.",
                "Triaged", true, "125", "82", "74", "99%", "98.6°F", "Kapha-Pitta", "Sama Agni", "Mridu Koshtha", false
        );

        // 4. SURIYA S.
        createRecord(
                "OPD-104", "SURIYA S.", "48", "Male", "9840123999", "91-4412-8821-3304",
                "Coimbatore Medical College Hospital", "Orthopedics & Joint Care", "10:05 AM",
                "Shoulder impingement syndrome & lower back muscle ache",
                "Subacromial Impingement & L4-L5 Paraspinal Muscle Spasm",
                "Active patient reporting right shoulder pain during abduction above 90 degrees. BP: 118/78 mmHg, Pulse: 68 bpm, SpO2: 99%. Ordered Doppler MRI shoulder and Murivenna local massage.",
                "In Queue", false, "118", "78", "68", "99%", "98.6°F", "Pitta Dominant", "Tikshna Agni", "Madhyama", false
        );

        // 5. AJITH KUMAR P.
        createRecord(
                "OPD-105", "AJITH KUMAR P.", "52", "Male", "9789012345", "91-5512-9901-2283",
                "Government Rajaji Hospital, Madurai", "Neurosurgery & Spine OPD", "10:20 AM",
                "Cervical spondylosis radiating pain to left shoulder & hand tingling",
                "Cervical Radiculopathy (C5-C6 Disc Protrusion)",
                "Patient reports acute shooting pain from cervical neck region down left triceps into hand. BP: 132/84 mmHg, Pulse: 76 bpm, SpO2: 98%. Advised cervical collar and MRI cervical spine.",
                "In Queue", true, "132", "84", "76", "98%", "98.6°F", "Vata-Kapha", "Vishama Agni", "Krura Koshtha", true
        );

        // 6. DHANUSH K.
        createRecord(
                "OPD-106", "DHANUSH K.", "40", "Male", "9123456789", "91-1102-7743-9912",
                "Mahatma Gandhi Memorial Government Hospital, Trichy", "Gastroenterology OPD", "10:40 AM",
                "Epigastric burning discomfort, hyperacidity post irregular shoot meals",
                "Non-Ulcer Dyspepsia & Pitta Ulka (Acid Gastritis)",
                "Patient complains of retrosternal burning and epigastric fullness after meals. BP: 122/80 mmHg, Pulse: 72 bpm, SpO2: 99%. Recommended Avipattikar Churna and bland dietary regimen.",
                "Triaged", true, "122", "80", "72", "99%", "98.4°F", "Pitta-Vata", "Tikshna Agni", "Mridu Koshtha", false
        );

        // 7. SIVAKARTHIKEYAN G.
        createRecord(
                "OPD-107", "SIVAKARTHIKEYAN G.", "38", "Male", "9841098765", "91-6632-4410-1198",
                "Government Mohan Kumaramangalam Medical College Hospital, Salem", "Pediatrics & Family Medicine", "11:00 AM",
                "Seasonal allergic rhinitis, frequent sneezing & mild frontal headache",
                "Allergic Rhinitis (Vata-Kapha Pratishyaya)",
                "Patient presenting with watery nasal discharge, paroxysmal sneezing, and bilateral eye watering. BP: 120/78 mmHg, Pulse: 75 bpm, SpO2: 98%. Recommended Anu Thailam Nasya and steam inhalation.",
                "With Doctor", true, "120", "78", "75", "98%", "98.6°F", "Kapha Dominant", "Manda Agni", "Madhyama", false
        );

        // 8. VIJAY SETHUPATHI M.
        createRecord(
                "OPD-108", "VIJAY SETHUPATHI M.", "45", "Male", "9445012345", "91-7712-3390-5541",
                "Government Tirunelveli Medical College Hospital", "General Surgery & Vascular", "11:15 AM",
                "Bilateral leg swelling after continuous long shooting schedules",
                "Venous Insufficiency Grade 1 & Dependent Edema",
                "Patient presenting with bilateral lower extremity heaviness and mild pretibial edema after prolonged standing. BP: 128/82 mmHg, Pulse: 72 bpm, SpO2: 98%. Prescribed compression stockings and leg elevation.",
                "Completed", false, "128", "82", "72", "98%", "98.6°F", "Pitta-Kapha", "Sama Agni", "Madhyama", false
        );

        // 9. VIKRAM C.
        createRecord(
                "OPD-109", "VIKRAM C.", "57", "Male", "9884012345", "91-8890-1123-6641",
                "Government Thanjavur Medical College Hospital", "Cardiology & Vascular OPD", "11:30 AM",
                "Post-stunt chest tightness, occasional palpitations during extreme cardio",
                "Exercise-Induced Musculoskeletal Chest Pain (Angina Excluded)",
                "Patient presenting with anterior chest wall tenderness post strenuous exercise. ECG normal, BP: 130/84 mmHg, Pulse: 80 bpm, SpO2: 99%. High priority monitoring completed; cardiac biomarkers negative.",
                "Completed", true, "130", "84", "80", "99%", "98.6°F", "Pitta-Vata", "Tikshna Agni", "Madhyama", true
        );

        // 10. KARTHI S.
        createRecord(
                "OPD-110", "KARTHI S.", "46", "Male", "9790012345", "91-2241-9980-3312",
                "Kanyakumari Government Medical College Hospital", "Preventive Healthcare OPD", "11:45 AM",
                "Routine annual executive wellness checkup & preventive Ayush consultation",
                "General Health Maintenance & Rasayana Rejuvenation Assessment",
                "Asymptomatic patient presenting for comprehensive health screening. BP: 120/78 mmHg, Pulse: 70 bpm, SpO2: 99%. All vitals within normal limits. Advised Chyawanprash & routine wellness lifestyle.",
                "Completed", true, "120", "78", "70", "99%", "98.6°F", "Sama Dhatu", "Sama Agni", "Madhyama", false
        );
    }

    private void createRecord(
            String token, String name, String age, String gender, String phone, String aadhaar,
            String hospital, String department, String time, String chiefComplaint, String diagnosis,
            String summaryText, String status, boolean ayushMode, String sysBp, String diaBp,
            String heartRate, String spo2, String temp, String prakriti, String agni, String koshtha,
            boolean redFlag
    ) {
        PatientSessionEntity s = new PatientSessionEntity();
        s.setToken(token);
        s.setName(name);
        s.setAge(age);
        s.setGender(gender);
        s.setPhone(phone);
        s.setAadhaar(aadhaar);
        s.setHospital(hospital);
        s.setDepartment(department);
        s.setTime(time);
        s.setChiefComplaint(chiefComplaint);
        s.setDiagnosis(diagnosis);
        s.setSummaryText(summaryText);
        s.setStatus(status);
        s.setSummaryStatus("In Queue".equalsIgnoreCase(status) ? "draft" : status.toLowerCase());
        s.setAyushMode(ayushMode);
        s.setSysBp(sysBp);
        s.setDiaBp(diaBp);
        s.setHeartRate(heartRate);
        s.setSpo2(spo2);
        s.setTemp(temp);
        s.setPrakriti(prakriti);
        s.setAgni(agni);
        s.setKoshtha(koshtha);
        s.setRedFlag(redFlag);
        s.setLanguage("en-IN");
        s.setConsentGiven(true);

        sessionRepository.save(s);

        // Also save to Profile repository
        PatientProfileEntity p = new PatientProfileEntity(
                aadhaar, aadhaar, phone, name, Integer.parseInt(age), gender, "Tamil Nadu", hospital.split(",")[0], hospital
        );
        profileRepository.save(p);
    }
}
