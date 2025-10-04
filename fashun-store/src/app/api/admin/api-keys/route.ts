import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

// Encryption utilities
function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(16)
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    return text // Return original text if encryption fails (for development)
  }
}

function decrypt(text: string): string {
  try {
    const textParts = text.split(':')
    if (textParts.length !== 2) return text // Return original if not encrypted format
    const iv = Buffer.from(textParts[0], 'hex')
    const encryptedText = textParts[1]
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32)
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    return text // Return original text if decryption fails (for development)
  }
}

function maskKey(key: string): string {
  if (!key || key.length <= 8) return key
  return key.slice(0, 4) + '••••••••' + key.slice(-4)
}

// Mock data store - replace with database
let apiKeysStore: Record<string, any> = {
  openai: {
    id: 'openai',
    service: 'openai',
    keyName: 'API Key',
    keyValue: encrypt('sk-test-key-example'),
    status: 'active',
    lastTested: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  strapi: {
    id: 'strapi',
    service: 'strapi',
    keyName: 'API Token',
    keyValue: encrypt('strapi-token-example'),
    status: 'active',
    lastTested: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

function isAdminAuthenticated(request: NextRequest): boolean {
  // In production, implement proper admin authentication
  return true // Temporarily allow all requests for development
}

// GET - Fetch all API keys (masked)
export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const maskedKeys: Record<string, any> = {}
    
    for (const [service, keyData] of Object.entries(apiKeysStore)) {
      maskedKeys[service] = {
        ...keyData,
        keyValue: maskKey(keyData.keyValue ? decrypt(keyData.keyValue) : '')
      }
    }

    return NextResponse.json(maskedKeys)
    
  } catch (error) {
    console.error('API Keys fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

// POST - Create or update API key
export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { service, keyName, keyValue, secretValue } = body

    if (!service || !keyValue) {
      return NextResponse.json(
        { error: 'Service and keyValue are required' },
        { status: 400 }
      )
    }

    // Encrypt the key before storing
    const encryptedKey = encrypt(keyValue)
    const encryptedSecret = secretValue ? encrypt(secretValue) : null

    const keyData = {
      id: service,
      service,
      keyName: keyName || 'API Key',
      keyValue: encryptedKey,
      secretValue: encryptedSecret,
      status: 'active',
      lastTested: null,
      createdAt: apiKeysStore[service]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Store the key (in production, save to database)
    apiKeysStore[service] = keyData

    return NextResponse.json({ 
      message: 'API key saved successfully',
      service,
      status: 'active'
    })
    
  } catch (error) {
    console.error('API Key save error:', error)
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    )
  }
}

// PUT - Update existing API key
export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { service, keyValue, secretValue } = body

    if (!service || !apiKeysStore[service]) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Update the existing key
    const existingKey = apiKeysStore[service]
    existingKey.keyValue = encrypt(keyValue)
    if (secretValue) {
      existingKey.secretValue = encrypt(secretValue)
    }
    existingKey.updatedAt = new Date().toISOString()
    existingKey.status = 'active'
    existingKey.lastTested = null

    return NextResponse.json({ 
      message: 'API key updated successfully',
      service,
      status: 'active'
    })
    
  } catch (error) {
    console.error('API Key update error:', error)
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    )
  }
}

// DELETE - Remove API key
export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const service = url.searchParams.get('service')

    if (!service || !apiKeysStore[service]) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Delete the key
    delete apiKeysStore[service]

    return NextResponse.json({ 
      message: 'API key deleted successfully',
      service
    })
    
  } catch (error) {
    console.error('API Key delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}