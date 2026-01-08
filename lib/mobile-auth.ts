/**
 * Mobile Authentication Library
 *
 * Handles authentication for iOS mobile apps using Sign In with Apple and Google Sign In.
 * Provides token verification, user management, and session handling.
 */

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { OAuth2Client } from "google-auth-library";
import { db } from "@/lib/database";
import type { User, MobileSession, Account } from "@prisma/client";

// Environment configuration
const APPLE_BUNDLE_ID =
  process.env.APPLE_BUNDLE_ID || "com.brucelee.FortuneCookieAI";
const GOOGLE_IOS_CLIENT_ID =
  process.env.GOOGLE_IOS_CLIENT_ID ||
  "781267846794-3mnq8a4lppp2b3o6khm7iikv3t4s7juo.apps.googleusercontent.com";

// Session expiry: 30 days
const SESSION_EXPIRY_DAYS = 30;

// Apple JWKS client with caching
const appleJwksClient = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
  cache: true,
  cacheMaxAge: 86400000, // 24 hours in milliseconds
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});

// Google OAuth client
const googleOAuthClient = new OAuth2Client(GOOGLE_IOS_CLIENT_ID);

// Types
export interface AppleTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string; // User identifier
  email?: string;
  email_verified?: string | boolean;
  is_private_email?: string | boolean;
  nonce?: string;
  nonce_supported?: boolean;
  real_user_status?: number;
}

export interface GoogleTokenPayload {
  sub: string; // User identifier
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface UserData {
  email?: string | null;
  name?: string | null;
}

export interface MobileAuthResult {
  user: User;
  session: MobileSession;
}

/**
 * Get Apple's public key for JWT verification
 */
async function getApplePublicKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    appleJwksClient.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      if (!key) {
        reject(new Error("No signing key found"));
        return;
      }
      const publicKey = key.getPublicKey();
      resolve(publicKey);
    });
  });
}

/**
 * Verify Apple identity token
 *
 * @param identityToken - JWT from Apple Sign In
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export async function verifyAppleToken(
  identityToken: string,
): Promise<AppleTokenPayload> {
  // Decode header to get key ID
  const decodedHeader = jwt.decode(identityToken, { complete: true });
  if (!decodedHeader || typeof decodedHeader === "string") {
    throw new Error("Invalid token format");
  }

  const kid = decodedHeader.header.kid;
  if (!kid) {
    throw new Error("Token missing key ID");
  }

  // Get Apple's public key
  const publicKey = await getApplePublicKey(kid);

  // Verify the token
  const decoded = jwt.verify(identityToken, publicKey, {
    algorithms: ["RS256"],
    issuer: "https://appleid.apple.com",
    audience: APPLE_BUNDLE_ID,
  }) as AppleTokenPayload;

  return decoded;
}

/**
 * Verify Google ID token
 *
 * @param idToken - Google ID token
 * @returns Decoded token payload
 * @throws Error if token is invalid
 */
export async function verifyGoogleToken(
  idToken: string,
): Promise<GoogleTokenPayload> {
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken,
    audience: GOOGLE_IOS_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    email_verified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
    given_name: payload.given_name,
    family_name: payload.family_name,
  };
}

/**
 * Generate a secure random session token
 */
export function generateSecureToken(): string {
  return crypto.randomUUID();
}

/**
 * Find or create a user for mobile authentication
 *
 * Uses the Account model to store provider-specific identifiers,
 * matching NextAuth's pattern for consistency.
 *
 * @param provider - "apple" or "google"
 * @param providerUserId - Provider's unique user identifier
 * @param userData - User's email and name (may only be available on first auth)
 * @returns User record
 */
export async function findOrCreateMobileUser(
  provider: "apple" | "google",
  providerUserId: string,
  userData: UserData,
): Promise<User> {
  // Try to find existing account by provider + providerAccountId
  const existingAccount = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: provider,
        providerAccountId: providerUserId,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingAccount) {
    // Update user info if we have new data (Apple only sends name/email on first auth)
    if (userData.name || userData.email) {
      const updateData: { name?: string; email?: string } = {};
      if (userData.name && !existingAccount.user.name) {
        updateData.name = userData.name;
      }
      if (userData.email && !existingAccount.user.email) {
        updateData.email = userData.email;
      }

      if (Object.keys(updateData).length > 0) {
        return db.user.update({
          where: { id: existingAccount.user.id },
          data: updateData,
        });
      }
    }
    return existingAccount.user;
  }

  // Check if user exists by email (to link accounts)
  let user: User | null = null;
  if (userData.email) {
    user = await db.user.findUnique({
      where: { email: userData.email },
    });
  }

  // Create new user if not found by email
  if (!user) {
    user = await db.user.create({
      data: {
        email: userData.email,
        name: userData.name,
      },
    });
  }

  // Create account link for mobile provider
  await db.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider: provider,
      providerAccountId: providerUserId,
    },
  });

  return user;
}

/**
 * Create a new mobile session
 *
 * @param userId - User ID
 * @param provider - Authentication provider
 * @param deviceId - Optional device identifier
 * @returns New mobile session
 */
export async function createMobileSession(
  userId: string,
  provider: string,
  deviceId?: string,
): Promise<MobileSession> {
  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  return db.mobileSession.create({
    data: {
      token,
      userId,
      provider,
      deviceId,
      expiresAt,
    },
  });
}

/**
 * Validate a mobile session token
 *
 * @param token - Session token from Authorization header
 * @returns User and session if valid, null if invalid or expired
 */
export async function validateMobileSession(
  token: string,
): Promise<MobileAuthResult | null> {
  const session = await db.mobileSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    // Clean up expired session
    await db.mobileSession.delete({ where: { id: session.id } });
    return null;
  }

  return {
    user: session.user,
    session,
  };
}

/**
 * Revoke a mobile session (sign out)
 *
 * @param token - Session token to revoke
 * @returns true if session was found and deleted
 */
export async function revokeMobileSession(token: string): Promise<boolean> {
  try {
    await db.mobileSession.delete({ where: { token } });
    return true;
  } catch {
    // Session not found
    return false;
  }
}

/**
 * Clean up expired mobile sessions
 * Can be called periodically or via cron job
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await db.mobileSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}

/**
 * Get user's active mobile sessions
 *
 * @param userId - User ID
 * @returns List of active sessions
 */
export async function getUserMobileSessions(
  userId: string,
): Promise<MobileSession[]> {
  return db.mobileSession.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Find user's account by provider
 *
 * @param userId - User ID
 * @param provider - Provider name
 * @returns Account if found
 */
export async function findUserAccount(
  userId: string,
  provider: string,
): Promise<Account | null> {
  return db.account.findFirst({
    where: {
      userId,
      provider,
    },
  });
}
