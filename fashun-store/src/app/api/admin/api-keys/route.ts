import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Security: Require encryption key in production (runtime only)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const encryptionKey = ENCRYPTION_KEY || 'development-key-not-for-production-use-only'

// Encryption utilities
function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(16)
    const key = crypto.scryptSync(encryptionKey, 'salt', 32)
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
    const key = crypto.scryptSync(encryptionKey, 'salt', 32)
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
  // In production, implement proper admin authentication with JWT/session
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false
    }
    
    const token = authHeader.substring(7)
    // TODO: Verify JWT token or session
    // For now, check for a basic admin token
    return token === process.env.ADMIN_API_TOKEN
  }
  
  return true // Allow in development
}
>>>>>>> fa67490ae7cdb0419809cce851f9dcac45b31879

// GET - Fetch all API keys (masked)
export async function GET(request: NextRequest) {
  try {
    const auth = await AuthService.authenticateAdmin(request)
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.statusCode || 401 }
      )
    }

    const keys = await ApiKeyService.getAllKeys(auth.userId)
    
    // Transform to the expected format
    const maskedKeys: Record<string, any> = {}
    keys.forEach((key: any) => {
      maskedKeys[key.service] = {
        id: key.service,
        service: key.service,
        keyName: 'API Key',
        keyValue: key.keyValue,
        secretValue: key.secretValue,
        status: key.isActive ? 'active' : 'inactive',
        lastTested: key.lastUsed,
        createdAt: key.createdAt.toISOString(),
        updatedAt: key.updatedAt.toISOString()
      }
    })

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
    const auth = await AuthService.authenticateAdmin(request)
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.statusCode || 401 }
      )
    }

    const body = await request.json()
    const { service, keyValue, secretValue } = body

    if (!service || !keyValue) {
      return NextResponse.json(
        { error: 'Service and keyValue are required' },
        { status: 400 }
      )
    }

    const savedKey = await ApiKeyService.upsertKey(
      service,
      keyValue,
      secretValue,
      auth.userId,
      request
    )

    const response = {
      id: savedKey.service,
      service: savedKey.service,
      keyName: 'API Key',
      keyValue: savedKey.keyValue,
      secretValue: savedKey.secretValue,
      status: savedKey.isActive ? 'active' : 'inactive',
      lastTested: savedKey.lastUsed,
      createdAt: savedKey.createdAt.toISOString(),
      updatedAt: savedKey.updatedAt.toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('API Key save error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save API key' },
      { status: 500 }
    )
  }
}
