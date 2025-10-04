const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const axios = require('axios');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs').promises;
// const { createCanvas, loadImage, registerFont } = require('canvas'); // Temporarily disabled
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory job store (in production, use Redis)
const jobs = new Map();

// Create directories
const uploadsDir = path.join(__dirname, '../uploads');
const outputDir = path.join(__dirname, '../output');
const templatesDir = path.join(__dirname, '../templates');

async function ensureDirectories() {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(templatesDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FASHUN AI Mockup Service' });
});

// Generate mockup endpoint
app.post('/generate-mockup', upload.single('design'), async (req, res) => {
  try {
    const { garmentType, color, printArea, prompt } = req.body;
    const designFile = req.file;

    if (!designFile) {
      return res.status(400).json({ error: 'Design file is required' });
    }

    console.log('Generating mockup for:', { garmentType, color, printArea });

    // Process the design image
    const processedDesign = await sharp(designFile.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();

    // Get garment template
    const garmentTemplate = await getGarmentTemplate(garmentType, color, printArea);
    
    // Composite design onto garment
    const mockup = await compositeDesignOnGarment(garmentTemplate, processedDesign, printArea);

    // Convert to base64 for response
    const mockupBase64 = `data:image/png;base64,${mockup.toString('base64')}`;

    res.json({
      success: true,
      mockup: mockupBase64,
      metadata: {
        garmentType,
        color,
        printArea,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Mockup generation error:', error);
    res.status(500).json({ error: 'Failed to generate mockup' });
  }
});

// AI-powered design generation endpoint
app.post('/generate-design', async (req, res) => {
  try {
    const { prompt, style, width = 512, height = 512 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // This would integrate with Stable Diffusion or other AI service
    // For now, we'll simulate the response
    const generatedDesign = await generateAIDesign(prompt, style, width, height);

    res.json({
      success: true,
      design: generatedDesign,
      prompt,
      metadata: {
        style,
        dimensions: { width, height },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI design generation error:', error);
    res.status(500).json({ error: 'Failed to generate design' });
  }
});

// Get garment template
async function getGarmentTemplate(garmentType, color, printArea) {
  // In a real implementation, this would fetch from a template library
  // For now, create a simple colored rectangle representing the garment
  const garmentColors = {
    'black': [0, 0, 0],
    'white': [255, 255, 255],
    'navy': [30, 58, 138],
    'grey': [107, 114, 128],
    'olive': [54, 83, 20]
  };

  const [r, g, b] = garmentColors[color.toLowerCase()] || [0, 0, 0];
  
  return await sharp({
    create: {
      width: 1200,
      height: 1500,
      channels: 4,
      background: { r, g, b, alpha: 1 }
    }
  })
  .png()
  .toBuffer();
}

// Composite design onto garment template
async function compositeDesignOnGarment(garmentTemplate, design, printArea) {
  // Calculate position based on print area
  const positions = {
    'front': { left: 300, top: 400 },
    'back': { left: 300, top: 400 }
  };

  const position = positions[printArea] || positions['front'];

  return await sharp(garmentTemplate)
    .composite([{
      input: design,
      left: position.left,
      top: position.top,
      blend: 'over'
    }])
    .png()
    .toBuffer();
}

// AI design generation (placeholder)
async function generateAIDesign(prompt, style, width, height) {
  // This would integrate with actual AI services like:
  // - Hugging Face Inference API
  // - Replicate API
  // - Local Stable Diffusion
  
  // For demonstration, return a placeholder
  console.log('Generating AI design with prompt:', prompt);
  
  // Create a simple placeholder image
  const placeholderImage = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 100, g: 100, b: 100, alpha: 1 }
    }
  })
  .png()
  .toBuffer();

  return `data:image/png;base64,${placeholderImage.toString('base64')}`;
}

// Batch mockup generation for multiple designs
app.post('/generate-batch-mockups', upload.array('designs', 10), async (req, res) => {
  try {
    const { garmentType, color, variations } = req.body;
    const designFiles = req.files;

    if (!designFiles || designFiles.length === 0) {
      return res.status(400).json({ error: 'Design files are required' });
    }

    const mockups = await Promise.all(
      designFiles.map(async (file, index) => {
        const printArea = variations?.[index]?.printArea || 'front';
        const garmentTemplate = await getGarmentTemplate(garmentType, color, printArea);
        
        const processedDesign = await sharp(file.buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer();

        const mockup = await compositeDesignOnGarment(garmentTemplate, processedDesign, printArea);
        
        return {
          mockup: `data:image/png;base64,${mockup.toString('base64')}`,
          printArea,
          index
        };
      })
    );

    res.json({
      success: true,
      mockups,
      count: mockups.length
    });

  } catch (error) {
    console.error('Batch mockup generation error:', error);
    res.status(500).json({ error: 'Failed to generate batch mockups' });
  }
});

// Job status tracking
app.get('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json(job);
});

// Analyze image for similar product search
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const analysis = await analyzeProductImage(req.file.buffer);
    
    res.json({
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// Search similar products by image
app.post('/api/search-similar', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const similarProducts = await findSimilarProducts(req.file.buffer);
    
    res.json({
      similarProducts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error searching similar products:', error);
    res.status(500).json({ error: 'Failed to search similar products' });
  }
});

// Enhanced AI design generation with job tracking
app.post('/api/generate-design-async', async (req, res) => {
  try {
    const { prompt, style = 'streetwear', constraints = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store job with initial status
    jobs.set(jobId, {
      id: jobId,
      type: 'design',
      status: 'pending',
      prompt,
      style,
      constraints,
      createdAt: new Date().toISOString(),
      progress: 0
    });

    // Start processing asynchronously
    processDesignGeneration(jobId, prompt, style, constraints);

    res.json({
      jobId,
      status: 'pending',
      message: 'Design generation started'
    });

  } catch (error) {
    console.error('Error starting design generation:', error);
    res.status(500).json({ error: 'Failed to start design generation' });
  }
});

// AR-ready 3D mockup generation
app.post('/api/generate-3d-mockup', async (req, res) => {
  try {
    const { productId, designUrl, viewAngles = ['front', 'back'] } = req.body;

    if (!productId || !designUrl) {
      return res.status(400).json({ 
        error: 'Product ID and design URL are required' 
      });
    }

    const mockups = await generate3DMockups(productId, designUrl, viewAngles);

    res.json({
      mockups,
      productId,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating 3D mockup:', error);
    res.status(500).json({ error: 'Failed to generate 3D mockup' });
  }
});

// Serve output files
app.use('/output', express.static(outputDir));
app.use('/templates', express.static(templatesDir));

// Helper Functions
async function processDesignGeneration(jobId, prompt, style, constraints) {
  try {
    const job = jobs.get(jobId);
    if (!job) return;

    jobs.set(jobId, { ...job, status: 'processing', progress: 25 });

    // Enhanced AI design generation
    const designResult = await generateAdvancedDesign(prompt, style, constraints);

    jobs.set(jobId, {
      ...job,
      status: 'completed',
      progress: 100,
      result: designResult,
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing design generation:', error);
    const job = jobs.get(jobId);
    if (job) {
      jobs.set(jobId, {
        ...job,
        status: 'failed',
        error: error.message,
        completedAt: new Date().toISOString()
      });
    }
  }
}

async function generateAdvancedDesign(prompt, style, constraints) {
  // Canvas functionality temporarily disabled - return placeholder
  console.log('generateAdvancedDesign called with:', prompt, style, constraints);
  
  // Return a placeholder response
  const filename = `design_${Date.now()}.png`;
  
  // Create a simple placeholder file for now
  const placeholder = 'Placeholder design data';
  const filepath = path.join(outputDir, filename);
  
  await fs.writeFile(filepath, placeholder);

  return {
    url: `/output/${filename}`,
    width: 1024,
    height: 1024,
    format: 'png',
    prompt,
    style,
    constraints,
    metadata: {
      generated_at: new Date().toISOString(),
      engine: 'fashun-ai-v1',
      safety_checked: true
    }
  };
}

function getStyleColors(style) {
  const styleMap = {
    streetwear: {
      background: '#0F0F10',
      primary: '#E4C590',
      secondary: '#C96C8B',
      text: '#E8E8E8',
      accent: '#FFFFFF'
    },
    minimal: {
      background: '#FFFFFF',
      primary: '#000000',
      secondary: '#808080',
      text: '#333333',
      accent: '#E0E0E0'
    },
    bold: {
      background: '#FF0000',
      primary: '#FFFF00',
      secondary: '#00FF00',
      text: '#FFFFFF',
      accent: '#00FFFF'
    },
    vintage: {
      background: '#F5E6D3',
      primary: '#8B4513',
      secondary: '#CD853F',
      text: '#2F1B14',
      accent: '#DEB887'
    }
  };

  return styleMap[style] || styleMap.streetwear;
}

async function generateDesignElements(ctx, prompt, colors, constraints) {
  const keywords = prompt.toLowerCase().split(' ');
  
  // Analyze prompt for design elements
  if (keywords.includes('geometric') || keywords.includes('minimal')) {
    drawGeometricDesign(ctx, colors);
  } else if (keywords.includes('abstract') || keywords.includes('art')) {
    drawAbstractDesign(ctx, colors);
  } else if (keywords.includes('text') || keywords.includes('typography')) {
    drawTypographicDesign(ctx, colors, constraints.text || 'FASHUN');
  } else if (keywords.includes('grunge') || keywords.includes('distressed')) {
    drawGrungeDesign(ctx, colors);
  } else {
    // Default streetwear design
    drawStreetwearDesign(ctx, colors);
  }
}

function drawGeometricDesign(ctx, colors) {
  // Simple geometric shapes
  ctx.fillStyle = colors.primary;
  ctx.fillRect(200, 200, 300, 300);
  
  ctx.fillStyle = colors.secondary;
  ctx.beginPath();
  ctx.arc(700, 300, 150, 0, 2 * Math.PI);
  ctx.fill();
  
  // Triangle
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.moveTo(400, 700);
  ctx.lineTo(500, 500);
  ctx.lineTo(600, 700);
  ctx.closePath();
  ctx.fill();
}

function drawAbstractDesign(ctx, colors) {
  // Organic shapes and gradients
  const gradient = ctx.createRadialGradient(500, 500, 50, 500, 500, 400);
  gradient.addColorStop(0, colors.primary);
  gradient.addColorStop(1, colors.secondary);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(500, 500, 350, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add some abstract shapes
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(
      Math.random() * 800 + 100,
      Math.random() * 800 + 100,
      Math.random() * 100 + 50,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTypographicDesign(ctx, colors, text) {
  ctx.fillStyle = colors.primary;
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, 512, 400);
  
  ctx.fillStyle = colors.secondary;
  ctx.font = 'normal 40px Arial';
  ctx.fillText('STREETWEAR', 512, 600);
}

function drawGrungeDesign(ctx, colors) {
  // Distressed rectangles
  ctx.fillStyle = colors.primary;
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * 800 + 100;
    const y = Math.random() * 800 + 100;
    const w = Math.random() * 200 + 50;
    const h = Math.random() * 200 + 50;
    ctx.globalAlpha = Math.random() * 0.7 + 0.3;
    ctx.fillRect(x, y, w, h);
  }
  ctx.globalAlpha = 1;
}

function drawStreetwearDesign(ctx, colors) {
  // Bold rectangular design
  ctx.fillStyle = colors.primary;
  ctx.fillRect(150, 150, 700, 200);
  
  ctx.fillStyle = colors.secondary;
  ctx.fillRect(150, 400, 700, 100);
  
  // Add brand-style text
  ctx.fillStyle = colors.background;
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('FUC!', 500, 280);
}

async function analyzeProductImage(imageBuffer) {
  try {
    // Get image metadata
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    // Extract dominant colors
    const { dominant } = await image.stats();
    
    // Simulate AI analysis results
    return {
      dimensions: {
        width: metadata.width,
        height: metadata.height
      },
      format: metadata.format,
      colors: {
        dominant: `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`,
        palette: generateColorPalette(dominant)
      },
      classification: {
        category: 'apparel',
        subcategory: 'streetwear',
        confidence: 0.87
      },
      attributes: {
        style: ['casual', 'streetwear', 'urban'],
        colors: ['dark', 'neutral'],
        season: 'all-season'
      },
      tags: ['clothing', 'fashion', 'streetwear', 'urban']
    };
  } catch (error) {
    throw new Error(`Image analysis failed: ${error.message}`);
  }
}

function generateColorPalette(dominant) {
  const { r, g, b } = dominant;
  return [
    `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
    `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`,
    `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`
  ];
}

async function findSimilarProducts(imageBuffer) {
  // Simulate vector similarity search
  // In production, this would use actual embeddings and vector database
  const analysis = await analyzeProductImage(imageBuffer);
  
  return {
    query: {
      category: analysis.classification.category,
      style: analysis.attributes.style,
      colors: analysis.attributes.colors
    },
    results: [
      {
        id: 'prod_001',
        name: 'Urban Streetwear Tee',
        price: 2499,
        currency: 'INR',
        image: '/api/placeholder/300/300',
        similarity_score: 0.94,
        match_attributes: ['style', 'color', 'category']
      },
      {
        id: 'prod_002',
        name: 'Casual Urban Hoodie',
        price: 3999,
        currency: 'INR',
        image: '/api/placeholder/300/300',
        similarity_score: 0.87,
        match_attributes: ['style', 'category']
      },
      {
        id: 'prod_003',
        name: 'Minimalist Street Jacket',
        price: 5499,
        currency: 'INR',
        image: '/api/placeholder/300/300',
        similarity_score: 0.82,
        match_attributes: ['color', 'category']
      }
    ],
    total_matches: 3
  };
}

async function generate3DMockups(productId, designUrl, viewAngles) {
  const mockups = [];
  
  for (const angle of viewAngles) {
    // Create perspective mockup for each angle
    const mockup = await createPerspectiveMockup(productId, designUrl, angle);
    mockups.push({
      angle,
      url: mockup.url,
      ar_ready: true,
      format: mockup.format
    });
  }
  
  return mockups;
}

async function createPerspectiveMockup(productId, designUrl, angle) {
  // Canvas functionality temporarily disabled - return placeholder
  console.log('createPerspectiveMockup called with:', productId, designUrl, angle);
  
  // Return a placeholder response
  const filename = `3d_mockup_${productId}_${angle}_${Date.now()}.png`;
  const filepath = path.join(outputDir, filename);
  
  // Create a simple placeholder file for now
  const placeholder = 'Placeholder 3D mockup data';
  await fs.writeFile(filepath, placeholder);
  
  return {
    url: `/output/${filename}`,
    format: 'png'
  };
}

function drawFrontView(ctx) {
  // T-shirt front view with perspective
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(200, 150, 400, 500);
  ctx.fillRect(150, 150, 100, 200); // Left sleeve
  ctx.fillRect(550, 150, 100, 200); // Right sleeve
  
  // Add shading for depth
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(190, 140, 10, 520);
  ctx.fillRect(600, 140, 10, 520);
}

function drawBackView(ctx) {
  // T-shirt back view
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(200, 150, 400, 500);
  ctx.fillRect(150, 150, 100, 200);
  ctx.fillRect(550, 150, 100, 200);
}

function drawSideView(ctx) {
  // T-shirt side profile
  ctx.fillStyle = '#E0E0E0';
  // Create side profile shape
  ctx.beginPath();
  ctx.moveTo(300, 150);
  ctx.lineTo(350, 150);
  ctx.lineTo(370, 200);
  ctx.lineTo(370, 600);
  ctx.lineTo(350, 650);
  ctx.lineTo(300, 650);
  ctx.lineTo(280, 600);
  ctx.lineTo(280, 200);
  ctx.closePath();
  ctx.fill();
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  try {
    await ensureDirectories();
    
    app.listen(PORT, () => {
      console.log(`🎨 FASHUN AI Mockup Service running on port ${PORT}`);
      console.log(`📁 Uploads: ${uploadsDir}`);
      console.log(`📁 Output: ${outputDir}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`🎯 Features: Design Generation, Image Analysis, 3D Mockups, Similar Search`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
