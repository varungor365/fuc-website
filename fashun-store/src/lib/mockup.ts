import sharp from 'sharp';
import { generateQRCodeBuffer } from './qrcode';
import path from 'path';

export interface MockupOptions {
  template: 'tshirt-front' | 'tshirt-back' | 'hoodie-front' | 'hoodie-back';
  qrPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  qrStyle?: {
    borderRadius?: number;
    opacity?: number;
  };
}

export async function createMockup(
  profileUrl: string,
  options: MockupOptions
): Promise<Buffer> {
  try {
    // Generate QR code for the profile URL
    const qrBuffer = await generateQRCodeBuffer(profileUrl, {
      width: options.qrPosition.width,
      margin: 1
    });

    // Load the template image from public directory
    const templatePath = path.join(process.cwd(), 'public', 'templates', `${options.template}.png`);
    
    // Create the mockup by compositing the QR code onto the template
    const mockupBuffer = await sharp(templatePath)
      .composite([
        {
          input: qrBuffer,
          top: options.qrPosition.y,
          left: options.qrPosition.x,
          blend: 'over'
        }
      ])
      .png()
      .toBuffer();

    return mockupBuffer;
  } catch (error) {
    console.error('Error creating mockup:', error);
    throw new Error('Failed to create mockup');
  }
}

export const defaultMockupPositions = {
  'tshirt-front': {
    x: 325,
    y: 200,
    width: 250,
    height: 250
  },
  'tshirt-back': {
    x: 325,
    y: 200,
    width: 250,
    height: 250
  },
  'hoodie-front': {
    x: 350,
    y: 220,
    width: 200,
    height: 200
  },
  'hoodie-back': {
    x: 350,
    y: 220,
    width: 200,
    height: 200
  }
};

export async function createQuickMockup(
  userId: string,
  template: string = 'tshirt-front'
): Promise<Buffer> {
  const profileUrl = `https://fashun.co.in/profile/${userId}`;
  
  const templateKey = template as keyof typeof defaultMockupPositions;
  const position = defaultMockupPositions[templateKey] || defaultMockupPositions['tshirt-front'];
  
  const options: MockupOptions = {
    template: templateKey,
    qrPosition: position
  };

  return await createMockup(profileUrl, options);
}