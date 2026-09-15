const fs = require('fs');
const path = require('path');

const hospitalImages = [
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451931922.png",
    names: ["tnHospital.png", "tnHospital.jpg", "hospitalBuilding1.png", "hero.png", "hero.jpg"]
  },
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451938728.png",
    names: ["hospitalBuilding2.png", "hospitalBuilding2.jpg", "patientBanner.png", "patientBanner.jpg"]
  },
  {
    src: "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789452010432.png",
    names: ["hospitalBuilding3.png", "hospitalBuilding3.jpg", "cmcellHero.png", "cmcellHero.jpg", "emergencyCare.png"]
  }
];

const destDir = path.join(__dirname, 'public', 'assets', 'images');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

hospitalImages.forEach((item, idx) => {
  if (fs.existsSync(item.src)) {
    item.names.forEach(name => {
      const target = path.join(destDir, name);
      fs.copyFileSync(item.src, target);
      console.log(`[Hospital ${idx+1}] Saved: ${target}`);
    });
  } else {
    console.error(`Source missing: ${item.src}`);
  }
});
