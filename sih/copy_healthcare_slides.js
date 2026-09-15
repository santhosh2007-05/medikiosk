const fs = require('fs');
const path = require('path');

const images = [
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451658115.png",
    names: ["loginSlide1.png", "loginSlide1.jpg"]
  },
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451674089.png",
    names: ["loginSlide2.png", "loginSlide2.jpg", "medicalTeam.png"]
  },
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451740713.png",
    names: ["loginSlide3.png", "loginSlide3.jpg", "digitalDoctor.png"]
  },
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451781970.png",
    names: ["consultation.png", "consultation.jpg", "patientCare.png"]
  },
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451794609.png",
    names: ["aiMedical.png", "aiMedical.jpg", "digitalKiosk.png"]
  }
];

const destDir = path.join(__dirname, 'public', 'assets', 'images');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

images.forEach((item, idx) => {
  if (fs.existsSync(item.src)) {
    item.names.forEach(name => {
      const target = path.join(destDir, name);
      fs.copyFileSync(item.src, target);
      console.log(`[${idx+1}] Saved: ${target}`);
    });
  } else {
    console.error(`Source image missing: ${item.src}`);
  }
});
