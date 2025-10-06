import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const faceFile = formData.get('face') as File;
    const productId = formData.get('productId') as string;
    const color = formData.get('color') as string;

    if (!faceFile) {
      return NextResponse.json({ error: 'No face image provided' }, { status: 400 });
    }

    const faceBuffer = Buffer.from(await faceFile.arrayBuffer());
    
    // Get T-shirt template based on color
    const templatePath = join(process.cwd(), 'public', 'mockup-templates', `tshirt-${color}.png`);
    const fallbackTemplate = join(process.cwd(), 'public', 'mockup-templates', 'tshirt-black.png');
    
    const template = existsSync(templatePath) ? templatePath : fallbackTemplate;

    // Process face image - resize and add border
    const processedFace = await sharp(faceBuffer)
      .resize(400, 400, { fit: 'cover' })
      .png()
      .toBuffer();

    // Overlay face on T-shirt template
    const mockup = await sharp(template)
      .composite([
        {
          input: processedFace,
          top: 180,
          left: 310,
        },
      ])
      .png()
      .toBuffer();

    // Save mockup
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'mockups');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filename = `mockup-${productId}-${Date.now()}.png`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, mockup);

    const mockupUrl = `/uploads/mockups/${filename}`;

    return NextResponse.json({ mockupUrl, success: true });
  } catch (error) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate mockup', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
