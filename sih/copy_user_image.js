const fs = require('fs');
const path = require('path');

const srcPath = "C:/Users/santh/.gemini/antigravity/brain/b207003a-5e23-44a4-b5c8-dcb3fb11167e/.user_uploaded/media_1789451492451.png";
const destPng = path.join(__dirname, 'public', 'assets', 'images', 'doctorWorkspace.png');
const destJpg = path.join(__dirname, 'public', 'assets', 'images', 'doctorWorkspace.jpg');

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destPng);
  fs.copyFileSync(srcPath, destJpg);
  console.log('Copied user doctor workspace image successfully to:');
  console.log('1.', destPng);
  console.log('2.', destJpg);
} else {
  console.error('Source image not found at:', srcPath);
}
