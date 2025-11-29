/**
 * @jest-environment node
 */

import {
  RequestSigner,
  SignatureValidator,
  ApiKeyManager,
  NonceManager,
  ClientSigner,
  SIGNATURE_HEADERS,
} from "@/lib/api-signature";

describe("API Signature", () => {
  const testSecret = "test-secret-key";
  const testKeyId = "test-key-001";
  const testMethod = "POST";
  const testPath = "/api/test";
  const testBody = '{"test": "data"}';
  const testTimestamp = Math.floor(Date.now() / 1000);
  const testNonce = "test-nonce-123";

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset API key manager
    ApiKeyManager["keys"] = new Map();

    // Add test key
    ApiKeyManager.addKey({
      id: testKeyId,
      secret: testSecret,
      name: "Test Key",
      permissions: ["*"],
      createdAt: new Date(),
      isActive: true,
    });
  });

  describe("RequestSigner", () => {
    it("generates consistent signatures for same input", () => {
      const signature1 = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      const signature2 = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      expect(signature1).toBe(signature2);
      expect(signature1).toHaveLength(64); // SHA256 hex length
    });

    it("generates different signatures for different inputs", () => {
      const signature1 = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      const signature2 = RequestSigner.generateSignature(
        testSecret,
        "GET", // Different method
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      expect(signature1).not.toBe(signature2);
    });

    it("verifies valid signatures", () => {
      const signature = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      const isValid = RequestSigner.verifySignature(
        testSecret,
        signature,
        testMethod,
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      expect(isValid).toBe(true);
    });

    it("rejects invalid signatures", () => {
      const invalidSignature = "invalid-signature";

      const isValid = RequestSigner.verifySignature(
        testSecret,
        invalidSignature,
        testMethod,
        testPath,
        testBody,
        testTimestamp,
        testNonce,
      );

      expect(isValid).toBe(false);
    });

    it("validates timestamps within tolerance", () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const validTimestamp = currentTime - 100; // 100 seconds ago

      expect(RequestSigner.verifyTimestamp(validTimestamp)).toBe(true);
    });

    it("rejects timestamps outside tolerance", () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiredTimestamp = currentTime - 400; // 400 seconds ago (> 300s tolerance)

      expect(RequestSigner.verifyTimestamp(expiredTimestamp)).toBe(false);
    });

    it("generates random nonces", () => {
      const nonce1 = RequestSigner.generateNonce();
      const nonce2 = RequestSigner.generateNonce();

      expect(nonce1).not.toBe(nonce2);
      expect(nonce1).toHaveLength(32); // 16 bytes * 2 (hex)
      expect(nonce2).toHaveLength(32);
    });
  });

  describe("ApiKeyManager", () => {
    it("retrieves existing API keys", () => {
      const key = ApiKeyManager.getKey(testKeyId);

      expect(key).toBeTruthy();
      expect(key?.id).toBe(testKeyId);
      expect(key?.secret).toBe(testSecret);
    });

    it("returns null for non-existent keys", () => {
      const key = ApiKeyManager.getKey("non-existent-key");

      expect(key).toBeNull();
    });

    it("returns null for inactive keys", () => {
      ApiKeyManager.addKey({
        id: "inactive-key",
        secret: "inactive-secret",
        name: "Inactive Key",
        permissions: ["*"],
        createdAt: new Date(),
        isActive: false,
      });

      const key = ApiKeyManager.getKey("inactive-key");

      expect(key).toBeNull();
    });

    it("returns null for expired keys", () => {
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

      ApiKeyManager.addKey({
        id: "expired-key",
        secret: "expired-secret",
        name: "Expired Key",
        permissions: ["*"],
        createdAt: new Date(),
        expiresAt: expiredDate,
        isActive: true,
      });

      const key = ApiKeyManager.getKey("expired-key");

      expect(key).toBeNull();
    });

    it("checks permissions correctly", () => {
      // Test wildcard permission
      expect(ApiKeyManager.hasPermission(testKeyId, "any-permission")).toBe(
        true,
      );

      // Add key with specific permissions
      ApiKeyManager.addKey({
        id: "limited-key",
        secret: "limited-secret",
        name: "Limited Key",
        permissions: ["read", "write"],
        createdAt: new Date(),
        isActive: true,
      });

      expect(ApiKeyManager.hasPermission("limited-key", "read")).toBe(true);
      expect(ApiKeyManager.hasPermission("limited-key", "write")).toBe(true);
      expect(ApiKeyManager.hasPermission("limited-key", "admin")).toBe(false);
    });
  });

  describe("NonceManager", () => {
    beforeEach(() => {
      NonceManager["usedNonces"] = new Set();
    });

    it("tracks used nonces", () => {
      const nonce = "test-nonce";

      expect(NonceManager.isNonceUsed(nonce)).toBe(false);

      NonceManager.markNonceAsUsed(nonce);

      expect(NonceManager.isNonceUsed(nonce)).toBe(true);
    });

    it("prevents nonce reuse", () => {
      const nonce = "test-nonce";

      NonceManager.markNonceAsUsed(nonce);

      expect(NonceManager.isNonceUsed(nonce)).toBe(true);
      expect(NonceManager.isNonceUsed("different-nonce")).toBe(false);
    });
  });

  describe("SignatureValidator", () => {
    it("validates complete request signatures", async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = RequestSigner.generateNonce();
      const signature = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        timestamp,
        nonce,
      );

      const headers = new Headers({
        [SIGNATURE_HEADERS.SIGNATURE]: signature,
        [SIGNATURE_HEADERS.TIMESTAMP]: timestamp.toString(),
        [SIGNATURE_HEADERS.NONCE]: nonce,
        [SIGNATURE_HEADERS.KEY_ID]: testKeyId,
      });

      const result = await SignatureValidator.validateRequest(
        testMethod,
        testPath,
        headers,
        testBody,
      );

      expect(result.valid).toBe(true);
      expect(result.keyId).toBe(testKeyId);
    });

    it("rejects requests with missing headers", async () => {
      const headers = new Headers({
        [SIGNATURE_HEADERS.SIGNATURE]: "some-signature",
        // Missing other required headers
      });

      const result = await SignatureValidator.validateRequest(
        testMethod,
        testPath,
        headers,
        testBody,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Missing required signature headers");
    });

    it("rejects requests with invalid timestamps", async () => {
      const expiredTimestamp = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago
      const nonce = RequestSigner.generateNonce();
      const signature = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        expiredTimestamp,
        nonce,
      );

      const headers = new Headers({
        [SIGNATURE_HEADERS.SIGNATURE]: signature,
        [SIGNATURE_HEADERS.TIMESTAMP]: expiredTimestamp.toString(),
        [SIGNATURE_HEADERS.NONCE]: nonce,
        [SIGNATURE_HEADERS.KEY_ID]: testKeyId,
      });

      const result = await SignatureValidator.validateRequest(
        testMethod,
        testPath,
        headers,
        testBody,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("timestamp is outside acceptable window");
    });

    it("rejects requests with reused nonces", async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = RequestSigner.generateNonce();
      const signature = RequestSigner.generateSignature(
        testSecret,
        testMethod,
        testPath,
        testBody,
        timestamp,
        nonce,
      );

      const headers = new Headers({
        [SIGNATURE_HEADERS.SIGNATURE]: signature,
        [SIGNATURE_HEADERS.TIMESTAMP]: timestamp.toString(),
        [SIGNATURE_HEADERS.NONCE]: nonce,
        [SIGNATURE_HEADERS.KEY_ID]: testKeyId,
      });

      // First request should succeed
      const result1 = await SignatureValidator.validateRequest(
        testMethod,
        testPath,
        headers,
        testBody,
      );
      expect(result1.valid).toBe(true);

      // Second request with same nonce should fail
      const result2 = await SignatureValidator.validateRequest(
        testMethod,
        testPath,
        headers,
        testBody,
      );
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain("Nonce has already been used");
    });

    it("rejects requests with invalid signatures", async () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = RequestSigner.generateNonce();
      const invalidSignature = "invalid-signature";

      const headers = new Headers({
        [SIGNATURE_HEADERS.SIGNATURE]: invalidSignature,
        [SIGNATURE_HEADERS.TIMESTAMP]: timestamp.toString(),
        [SIGNATURE_HEADERS.NONCE]: nonce,
        [SIGNATURE_HEADERS.KEY_ID]: testKeyId,
      });

      const result = await SignatureValidator.validateRequest(
        testMethod,
        testPath,
        headers,
        testBody,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid signature");
    });
  });

  describe("ClientSigner", () => {
    it("generates complete signature headers", () => {
      const headers = ClientSigner.signRequest(
        testKeyId,
        testSecret,
        testMethod,
        testPath,
        testBody,
      );

      expect(headers[SIGNATURE_HEADERS.KEY_ID]).toBe(testKeyId);
      expect(headers[SIGNATURE_HEADERS.SIGNATURE]).toBeTruthy();
      expect(headers[SIGNATURE_HEADERS.TIMESTAMP]).toBeTruthy();
      expect(headers[SIGNATURE_HEADERS.NONCE]).toBeTruthy();

      // Verify signature is valid
      const timestampHeader = headers[SIGNATURE_HEADERS.TIMESTAMP];
      const signatureHeader = headers[SIGNATURE_HEADERS.SIGNATURE];
      const nonceHeader = headers[SIGNATURE_HEADERS.NONCE];

      expect(timestampHeader).toBeDefined();
      expect(signatureHeader).toBeDefined();
      expect(nonceHeader).toBeDefined();

      const timestamp = parseInt(timestampHeader!);
      const isValid = RequestSigner.verifySignature(
        testSecret,
        signatureHeader!,
        testMethod,
        testPath,
        testBody,
        timestamp,
        nonceHeader!,
      );

      expect(isValid).toBe(true);
    });
  });
});
