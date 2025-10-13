import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { ApiKeyService } from '@/lib/apiKeyService'

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
