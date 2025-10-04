const sharp = require('sharp');

const createTemplate = async (name) => {
  const svg = `<svg width="500" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <rect x="50" y="100" width="400" height="450" fill="#ffffff" rx="30" stroke="#ddd" stroke-width="3"/>
    <rect x="150" y="250" width="200" height="200" fill="#f9f9f9" rx="10" stroke="#ccc" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="250" y="360" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">QR CODE AREA</text>
    <text x="250" y="580" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">${name.toUpperCase()}</text>
  </svg>`;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/templates/${name}.png`);
  
  console.log(`✅ Created ${name}.png`);
};

const templates = ['tshirt-front', 'tshirt-back', 'hoodie-front', 'hoodie-back'];

async function createAllTemplates() {
  try {
    for (const template of templates) {
      await createTemplate(template);
    }
    console.log('🎉 All template images created successfully!');
  } catch (error) {
    console.error('❌ Error creating templates:', error);
  }
}

createAllTemplates();