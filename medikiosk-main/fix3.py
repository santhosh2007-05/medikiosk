import os
import re

def checkout_and_fix():
    files_to_restore = [
        "sih/src/App.js",
        "sih/src/pages/auth/CareTrackLoginPage.jsx",
        "sih/src/components/common/AndroidLeftDrawer.jsx",
        "sih/src/pages/admin/AdminOfflineOpPage.jsx",
        "sih/src/pages/doctor/DoctorPortalPage.jsx",
        "sih/src/pages/nurse/NursePortalPage.jsx",
        "sih/src/context/PatientSessionContext.jsx"
    ]
    
    for f in files_to_restore:
        os.system(f"git show d8f531c:{f} > {f}")
        
        with open(f, "rb") as file:
            content = file.read().decode("utf-8", errors="ignore").replace("\r\n", "\n")
            
        if "AdminOfflineOpPage.jsx" in f or "AndroidLeftDrawer.jsx" in f or "DoctorPortalPage.jsx" in f or "NursePortalPage.jsx" in f:
            content = re.sub("(?i)cmcell", "Admin", content)
            
        if "CareTrackLoginPage.jsx" in f:
            content = content.replace("<option value=\"admin\">CMCELL Operational Desk</option>", "")
            content = content.replace("useState(\"admin\")", "useState(\"doctor\")")
            content = content.replace("case 'admin': return MEDICAL_IMAGES.cmcellHero;", "")
            content = content.replace("case 'admin': return ROLE_AVATARS.admin;", "")
            content = content.replace("role === 'admin' ? 'CMCELL Operational Desk' : ", "")
            content = content.replace("role === 'admin' ? 'CMCELL' : ", "")

        with open(f, "w", encoding="utf-8") as file:
            file.write(content)

checkout_and_fix()
