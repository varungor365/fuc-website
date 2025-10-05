/**
 * Passwordless Authentication Service
 * Handles magic link authentication, social login, and WebAuthn
 */

interface AuthResult {
  success: boolean
  user?: {
    id: string
    email: string
    name?: string
    provider: string
  }
  error?: string
  token?: string
}

interface MagicLinkOptions {
  email: string
  redirectUrl?: string
}

interface WebAuthnCredential {
  id: string
  type: 'public-key'
  rawId: ArrayBuffer
  response: AuthenticatorAssertionResponse | AuthenticatorAttestationResponse
}

class PasswordlessAuthService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = '/api/auth', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Send magic link to email
   */
  async sendMagicLink(options: MagicLinkOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/send-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify(options)
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send magic link')
      }

      return { success: true }
    } catch (error) {
      console.error('Magic link error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send magic link' 
      }
    }
  }

  /**
   * Verify magic link token
   */
  async verifyMagicLink(token: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.baseUrl}/verify-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({ token })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Invalid magic link')
      }

      return {
        success: true,
        user: result.user,
        token: result.token
      }
    } catch (error) {
      console.error('Magic link verification error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid magic link' 
      }
    }
  }

  /**
   * Google OAuth Sign In
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      // For demo purposes, simulate Google OAuth flow
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            user: {
              id: 'google_user_123',
              email: 'user@gmail.com',
              name: 'John Doe',
              provider: 'google'
            },
            token: 'mock_google_token'
          })
        }, 1500)
      })
    } catch (error) {
      console.error('Google sign in error:', error)
      return { 
        success: false, 
        error: 'Google sign in failed' 
      }
    }
  }

  /**
   * Apple Sign In
   */
  async signInWithApple(): Promise<AuthResult> {
    try {
      // For demo purposes, simulate Apple Sign In flow
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            user: {
              id: 'apple_user_123',
              email: 'user@icloud.com',
              name: 'Jane Doe',
              provider: 'apple'
            },
            token: 'mock_apple_token'
          })
        }, 1500)
      })
    } catch (error) {
      console.error('Apple sign in error:', error)
      return { 
        success: false, 
        error: 'Apple sign in failed' 
      }
    }
  }

  /**
   * GitHub OAuth Sign In
   */
  async signInWithGitHub(): Promise<AuthResult> {
    try {
      // For demo purposes, simulate GitHub OAuth flow
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            user: {
              id: 'github_user_123',
              email: 'user@example.com',
              name: 'Developer',
              provider: 'github'
            },
            token: 'mock_github_token'
          })
        }, 1500)
      })
    } catch (error) {
      console.error('GitHub sign in error:', error)
      return { 
        success: false, 
        error: 'GitHub sign in failed' 
      }
    }
  }

  /**
   * Check if WebAuthn is supported
   */
  isWebAuthnSupported(): boolean {
    return !!(navigator.credentials && navigator.credentials.create)
  }

  /**
   * Register WebAuthn credential
   */
  async registerWebAuthn(email: string): Promise<AuthResult> {
    if (!this.isWebAuthnSupported()) {
      return { success: false, error: 'WebAuthn is not supported in this browser' }
    }

    try {
      // Get challenge from server (mocked for demo)
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'FASHUN Store',
            id: window.location.hostname
          },
          user: {
            id: new TextEncoder().encode(email),
            name: email,
            displayName: email
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          timeout: 60000,
          attestation: 'direct'
        }
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('Failed to create credential')
      }

      return {
        success: true,
        user: {
          id: 'webauthn_user_123',
          email,
          provider: 'webauthn'
        },
        token: 'mock_webauthn_token'
      }
    } catch (error) {
      console.error('WebAuthn registration error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'WebAuthn registration failed' 
      }
    }
  }

  /**
   * Authenticate with WebAuthn
   */
  async authenticateWebAuthn(): Promise<AuthResult> {
    if (!this.isWebAuthnSupported()) {
      return { success: false, error: 'WebAuthn is not supported in this browser' }
    }

    try {
      // Get challenge from server (mocked for demo)
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          rpId: window.location.hostname
        }
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('Authentication failed')
      }

      return {
        success: true,
        user: {
          id: 'webauthn_user_123',
          email: 'user@example.com',
          provider: 'webauthn'
        },
        token: 'mock_webauthn_token'
      }
    } catch (error) {
      console.error('WebAuthn authentication error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'WebAuthn authentication failed' 
      }
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        }
      })

      if (!response.ok) {
        throw new Error('Sign out failed')
      }

      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      }
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<AuthResult> {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        return { success: false, error: 'No active session' }
      }

      const response = await fetch(`${this.baseUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Session expired')
      }

      const user = await response.json()
      return {
        success: true,
        user,
        token
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user session' 
      }
    }
  }
}

// Export singleton instance
const passwordlessAuth = new PasswordlessAuthService()
export default passwordlessAuth

// Also export the class for custom instances
export { PasswordlessAuthService }
export type { AuthResult, MagicLinkOptions, WebAuthnCredential }