const fs = require('fs');
const path = require('path');

const srcPath = "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451591431.png";

const targets = [
  path.join(__dirname, 'public', 'assets', 'images', 'patientMale1Avatar.png'),
  path.join(__dirname, 'public', 'assets', 'images', 'patientMale1Avatar.jpg'),
  path.join(__dirname, 'public', 'assets', 'images', 'patientMale2Avatar.png'),
  path.join(__dirname, 'public', 'assets', 'images', 'patientMale2Avatar.jpg')
];

if (fs.existsSync(srcPath)) {
  targets.forEach(t => {
    fs.copyFileSync(srcPath, t);
    console.log('Saved male patient face avatar to:', t);
  });
} else {
  console.error('Source image not found at:', srcPath);
}
