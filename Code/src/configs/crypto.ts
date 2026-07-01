import crypto from "crypto";

// The master secret must be exactly 32 bytes for AES-256.
// It is derived from APP_SECRET in .env (infrastructure-level, never changes).
function getMasterKey(): Buffer {
    const secret = process.env.APP_SECRET;
    if (!secret) {
        throw new Error(
            "APP_SECRET is not set in the environment. " +
            "Add a strong random value to your .env file: " +
            "APP_SECRET=" + crypto.randomBytes(32).toString("hex")
        );
    }
    // Derive a stable 32-byte key using SHA-256 of the secret
    return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a colon-separated string: `iv:authTag:ciphertext` (all hex).
 */
export function encrypt(plaintext: string): string {
    const key = getMasterKey();
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
}

/**
 * Decrypts a string produced by `encrypt()`.
 * Returns the original plaintext, or an empty string if decryption fails.
 */
export function decrypt(ciphertext: string): string {
    try {
        const key = getMasterKey();
        const [ivHex, authTagHex, dataHex] = ciphertext.split(":");
        if (!ivHex || !authTagHex || !dataHex) return "";

        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");
        const data = Buffer.from(dataHex, "hex");

        const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(authTag);

        return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
    } catch {
        // Decryption failure (wrong key, tampered data, etc.)
        return "";
    }
}

/** Returns true if a string looks like an encrypted token (iv:tag:data) */
export function isEncrypted(value: string): boolean {
    const parts = value.split(":");
    return parts.length === 3 && parts.every(p => /^[0-9a-f]+$/i.test(p));
}
