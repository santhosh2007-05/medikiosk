const fs = require('fs');
const path = require('path');

const srcPath = "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451618709.png";

const targets = [
  path.join(__dirname, 'public', 'assets', 'images', 'patientFemale1Avatar.png'),
  path.join(__dirname, 'public', 'assets', 'images', 'patientFemale1Avatar.jpg'),
  path.join(__dirname, 'public', 'assets', 'images', 'patientFemale2Avatar.png'),
  path.join(__dirname, 'public', 'assets', 'images', 'patientFemale2Avatar.jpg')
];

if (fs.existsSync(srcPath)) {
  targets.forEach(t => {
    fs.copyFileSync(srcPath, t);
    console.log('Saved female patient face avatar to:', t);
  });
} else {
  console.error('Source image not found at:', srcPath);
}
