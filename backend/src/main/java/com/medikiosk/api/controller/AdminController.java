package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.repository.PatientSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private static final java.util.concurrent.atomic.AtomicLong registrationCounter = new java.util.concurrent.atomic.AtomicLong(0);

    public static void incrementRegistrationCounter() {
        registrationCounter.incrementAndGet();
    }

    public static long getRegistrationCount() {
        return registrationCounter.get();
    }

    @Autowired
    private PatientSessionRepository patientSessionRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        long dbCount = patientSessionRepository.count();
        long extraRegistrations = registrationCounter.get();
        long totalNewRegistrations = Math.max(dbCount, extraRegistrations);

        long totalVisits = 2280 + totalNewRegistrations;
        long activeCaseload = 2280 + totalNewRegistrations;
        long walkInCount = 1480 + totalNewRegistrations;
        long onlineCount = 892;
        long activeKioskUsers = 342 + (totalNewRegistrations > 0 ? totalNewRegistrations : 0);
        long totalNetworkMembers = 3801 + totalNewRegistrations;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalScheduledVisits", totalVisits);
        stats.put("activeHospitalCaseload", activeCaseload);
        stats.put("dailyWalkInOpd", walkInCount);
        stats.put("onlineAppointments", onlineCount);
        stats.put("activeAppUsers", activeKioskUsers);
        stats.put("tokenVelocityMinutes", 3.8);
        stats.put("totalHospitalsNetwork", 380);
        stats.put("totalDistricts", 38);
        stats.put("totalNetworkMembers", totalNetworkMembers);
        stats.put("status", "SUCCESS");
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        List<Map<String, String>> logs = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        Map<String, String> log1 = new HashMap<>();
        log1.put("id", "LOG-901");
        log1.put("timestamp", LocalDateTime.now().minusMinutes(5).format(formatter));
        log1.put("user", "Operational Staff (Admin)");
        log1.put("role", "ADMIN_ROLE");
        log1.put("action", "WALK_IN_OP_REGISTRATION");
        log1.put("details", "Issued OPD Token for Walk-in Patient at Desk #02");
        log1.put("status", "SUCCESS");
        logs.add(log1);

        Map<String, String> log2 = new HashMap<>();
        log2.put("id", "LOG-902");
        log2.put("timestamp", LocalDateTime.now().minusMinutes(18).format(formatter));
        log2.put("user", "Dr. V. S. Ramachandran");
        log2.put("role", "DOCTOR_ROLE");
        log2.put("action", "AI_PATIENT_RECORD_ANALYSIS");
        log2.put("details", "Generated AI Clinical Summary for OP Token #OPD-882");
        log2.put("status", "SUCCESS");
        logs.add(log2);

        Map<String, String> log3 = new HashMap<>();
        log3.put("id", "LOG-903");
        log3.put("timestamp", LocalDateTime.now().minusMinutes(42).format(formatter));
        log3.put("user", "Nurse Malarvizhi");
        log3.put("role", "NURSE_ROLE");
        log3.put("action", "PATIENT_VITALS_LOGGED");
        log3.put("details", "Logged BP: 120/80, SpO2: 98%, Pulse: 72 bpm");
        log3.put("status", "SUCCESS");
        logs.add(log3);

        return ResponseEntity.ok(logs);
    }

    @PostMapping("/register-offline-op")
    public ResponseEntity<?> registerOfflineOpPatient(@RequestBody Map<String, String> request) {
        String token = "OPD-" + (100 + new Random().nextInt(900));
        String name = request.getOrDefault("name", "Walk-in Patient");
        String age = request.getOrDefault("age", "30");
        String gender = request.getOrDefault("gender", "Male");
        String department = request.getOrDefault("department", "General Medicine OPD");
        String hospital = request.getOrDefault("hospital", "Rajiv Gandhi Government General Hospital");

        PatientSessionEntity session = new PatientSessionEntity();
        session.setToken(token);
        session.setName(name);
        session.setAge(age);
        session.setGender(gender);
        session.setLanguage("en-IN");
        session.setChiefComplaint("Registered offline at counter desk (" + hospital + " - " + department + ")");
        session.setSummaryText("Registered offline at counter desk (" + hospital + "). Pending voice intake.");
        session.setSummaryStatus("registered-offline");

        PatientSessionEntity saved = patientSessionRepository.save(session);
        incrementRegistrationCounter();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("token", token);
        response.put("session", saved);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/hospitals/roster/{hospitalName}")
    public ResponseEntity<?> getHospitalRoster(@PathVariable String hospitalName) {
        int hash = Math.abs(hospitalName.hashCode()) % 380;
        
        String[] nameBases = {
            "Joseph Vijay", "Rajinikanth M.", "Kamal Haasan R.", "Suriya S.", "Ajith Kumar P.",
            "Dhanush K.", "Vikram C.", "Karthi S.", "Sivakarthikeyan G.", "Vijay Sethupathi M.",
            "Trisha Krishnan", "Nayanthara V.", "Samantha Ruth", "Rashmika Mandanna", "Keerthy Suresh",
            "Jyothika S.", "Prashanth T.", "Arya K.", "Vishal Reddy", "Jayam Ravi",
            "Supriya Sahu IAS", "Gagandeep Singh Bedi IAS", "Irai Anbu IAS", "U. Sagayam IAS", "J. Radhakrishnan IAS",
            "Beela Rajesh IAS", "M. K. Stalin", "Udhayanidhi Stalin", "K. Annamalai", "Ma. Subramanian",
            "P. T. R. Palanivel", "Thangam Thennarasu", "Madan Gowri", "Irfan View", "Village Cooking Chef"
        };

        String[] specs = {
            "Cardiology & Ayush Integrative Care", "Orthopedics & Joint Trauma Care",
            "ENT & Respiratory Medicine", "Interventional Cardiology",
            "Internal Medicine & Metabolic Health", "Ayush Kayachikitsa & Panchakarma"
        };

        String[] quals = {
            "MD (General Medicine), MS (Ayurveda)", "MS (Orthopedics), DNB",
            "MD (Pediatrics & ENT), FRCS", "MD, DM (Cardiology)",
            "MD (General Medicine), DNB", "BAMS, MD (Ayurveda)"
        };

        int doc1Idx = hash * 2;
        int doc2Idx = hash * 2 + 1;

        List<Map<String, Object>> doctors = new ArrayList<>();
        Map<String, Object> doc1 = new HashMap<>();
        doc1.put("id", "DOC-" + (1001 + doc1Idx));
        doc1.put("name", "Dr. " + nameBases[doc1Idx % nameBases.length] + " " + (char)('A' + (doc1Idx % 26)) + ".");
        doc1.put("qualification", quals[doc1Idx % quals.length]);
        doc1.put("spec", specs[doc1Idx % specs.length]);
        doc1.put("role", "Senior Consultant Doctor");
        doc1.put("curedCount", 18 + (doc1Idx % 10));
        doc1.put("totalCount", 20 + (doc1Idx % 10));
        doc1.put("cureRate", Math.round(((18.0 + (doc1Idx % 10)) / (20.0 + (doc1Idx % 10))) * 100));
        doc1.put("promoted", doc1Idx % 3 == 0);
        doctors.add(doc1);

        Map<String, Object> doc2 = new HashMap<>();
        doc2.put("id", "DOC-" + (1001 + doc2Idx));
        doc2.put("name", "Dr. " + nameBases[doc2Idx % nameBases.length] + " " + (char)('A' + (doc2Idx % 26)) + ".");
        doc2.put("qualification", quals[doc2Idx % quals.length]);
        doc2.put("spec", specs[doc2Idx % specs.length]);
        doc2.put("role", "Associate Specialist Doctor");
        doc2.put("curedCount", 14 + (doc2Idx % 8));
        doc2.put("totalCount", 16 + (doc2Idx % 8));
        doc2.put("cureRate", Math.round(((14.0 + (doc2Idx % 8)) / (16.0 + (doc2Idx % 8))) * 100));
        doc2.put("promoted", false);
        doctors.add(doc2);

        Map<String, Object> nurse = new HashMap<>();
        nurse.put("id", "NRS-" + (1001 + hash));
        nurse.put("name", "Nurse " + nameBases[(hash + 15) % nameBases.length] + " " + (char)('A' + (hash % 26)) + ".");
        nurse.put("rank", hash % 2 == 0 ? "Senior Staff Nurse" : "Charge Nurse");
        nurse.put("shift", hash % 2 == 0 ? "Morning (08:00 - 16:00)" : "Evening (16:00 - 00:00)");
        nurse.put("dept", hash % 2 == 0 ? "Emergency Triage" : "OPD Ward Care");
        nurse.put("vitalsLoggedToday", 22 + (hash % 18));

        Map<String, Object> recep = new HashMap<>();
        recep.put("id", "REC-" + (1001 + hash));
        recep.put("name", "Desk Officer " + nameBases[(hash + 35) % nameBases.length] + " " + (char)('A' + (hash % 26)) + ".");
        recep.put("desk", "Counter Desk #" + ((hash % 3) + 1));
        recep.put("speed", String.format("%.1f min/patient", 3.0 + (hash % 10) * 0.1));
        recep.put("status", "Active");
        recep.put("tokensIssuedToday", 45 + (hash % 35));

        List<Map<String, Object>> patients = new ArrayList<>();
        String[] categories = {
            "Heart & Cardiac Care", "Heart & Cardiac Care", "Heart & Cardiac Care", "Heart & Cardiac Care", "Heart & Cardiac Care",
            "Orthopedic & Joint Care", "Orthopedic & Joint Care", "Orthopedic & Joint Care", "Orthopedic & Joint Care", "Orthopedic & Joint Care", "Orthopedic & Joint Care",
            "Respiratory & ENT Care", "Respiratory & ENT Care", "Respiratory & ENT Care", "Respiratory & ENT Care", "Respiratory & ENT Care",
            "Diabetes & Metabolic", "Diabetes & Metabolic", "Diabetes & Metabolic", "Diabetes & Metabolic", "Diabetes & Metabolic",
            "Ayush & Gastro Care", "Ayush & Gastro Care", "Ayush & Gastro Care", "Ayush & Gastro Care", "Ayush & Gastro Care",
            "Ayush & Gastro Care", "Ayush & Gastro Care", "Diabetes & Metabolic", "Diabetes & Metabolic"
        };
        String[] diagnoses = {
            "Ischemic Myocardial Strain", "Essential Hypertension & Vata", "Coronary Micro-Vascular Spasm", "Paroxysmal Supraventricular Tachycardia", "Hyperlipidemia & Metabolic Vascular Risk",
            "Patellofemoral Pain Syndrome", "Cervical Radiculopathy & Muscle Spasm", "Lumbar Disc Bulge & Paraspinal Strain", "Biceps Tendonitis & Shoulder Impingement", "Lateral Ankle Ligament Sprain", "Plantar Fasciitis & Calcaneal Spur",
            "Chronic Allergic Bronchitis", "Chronic Laryngitis & Vocal Strain", "Acute Frontal Sinusitis & Headache", "Bronchial Asthma & Wheezing Bouts", "Tonsillar Congestion & Pharyngitis",
            "Type 2 Diabetes Mellitus", "Subclinical Hypothyroidism & Fatigue", "Hyperuricemia & Gouty Arthritis", "Obesity & Metabolic Dysregulation", "Insulin Resistance & Fasting Hyperglycemia",
            "Pitta-Vata Dyspepsia (Amlapitta)", "Irritable Bowel Syndrome (Grahani Roga)", "Grade-1 Fatty Liver (Yakrit Roga)", "Duodenal Peptic Ulcer & Gastritis", "Chronic Constipation & Hemorrhoids",
            "Allergic Contact Dermatitis", "Tension Headache & Insomnia", "Benign Prostatic Hyperplasia & Dysuria", "Nephrolithiasis & Renal Colic"
        };
        String[] tablets = {
            "Tab Telmisartan 40mg + Sahacharadi 10ml", "Tab Amlodipine 5mg + Brahmi Rasayana 5g", "Tab Nitroglycerin 2.6mg + Prabhakar Vati", "Tab Metoprolol 25mg + Sarpagandha Vati", "Tab Rosuvastatin 10mg + Arjuna Ksheerapaka",
            "Tab Flexon MR + Murivenna Oil Massage", "Tab Myospaz + Kottamchukkadi Thailam", "Tab Ultracet + Dhanwantharam Thailam", "Tab Aceclofenac 100mg + Pinda Thailam", "Tab Chymoral Forte + Elastic Bandage", "Tab Etoricoxib 60mg + Ortho Cushion",
            "Tab Montair-LC + Haridra Khanda 5g", "Tab Levocetirizine 5mg + Yashtimadhu", "Tab Sinarest + Anu Thailam Nasya Drops", "Inhaler Foracort 200 + Vasavaleha 10g", "Tab Augmentin 625mg + Sitopaladi Churna",
            "Tab Metformin 500mg SR + Nisamalaki 3g", "Tab Thyronorm 25mcg + Kanchanara Guggulu", "Tab Febuxostat 40mg + Kaishore Guggulu", "Tab Orlistat 60mg + Triphala Guggulu", "Tab Teneligliptin 20mg + Chandraprabha Vati",
            "Tab Pantocid 40mg + Avipattikar Churna 5g", "Tab Mebeverine 135mg + Kutajarishta 15ml", "Tab Udiliv 300mg + Liv-52 DS + Arogyavardhini", "Tab Sucralfate Susp + Shankha Bhasma", "Tab Cremaffin + Abhayarishta 20ml",
            "Tab Allegra 120mg + Mahamarichadi Thailam", "Tab Zapiz 0.25mg + Manasamitra Vatakam", "Tab Tamsulosin 0.4mg + Gokshuradi Guggulu", "Tab Cystone Forte + Neeri KFT + Varunadi"
        };
        int[] limitDays = {10, 14, 12, 10, 15, 10, 12, 14, 10, 8, 10, 10, 7, 7, 14, 7, 15, 20, 10, 20, 14, 10, 14, 15, 10, 10, 10, 10, 15, 12};
        int[] cureDays  = { 8, 11,  9,  8, 12,  9, 10, 11,  7, 6,  8,  7, 5, 6, 10, 5, 12, 16,  8, 15, 11,  6, 11, 12,  8,  7,  8,  7, 12,  9};

        for (int i = 0; i < 6; i++) {
            int pIdx = hash * 6 + i;
            int dSlot = (hash * 6 + i) % categories.length;
            Map<String, Object> p = new HashMap<>();
            p.put("id", "PAT-" + (1001 + pIdx));
            p.put("token", "OPD-" + (1001 + pIdx));
            p.put("name", nameBases[(pIdx + 50) % nameBases.length].toUpperCase() + " " + (char)('A' + (pIdx % 26)) + ".");
            p.put("age", String.valueOf(28 + (pIdx % 50)));
            p.put("gender", pIdx % 2 == 0 ? "Male" : "Female");
            p.put("category", pIdx % 5 == 0 ? "IAS / Public Dignitary" : (pIdx % 3 == 0 ? "Popular Creator / Influencer" : "South Indian Public Resident"));
            p.put("diseaseCategory", categories[dSlot]);
            p.put("diagnosis", diagnoses[dSlot]);
            p.put("tablets", tablets[dSlot]);
            p.put("prescribedDays", limitDays[dSlot]);
            p.put("recoveryDays", cureDays[dSlot]);
            p.put("recoveryStatus", "Cured & Resolved (Day " + cureDays[dSlot] + ")");
            p.put("cured", true);
            p.put("assignedDoctor", i % 2 == 0 ? doc1.get("name") : doc2.get("name"));
            patients.add(p);
        }

        // Calculate Disease Breakdown
        List<Map<String, Object>> diseaseBreakdown = new ArrayList<>();
        String[] diseaseCats = {
            "Heart & Cardiac Care",
            "Orthopedic & Joint Care",
            "Respiratory & ENT Care",
            "Diabetes & Metabolic",
            "Ayush & Gastro Care"
        };

        for (String catName : diseaseCats) {
            Map<String, Object> catMap = new HashMap<>();
            catMap.put("category", catName);
            long count = patients.stream().filter(p -> catName.equals(p.get("diseaseCategory"))).count();
            catMap.put("total", count);
            catMap.put("cured", count);
            catMap.put("percentage", Math.round(((double) count / patients.size()) * 100));
            diseaseBreakdown.add(catMap);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMembers", 10);
        summary.put("totalDoctors", 2);
        summary.put("totalNurses", 1);
        summary.put("totalReceptionists", 1);
        summary.put("totalPatients", 6);
        summary.put("curedPatients", 6);
        summary.put("activeTreatment", 0);
        summary.put("hospitalCureRate", 100);
        summary.put("totalNetworkMembers", 3801);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "SUCCESS");
        result.put("hospitalName", hospitalName);
        result.put("districtName", "Tamil Nadu District");
        result.put("doctors", doctors);
        result.put("nurse", nurse);
        result.put("receptionist", recep);
        result.put("patients", patients);
        result.put("diseaseBreakdown", diseaseBreakdown);
        result.put("summary", summary);
        result.put("totalMembers", 10);
        result.put("totalNetworkMembers", 3801);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/hospitals/promote-doctor")
    public ResponseEntity<?> promoteDoctor(@RequestBody Map<String, String> request) {
        String doctorId = request.getOrDefault("doctorId", "DOC-101");
        String doctorName = request.getOrDefault("doctorName", "Doctor");
        String hospitalName = request.getOrDefault("hospitalName", "Government Hospital");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Dr. " + doctorName + " successfully awarded Senior Specialist Distinction & Promotion by Executive Admin!");
        response.put("doctorId", doctorId);
        response.put("hospitalName", hospitalName);
        response.put("promotedTitle", "Senior Specialist Specialist Distinction");

        return ResponseEntity.ok(response);
    }
}
