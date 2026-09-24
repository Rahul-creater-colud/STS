import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from './errorHandler.js';

export type UserRole = 'admin' | 'donor' | 'ngo' | 'volunteer';
export interface AuthUser { id: string; email: string; name: string; role: UserRole }

const developmentSecret = randomBytes(32).toString('base64url');

function secret(): string {
  const value = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!value || value.length < 32)) {
    throw new Error('Set JWT_SECRET to a random value of at least 32 characters in production.');
  }
  return value || developmentSecret;
}

const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(password, salt, 64).toString('hex') };
}

export function passwordMatches(password: string, salt: string, expected: string): boolean {
  const actual = Buffer.from(hashPassword(password, salt).hash, 'hex');
  const saved = Buffer.from(expected, 'hex');
  return actual.length === saved.length && timingSafeEqual(actual, saved);
}

export function issueToken(user: AuthUser): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({ ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 });
  const input = `${header}.${payload}`;
  return `${input}.${createHmac('sha256', secret()).update(input).digest('base64url')}`;
}

export function readToken(token: string): AuthUser | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;
    const input = `${header}.${payload}`;
    const expected = createHmac('sha256', secret()).update(input).digest();
    const received = Buffer.from(signature, 'base64url');
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as AuthUser & { exp?: number };
    if (!decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!decoded.id || !decoded.email || !decoded.name || !['admin', 'donor', 'ngo', 'volunteer'].includes(decoded.role)) return null;
    return { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role };
  } catch {
    return null;
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  const user = token ? readToken(token) : null;
  if (!user) { next(new HttpError(401, 'Login required')); return; }
  res.locals.authUser = user;
  next();
}

export function allowRoles(...roles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.authUser as AuthUser | undefined;
    if (!user) { next(new HttpError(401, 'Login required')); return; }
    if (!roles.includes(user.role)) { next(new HttpError(403, 'You do not have permission for this action')); return; }
    next();
  };
}
