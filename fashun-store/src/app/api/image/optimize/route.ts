import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const { sourceUrl, width, height, format = 'png', quality = 90 } = await request.json()

    if (!sourceUrl) {
      return NextResponse.json({ error: 'Source URL is required' }, { status: 400 })
    }

    // Fetch the source image
    const imageResponse = await fetch(sourceUrl)
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch source image' }, { status: 400 })
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    // Process with Sharp
    let processedImage = sharp(imageBuffer)

    if (width && height) {
      processedImage = processedImage.resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
    }

    // Set format and quality
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        processedImage = processedImage.jpeg({ quality })
        break
      case 'png':
        processedImage = processedImage.png({ quality })
        break
      case 'webp':
        processedImage = processedImage.webp({ quality })
        break
    }

    const optimizedBuffer = await processedImage.toBuffer()

    // Return the optimized image
    return new NextResponse(optimizedBuffer as BodyInit, {
      headers: {
        'Content-Type': `image/${format}`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })

  } catch (error) {
    console.error('Image optimization error:', error)
    return NextResponse.json({ error: 'Failed to optimize image' }, { status: 500 })
  }
}