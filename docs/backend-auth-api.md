# Backend Authentication API Documentation

> **✅ IMPLEMENTED** - All endpoints described in this document have been implemented.
> 
> **Implementation Files:**
> - `lib/mobile-auth.ts` - Token verification and session management
> - `app/api/auth/mobile/apple/route.ts` - Apple Sign In endpoint
> - `app/api/auth/mobile/google/route.ts` - Google Sign In endpoint  
> - `app/api/auth/mobile/session/route.ts` - Mobile-only session validation endpoint
> - `app/api/auth/session/route.ts` - **Unified session endpoint** (supports both web and mobile)
> - `prisma/schema.prisma` - MobileSession model

This document describes the backend API endpoints required for iOS mobile authentication with Sign In with Apple and Google Sign In.

## Overview

The iOS app sends OAuth tokens from Apple/Google to the backend, which validates them and returns a session token with user information.

**Base URL**: `https://www.fortunecookie.vip`

---

## API Endpoints

### 1. POST `/api/auth/mobile/apple`

Authenticate a user with Sign In with Apple credentials.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "identityToken": "string",      // JWT from Apple (required)
  "authorizationCode": "string",  // Authorization code from Apple (required)
  "userIdentifier": "string",     // Apple's unique user ID (required)
  "fullName": "string | null",    // User's full name (only on first auth)
  "email": "string | null"        // User's email (may be private relay)
}
```

#### Response (Success - 200)
```json
{
  "token": "string",              // Your app's session token
  "user": {
    "id": "string",               // Your internal user ID
    "email": "string | null",     // User's email
    "name": "string | null",      // User's display name
    "provider": "apple",          // Always "apple"
    "createdAt": "string"         // ISO 8601 timestamp
  }
}
```

#### Response (Error - 400/401/500)
```json
{
  "error": "string",              // Error code
  "message": "string"             // Human-readable message
}
```

#### Implementation Notes

1. **Validate the Identity Token (JWT)**:
   - Verify signature using Apple's public keys from `https://appleid.apple.com/auth/keys`
   - Check `iss` claim equals `https://appleid.apple.com`
   - Check `aud` claim matches your App ID (Bundle Identifier)
   - Check `exp` claim is not expired
   - Extract `sub` claim as the user identifier

2. **Handle First-Time vs Returning Users**:
   - `fullName` and `email` are only provided on first authorization
   - Store these values; Apple won't send them again
   - On subsequent logins, look up user by `userIdentifier`

3. **Private Relay Email**:
   - Users may choose to hide their email
   - Apple provides a private relay email like `xyz123@privaterelay.appleid.com`
   - This email forwards to the user's real email

#### Example Implementation (Next.js)

```typescript
// app/api/auth/mobile/apple/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys',
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

async function getApplePublicKey(kid: string): Promise<string> {
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identityToken, authorizationCode, userIdentifier, fullName, email } = body;

    // Decode JWT header to get key ID
    const decodedHeader = jwt.decode(identityToken, { complete: true });
    if (!decodedHeader) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
    }

    // Get Apple's public key
    const publicKey = await getApplePublicKey(decodedHeader.header.kid);

    // Verify the token
    const decoded = jwt.verify(identityToken, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: 'com.brucelee.FortuneCookieAI', // Your Bundle ID
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: {
        provider_providerUserId: {
          provider: 'apple',
          providerUserId: userIdentifier,
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          provider: 'apple',
          providerUserId: userIdentifier,
          email: email || (decoded as any).email,
          name: fullName,
        },
      });
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: 'apple',
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    return NextResponse.json({ error: 'auth_failed' }, { status: 401 });
  }
}
```

---

### 2. POST `/api/auth/mobile/google`

Authenticate a user with Google Sign In credentials.

#### Request Headers
```
Content-Type: application/json
```

#### Request Body
```json
{
  "idToken": "string",            // Google ID Token (required)
  "accessToken": "string"         // Google Access Token (required)
}
```

