import crypto from 'crypto';
import { prisma } from './prisma';

// Security: Require encryption key in production
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('ENCRYPTION_KEY environment variable is required in production');
}
const encryptionKey = ENCRYPTION_KEY || 'development-key-not-for-production';

// Enhanced encryption utilities with unique salts per operation
function encrypt(text: string): string {
  try {
    const salt = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(encryptionKey, salt, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Store salt:iv:encrypted for decryption
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

function decrypt(text: string): string {
  try {
    const parts = text.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format');
    }
    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const key = crypto.scryptSync(encryptionKey, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

function maskKey(key: string): string {
  if (!key || key.length <= 8) return key;
  return key.slice(0, 4) + '••••••••' + key.slice(-4);
}

// Audit logging utility
async function logAction(
  action: string,
  service: string,
  apiKeyId?: string,
  userId?: string,
  metadata?: any,
  req?: any
) {
  try {
    await prisma.apiKeyAuditLog.create({
      data: {
        action,
        service,
        apiKeyId,
        userId,
        userAgent: req?.headers?.['user-agent'],
        ipAddress: req?.headers?.['x-forwarded-for'] || req?.ip,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      }
    });
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't throw - audit logging failure shouldn't break the main flow
  }
}

export class ApiKeyService {
  static async getAllKeys(userId?: string) {
    try {
      const keys = await prisma.apiKey.findMany({
        select: {
          id: true,
          service: true,
          keyValue: true,
          secretValue: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          lastUsed: true,
        },
        orderBy: {
          service: 'asc'
        }
      });

      // Decrypt and mask keys for display
      return keys.map((key: any) => ({
        ...key,
        keyValue: key.keyValue ? maskKey(decrypt(key.keyValue)) : '',
        secretValue: key.secretValue ? maskKey(decrypt(key.secretValue)) : '',
      }));
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      throw new Error('Failed to fetch API keys');
    }
  }

  static async getKey(service: string, userId?: string) {
    try {
      const key = await prisma.apiKey.findUnique({
        where: { service }
      });

      if (!key) {
        return null;
      }

      // Decrypt for actual use
      return {
        ...key,
        keyValue: key.keyValue ? decrypt(key.keyValue) : '',
        secretValue: key.secretValue ? decrypt(key.secretValue) : '',
      };
    } catch (error) {
      console.error(`Failed to fetch API key for service ${service}:`, error);
      throw new Error('Failed to fetch API key');
    }
  }

  static async upsertKey(
    service: string,
    keyValue: string,
    secretValue?: string,
    userId?: string,
    req?: any
  ) {
    try {
      const encryptedKeyValue = encrypt(keyValue);
      const encryptedSecretValue = secretValue ? encrypt(secretValue) : null;

      const existingKey = await prisma.apiKey.findUnique({
        where: { service }
      });

      let apiKey;
      if (existingKey) {
        // Update existing key
        apiKey = await prisma.apiKey.update({
          where: { service },
          data: {
            keyValue: encryptedKeyValue,
            secretValue: encryptedSecretValue,
            updatedBy: userId,
            updatedAt: new Date(),
          }
        });

        await logAction('UPDATE', service, apiKey.id, userId, {
          hasSecretValue: !!secretValue
        }, req);
      } else {
        // Create new key
        apiKey = await prisma.apiKey.create({
          data: {
            service,
            keyValue: encryptedKeyValue,
            secretValue: encryptedSecretValue,
            createdBy: userId,
          }
        });

        await logAction('CREATE', service, apiKey.id, userId, {
          hasSecretValue: !!secretValue
        }, req);
      }

      return {
        ...apiKey,
        keyValue: maskKey(keyValue),
        secretValue: secretValue ? maskKey(secretValue) : null,
      };
    } catch (error) {
      console.error(`Failed to save API key for service ${service}:`, error);
      throw new Error('Failed to save API key');
    }
  }

  static async deleteKey(service: string, userId?: string, req?: any) {
    try {
      const existingKey = await prisma.apiKey.findUnique({
        where: { service }
      });

      if (!existingKey) {
        throw new Error('API key not found');
      }

      await prisma.apiKey.delete({
        where: { service }
      });

      await logAction('DELETE', service, existingKey.id, userId, null, req);

      return { success: true };
    } catch (error) {
      console.error(`Failed to delete API key for service ${service}:`, error);
      throw new Error('Failed to delete API key');
    }
  }

  static async updateLastUsed(service: string, userId?: string) {
    try {
      await prisma.apiKey.update({
        where: { service },
        data: {
          lastUsed: new Date(),
        }
      });

      await logAction('USE', service, undefined, userId);
    } catch (error) {
      console.error(`Failed to update last used for service ${service}:`, error);
      // Don't throw - this is not critical for the main flow
    }
  }

  static async getAuditLogs(service?: string, limit = 50, offset = 0) {
    try {
      const logs = await prisma.apiKeyAuditLog.findMany({
        where: service ? { service } : undefined,
        include: {
          apiKey: {
            select: {
              service: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        skip: offset
      });

      return logs;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }
  }

  // Method to test API key by making a test call to the service
  static async testKey(service: string, userId?: string, req?: any) {
    try {
      const keyData = await this.getKey(service, userId);
      if (!keyData) {
        throw new Error('API key not found');
      }

      await logAction('TEST', service, keyData.id, userId, null, req);
      await this.updateLastUsed(service, userId);

      // Return success - actual testing logic will be in the test endpoint
      return { success: true, message: 'Key retrieved for testing' };
    } catch (error) {
      await logAction('TEST_FAILED', service, undefined, userId, {
        error: error instanceof Error ? error.message : 'Unknown error'
      }, req);
      throw error;
    }
  }

  // Direct audit event logging method for external services
  static async logAuditEvent(event: {
    service: string;
    action: string;
    userId?: string;
    userAgent?: string;
    ipAddress?: string;
    metadata?: any;
  }) {
    try {
      await logAction(
        event.action,
        event.service,
        undefined, // No specific API key ID
        event.userId,
        {
          userAgent: event.userAgent,
          ipAddress: event.ipAddress,
          ...event.metadata
        },
        null // No request object
      );
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging should not break main functionality
    }
  }
}

export { encrypt, decrypt, maskKey, logAction };