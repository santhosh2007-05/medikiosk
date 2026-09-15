const fs = require('fs');
const path = require('path');

const imageMap = {
  'hero.jpg': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'consultation.jpg': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  'documentScan.jpg': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  'ayurveda.jpg': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
  'digitalKiosk.jpg': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'doctorWorkspace.jpg': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'nurseStation.jpg': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
  'patientBanner.jpg': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80',
  'labReport.jpg': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  'tnHospital.jpg': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
  'abhaCard.jpg': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
  'registerBanner.jpg': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'stethoscope.jpg': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
  'xrayScan.jpg': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  'ayurvedicHerbs.jpg': 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
  'patientCare.jpg': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  'aiMedical.jpg': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  'cmcellHero.jpg': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'receptionDesk.jpg': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
  'emergencyCare.jpg': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'hospitalBuilding1.jpg': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
  'hospitalBuilding2.jpg': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'hospitalBuilding3.jpg': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
  'hospitalBuilding4.jpg': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
  'tnEmblem.jpg': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  'adminAvatar.jpg': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  'doctor1Avatar.jpg': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  'doctor2Avatar.jpg': 'https://images.unsplash.com/photo-1594824813566-78a594833215?auto=format&fit=crop&w=300&q=80',
  'doctor3Avatar.jpg': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
  'nurse1Avatar.jpg': 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
  'nurse2Avatar.jpg': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=300&q=80',
  'receptionist1Avatar.jpg': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'receptionist2Avatar.jpg': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'patientMale1Avatar.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'patientMale2Avatar.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'patientFemale1Avatar.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'patientFemale2Avatar.jpg': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'patientSeniorAvatar.jpg': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
};

const outputDir = path.join(__dirname, 'public', 'assets', 'images');

const createSvgContent = (title, subtitle = 'Government Healthcare Facility', bg = '#0c0a09', accent = '#059669') => `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="${bg}"/>
  <circle cx="400" cy="200" r="180" fill="${accent}" opacity="0.15"/>
  <path d="M370 110h60v180h-60z" fill="${accent}"/>
  <path d="M310 170h180v60h-180z" fill="${accent}"/>
  <text x="400" y="340" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
  <text x="400" y="380" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#34d399" text-anchor="middle">${subtitle}</text>
</svg>`;

async function run() {
  console.log('Downloading hospital stock photos to laptop project folder...');
  for (const [filename, url] of Object.entries(imageMap)) {
    const dest = path.join(outputDir, filename);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(dest, buffer);
        console.log('Saved: ' + filename + ' (' + buffer.length + ' bytes)');
        continue;
      }
    } catch (err) {
      // Fallback
    }

    // Save robust local SVG file if remote HTTP fetch was blocked
    const titleName = filename.replace('.jpg', '').replace(/([A-Z])/g, ' $1');
    const svgContent = createSvgContent(titleName, 'MediKiosk Hospital Network');
    fs.writeFileSync(dest.replace('.jpg', '.svg'), svgContent);
    fs.writeFileSync(dest, Buffer.from(svgContent));
    console.log('Saved Local SVG Asset: ' + filename);
  }
  console.log('All medical images saved locally on laptop!');
}

run();
