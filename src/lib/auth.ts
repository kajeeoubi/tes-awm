import crypto from 'crypto';
import { AdminUser } from '@/types/ecommerce';

const JWT_SECRET = process.env.AUTH_SECRET || 'sparke-admin-super-secret-key-2026-secure-jwt';
export const ADMIN_COOKIE_NAME = 'sparke_admin_session';

/**
 * Hash password with PBKDF2 and salt
 */
export function hashPassword(password: string, customSalt?: string): string {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored hash (salt:hash or fallback plain)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !password) return false;
  if (!storedHash.includes(':')) {
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

/**
 * Create a simple secure signed token payload for admin session
 */
export function createSessionToken(user: AdminUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar_url: user.avatar_url,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verify session token and return admin user or null
 */
export function verifySessionToken(token: string): AdminUser | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar_url: payload.avatar_url,
    };
  } catch {
    return null;
  }
}
