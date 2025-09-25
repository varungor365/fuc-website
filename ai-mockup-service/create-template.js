const sharp = require('sharp');
const path = require('path');

async function createBasicTshirtTemplate() {
  const width = 800;
  const height = 600;
  
  // Create a basic T-shirt shape using SVG
  const tshirtSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tshirtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#357abd;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- T-shirt body -->
      <path d="M 200 150 
               L 600 150 
               L 600 120 
               L 650 120 
               L 650 200 
               L 600 200 
               L 600 550 
               L 200 550 
               L 200 200 
               L 150 200 
               L 150 120 
               L 200 120 
               Z" 
            fill="url(#tshirtGradient)" 
            stroke="#2c5f96" 
            stroke-width="2"/>
      
      <!-- Neck opening -->
      <ellipse cx="400" cy="150" rx="50" ry="30" fill="#f8f9fa"/>
      
      <!-- Print area indicator (light overlay) -->
      <rect x="275" y="200" width="250" height="250" 
            fill="rgba(255,255,255,0.1)" 
            stroke="rgba(255,255,255,0.3)" 
            stroke-width="1" 
            stroke-dasharray="5,5"/>
    </svg>
  `;

  try {
    const templatePath = path.join(__dirname, 'templates', 'tshirt-template.png');
    
    await sharp(Buffer.from(tshirtSvg))
      .png()
      .toFile(templatePath);
    
    console.log('T-shirt template created successfully at:', templatePath);
  } catch (error) {
    console.error('Error creating template:', error);
  }
}

createBasicTshirtTemplate();