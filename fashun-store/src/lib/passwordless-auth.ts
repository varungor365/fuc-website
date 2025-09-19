// Passwordless Authentication Service
'use client';

import { useState } from 'react';

interface AuthOptions {
  method: 'magic-link' | 'social' | 'passkey';
  email?: string;
  provider?: 'google' | 'apple' | 'github';
}

interface AuthResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
  sessionToken?: string;
}

class PasswordlessAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/auth';
  }

  // Magic Link Authentication
  async sendMagicLink(email: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.baseUrl}/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: `Magic link sent to ${email}. Check your inbox!`,
        };
      } else {
        return {
          success: false,
          message: data.error || 'Failed to send magic link',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Social Authentication
  async socialAuth(provider: 'google' | 'apple' | 'github'): Promise<AuthResult> {
    try {
      // In a real implementation, this would redirect to OAuth provider
      window.location.href = `${this.baseUrl}/oauth/${provider}`;
      
      return {
        success: true,
        message: `Redirecting to ${provider}...`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to authenticate with ${provider}`,
      };
    }
  }

  // WebAuthn/Passkey Authentication
  async authenticateWithPasskey(): Promise<AuthResult> {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        return {
          success: false,
          message: 'Passkeys are not supported on this device',
        };
      }

      // Get challenge from server
      const challengeResponse = await fetch(`${this.baseUrl}/webauthn/challenge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const challenge = await challengeResponse.json();

      if (!challengeResponse.ok) {
        return {
          success: false,
          message: 'Failed to get authentication challenge',
        };
      }

      // Create credential
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(challenge.challenge),
          allowCredentials: challenge.allowCredentials,
          timeout: 60000,
          userVerification: 'preferred',
        },
      });

      if (!credential) {
        return {
          success: false,
          message: 'Authentication was cancelled',
        };
      }

      // Verify credential with server
      const verifyResponse = await fetch(`${this.baseUrl}/webauthn/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: {
            id: credential.id,
            rawId: Array.from(new Uint8Array((credential as any).rawId)),
            response: {
              authenticatorData: Array.from(new Uint8Array((credential as any).response.authenticatorData)),
              clientDataJSON: Array.from(new Uint8Array((credential as any).response.clientDataJSON)),
              signature: Array.from(new Uint8Array((credential as any).response.signature)),
            },
            type: credential.type,
          },
        }),
      });

      const result = await verifyResponse.json();

      if (verifyResponse.ok) {
        return {
          success: true,
          message: 'Successfully authenticated with passkey!',
          sessionToken: result.sessionToken,
          redirectUrl: result.redirectUrl || '/account',
        };
      } else {
        return {
          success: false,
          message: result.error || 'Authentication failed',
        };
      }
    } catch (error) {
      console.error('Passkey authentication error:', error);
      return {
        success: false,
        message: 'Passkey authentication failed. Please try again.',
      };
    }
  }

  // Register new passkey
  async registerPasskey(email: string, displayName: string): Promise<AuthResult> {
    try {
      if (!window.PublicKeyCredential) {
        return {
          success: false,
          message: 'Passkeys are not supported on this device',
        };
      }

      // Get registration options from server
      const optionsResponse = await fetch(`${this.baseUrl}/webauthn/register/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, displayName }),
      });

      const options = await optionsResponse.json();

      if (!optionsResponse.ok) {
        return {
          success: false,
          message: 'Failed to get registration options',
        };
      }

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(options.challenge),
          rp: options.rp,
          user: {
            id: new Uint8Array(options.user.id),
            name: options.user.name,
            displayName: options.user.displayName,
          },
          pubKeyCredParams: options.pubKeyCredParams,
          timeout: 60000,
          attestation: 'direct',
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'preferred',
            requireResidentKey: true,
          },
        },
      });

      if (!credential) {
        return {
          success: false,
          message: 'Passkey registration was cancelled',
        };
      }

      // Register credential with server
      const registerResponse = await fetch(`${this.baseUrl}/webauthn/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: {
            id: credential.id,
            rawId: Array.from(new Uint8Array((credential as any).rawId)),
            response: {
              attestationObject: Array.from(new Uint8Array((credential as any).response.attestationObject)),
              clientDataJSON: Array.from(new Uint8Array((credential as any).response.clientDataJSON)),
            },
            type: credential.type,
          },
          email,
        }),
      });

      const result = await registerResponse.json();

      if (registerResponse.ok) {
        return {
          success: true,
          message: 'Passkey registered successfully!',
          sessionToken: result.sessionToken,
          redirectUrl: result.redirectUrl || '/account',
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to register passkey',
        };
      }
    } catch (error) {
      console.error('Passkey registration error:', error);
      return {
        success: false,
        message: 'Failed to register passkey. Please try again.',
      };
    }
  }

  // Check if user has existing passkeys
  async hasPasskeys(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/webauthn/has-passkeys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data.hasPasskeys || false;
    } catch (error) {
      return false;
    }
  }

  // Verify magic link token
  async verifyMagicLink(token: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${this.baseUrl}/magic-link/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Successfully authenticated!',
          sessionToken: data.sessionToken,
          redirectUrl: data.redirectUrl || '/account',
        };
      } else {
        return {
          success: false,
          message: data.error || 'Invalid or expired magic link',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to verify magic link',
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear local storage
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('user');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default PasswordlessAuthService;