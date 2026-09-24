import type { Request, Response, NextFunction } from 'express';
import AppUser from '../models/AppUser.js';
import { hashPassword, issueToken, passwordMatches, type AuthUser, type UserRole } from '../middleware/auth.js';
import { data } from './helpers.js';
import { HttpError } from '../middleware/errorHandler.js';

function publicUser(user: { id: unknown; email: string; name: string; role: UserRole }): AuthUser {
  return { id: String(user.id), email: user.email, name: user.name, role: user.role };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role = 'donor' } = req.body as { name: string; email: string; password: string; role?: UserRole };
    const normalizedEmail = email.trim().toLowerCase();
    if (await AppUser.exists({ email: normalizedEmail })) throw new HttpError(409, 'Email is already registered');
    const credentials = hashPassword(password);
    const user = await AppUser.create({ name: name.trim(), email: normalizedEmail, role, ...{ passwordSalt: credentials.salt, passwordHash: credentials.hash } });
    const userInfo = publicUser({ id: user.id, name: String(user.name), email: String(user.email), role: user.role as UserRole });
    data(res, { token: issueToken(userInfo), user: userInfo }, 201);
  } catch (error) { next(error); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await AppUser.findOne({ email: email.trim().toLowerCase() }).select('+passwordSalt +passwordHash');
    if (!user || !passwordMatches(password, String(user.passwordSalt), String(user.passwordHash))) throw new HttpError(401, 'Email or password is incorrect');
    const userInfo = publicUser({ id: user.id, name: String(user.name), email: String(user.email), role: user.role as UserRole });
    data(res, { token: issueToken(userInfo), user: userInfo });
  } catch (error) { next(error); }
}

export function me(_req: Request, res: Response) {
  data(res, res.locals.authUser);
}

export async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email && !password) return;
  if (!email || !password || password.length < 12) throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) to create the bootstrap admin.');
  if (await AppUser.exists({ email })) return;
  const credentials = hashPassword(password);
  await AppUser.create({ name: 'Administrator', email, role: 'admin', passwordSalt: credentials.salt, passwordHash: credentials.hash });
  console.log(`Bootstrap administrator ready: ${email}`);
}
