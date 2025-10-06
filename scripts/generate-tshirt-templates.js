const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const TEMPLATES_DIR = path.join(__dirname, '../fashun-store/public/mockup-templates');

const colors = {
  black: '#000000',
  white: '#FFFFFF',
  gray: '#808080',
  navy: '#001F3F',
  red: '#FF4136',
};

async function generateTemplate(color, hexColor) {
  const width = 1000;
  const height = 1200;

  // Create T-shirt shape SVG
  const tshirtSVG = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.3" />
        </linearGradient>
      </defs>
      
      <!-- T-shirt body -->
      <path d="M 200 200 L 150 300 L 150 1100 L 850 1100 L 850 300 L 800 200 L 700 250 L 650 200 L 350 200 L 300 250 Z" 
            fill="${hexColor}" stroke="#333" stroke-width="2"/>
      
      <!-- Neck -->
      <ellipse cx="500" cy="200" rx="80" ry="40" fill="${hexColor}" stroke="#333" stroke-width="2"/>
      
      <!-- Sleeves -->
      <path d="M 200 200 L 100 350 L 150 400 L 150 300 Z" fill="${hexColor}" stroke="#333" stroke-width="2"/>
      <path d="M 800 200 L 900 350 L 850 400 L 850 300 Z" fill="${hexColor}" stroke="#333" stroke-width="2"/>
      
      <!-- Print area guide (will be removed in final) -->
      <rect x="300" y="400" width="400" height="400" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
      <text x="500" y="620" text-anchor="middle" fill="#999" font-size="20" opacity="0.5">Print Area</text>
    </svg>
  `;

  const outputPath = path.join(TEMPLATES_DIR, `tshirt-${color}.png`);

  await sharp(Buffer.from(tshirtSVG))
    .png()
    .toFile(outputPath);

  console.log(`✅ Generated ${color} template`);
}

async function generateAllTemplates() {
  console.log('🎨 Generating T-shirt mockup templates...\n');

  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  for (const [color, hexColor] of Object.entries(colors)) {
    try {
      await generateTemplate(color, hexColor);
    } catch (error) {
      console.error(`❌ Failed to generate ${color} template:`, error.message);
    }
  }

  console.log('\n✨ All templates generated successfully!');
  console.log(`📁 Templates saved to: ${TEMPLATES_DIR}`);
}

generateAllTemplates().catch(console.error);
