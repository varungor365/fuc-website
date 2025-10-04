import sharp from 'sharp';
import { generateQRCodeBuffer } from './qrcode';

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

    // Load the template image
    const templatePath = `public/templates/${options.template}.png`;
    
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

export async function createCustomMockup(
  profileUrl: string,
  templateBuffer: Buffer,
  options: Omit<MockupOptions, 'template'>
): Promise<Buffer> {
  try {
    // Generate QR code for the profile URL
    const qrBuffer = await generateQRCodeBuffer(profileUrl, {
      width: options.qrPosition.width,
      margin: 1
    });

    // Apply styles to QR code if specified
    let processedQR = sharp(qrBuffer);
    
    if (options.qrStyle?.borderRadius) {
      // Create a rounded mask for the QR code
      const mask = Buffer.from(
        `<svg width="${options.qrPosition.width}" height="${options.qrPosition.height}">
          <rect width="100%" height="100%" rx="${options.qrStyle.borderRadius}" ry="${options.qrStyle.borderRadius}" fill="white"/>
        </svg>`
      );
      
      processedQR = processedQR.composite([{ input: mask, blend: 'dest-in' }]);
    }

    if (options.qrStyle?.opacity && options.qrStyle.opacity < 1) {
      processedQR = processedQR.modulate({ brightness: options.qrStyle.opacity });
    }

    const finalQRBuffer = await processedQR.png().toBuffer();

    // Create the mockup by compositing the QR code onto the template
    const mockupBuffer = await sharp(templateBuffer)
      .composite([
        {
          input: finalQRBuffer,
          top: options.qrPosition.y,
          left: options.qrPosition.x,
          blend: 'over'
        }
      ])
      .png()
      .toBuffer();

    return mockupBuffer;
  } catch (error) {
    console.error('Error creating custom mockup:', error);
    throw new Error('Failed to create custom mockup');
  }
}