#### Response (Success - 200)
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string | null",
    "name": "string | null",
    "provider": "google",
    "createdAt": "string"
  }
}
```

#### Response (Error - 400/401/500)
```json
{
  "error": "string",
  "message": "string"
}
```

#### Implementation Notes

1. **Validate the ID Token**:
   - Use Google's token verification endpoint or library
   - Verify `aud` claim matches your Google Client ID
   - Check `exp` claim is not expired
   - Extract user info from token claims

2. **Google Client ID**:
   - iOS Client ID: `781267846794-3mnq8a4lppp2b3o6khm7iikv3t4s7juo.apps.googleusercontent.com`

#### Example Implementation (Next.js)

```typescript
// app/api/auth/mobile/google/route.ts
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, accessToken } = body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: '781267846794-3mnq8a4lppp2b3o6khm7iikv3t4s7juo.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
    }

    const { sub: googleUserId, email, name } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: {
        provider_providerUserId: {
          provider: 'google',
          providerUserId: googleUserId,
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          provider: 'google',
          providerUserId: googleUserId,
          email,
          name,
        },
      });
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: 'google',
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json({ error: 'auth_failed' }, { status: 401 });
  }
}
```

---

### 3. GET `/api/auth/session` (Unified Endpoint - Recommended)

Validate session for **both web and mobile** clients. This is the recommended endpoint for session validation.

#### Authentication Methods

**Option A: Mobile (Bearer Token)**
```
Authorization: Bearer {mobile_session_token}
```

**Option B: Web (Cookie)**
- No header required; uses NextAuth session cookie automatically

#### Response (Success - 200)
```json
{
  "user": {
    "id": "string",
    "email": "string | null",
    "name": "string | null",
    "image": "string | null"
  },
  "source": "web" | "mobile"
}
```

#### Response (Error - 401)
```json
{
  "error": "unauthorized",
  "message": "No valid session found"
}
```

#### CORS Support
- CORS headers enabled for mobile app access
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

#### Example Usage

```bash
# Mobile client
curl https://www.fortunecookie.vip/api/auth/session \
  -H "Authorization: Bearer your-mobile-session-token"

# Web client (with cookie)
curl https://www.fortunecookie.vip/api/auth/session \
  --cookie "next-auth.session-token=..."
```

---

### 4. GET `/api/auth/mobile/session` (Mobile-Only, Legacy)

Validate a mobile session only. Use `/api/auth/session` for new implementations.

#### Request Headers
```
Authorization: Bearer {session_token}
```

#### Response (Success - 200)
```json
{
  "id": "string",
  "email": "string | null",
  "name": "string | null",
  "provider": "apple" | "google",
  "createdAt": "string"
}
```

#### Response (Error - 401)
```json
{
  "error": "session_expired",
  "message": "Session has expired. Please sign in again."
}
```

---

## Database Schema (Prisma)

```prisma
// schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String?
  name          String?
  provider      String    // "apple" | "google"
  providerUserId String   // Apple userIdentifier or Google sub
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  
  @@unique([provider, providerUserId])
  @@index([email])
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
}
```

---

## Required NPM Packages

```bash
npm install jsonwebtoken jwks-rsa google-auth-library @prisma/client
npm install -D @types/jsonwebtoken prisma
```

---

## Environment Variables

```env
# .env.local

# Database
DATABASE_URL="postgresql://..."

# Google OAuth (iOS Client ID)
GOOGLE_CLIENT_ID=781267846794-3mnq8a4lppp2b3o6khm7iikv3t4s7juo.apps.googleusercontent.com

# Apple Sign In (Your App Bundle ID)
APPLE_BUNDLE_ID=com.brucelee.FortuneCookieAI
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `invalid_token` | 401 | Token verification failed |
| `session_expired` | 401 | Session token has expired |
| `unauthorized` | 401 | Missing or invalid authorization header |
| `auth_failed` | 401 | General authentication failure |
| `server_error` | 500 | Internal server error |

---

## Security Considerations

1. **Token Storage**: Store session tokens securely; consider short-lived tokens with refresh
2. **HTTPS Only**: All endpoints must use HTTPS
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **Token Expiry**: Sessions expire after 30 days by default
5. **Revocation**: Support for token revocation on sign out (optional)

---

## Testing

### Mock Mode (iOS)

The iOS app includes a mock authentication mode for development:

```swift
// In AuthService.swift
#if DEBUG
AuthService.useMockAuth = true  // Enable mock mode
#endif
```

When mock mode is enabled, the app will:
- Simulate network delay (500ms)
- Return fake user data without calling the backend
- Allow full testing of the auth flow UI

### Backend Testing

Test the endpoints using curl:

```bash
# Test Apple auth (with actual token from iOS app)
curl -X POST https://www.fortunecookie.vip/api/auth/mobile/apple \
  -H "Content-Type: application/json" \
  -d '{
    "identityToken": "eyJ...",
    "authorizationCode": "c123...",
    "userIdentifier": "001234.abc...",
    "fullName": "Test User",
    "email": "test@example.com"
  }'

# Test session validation
curl https://www.fortunecookie.vip/api/auth/session \
  -H "Authorization: Bearer your-session-token"
```

---

## Implementation Checklist

- [ ] Create Prisma schema and run migration
- [ ] Implement POST `/api/auth/mobile/apple`
- [ ] Implement POST `/api/auth/mobile/google`
- [ ] Implement GET `/api/auth/session`
- [ ] Add error handling and logging
- [ ] Test with iOS app (disable mock mode)
- [ ] Deploy to production
