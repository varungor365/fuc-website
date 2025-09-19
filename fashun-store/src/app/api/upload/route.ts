import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type and size
      const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
      
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Max size: ${file.type.startsWith('image/') ? '10MB' : '50MB'}` },
          { status: 400 }
        );
      }

      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not a supported media type` },
          { status: 400 }
        );
      }

      // Create FormData for Strapi upload
      const strapiFormData = new FormData();
      strapiFormData.append('files', file);

      // Upload to Strapi
      const uploadResponse = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: strapiFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Upload failed for ${file.name}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const uploadData = await uploadResponse.json();
      uploadedFiles.push(uploadData[0]);
    }

    return NextResponse.json(uploadedFiles);

  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
