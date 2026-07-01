import path from "path";
import fs from "fs";
import { encrypt, decrypt, isEncrypted } from "./crypto";

// Path to the persisted settings file (gitignored in production)
const SETTINGS_FILE = path.join(__dirname, "signature.json");

// Path where the institution's .p12 certificate is stored on the server
export const P12_CERT_PATH = path.join(__dirname, "signature.p12");

export interface SignatureSettings {
    enabled: boolean;
    /** Plaintext passphrase — only ever kept in memory, never written to disk as-is */
    passphrase: string;
    name: string;
    contact: string;
    location: string;
    reason: string;
    hasCertificate: boolean;
}

/** Shape persisted to disk — passphrase is always encrypted */
interface PersistedSettings {
    enabled: boolean;
    passphraseEnc: string; // AES-256-GCM encrypted
    name: string;
    contact: string;
    location: string;
    reason: string;
}

const DEFAULTS: SignatureSettings = {
    enabled: false,
    passphrase: "",
    name: "",
    contact: "",
    location: "",
    reason: "Autenticação de Certificado de Curso",
    hasCertificate: false,
};

/**
 * Reads persisted signature settings and decrypts the passphrase in memory.
 * Falls back to defaults if the file does not exist yet.
 */
export function getSignatureSettings(): SignatureSettings {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            return { ...DEFAULTS, hasCertificate: fs.existsSync(P12_CERT_PATH) };
        }
        const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
        const persisted = JSON.parse(raw) as Partial<PersistedSettings>;

        return {
            enabled: persisted.enabled ?? DEFAULTS.enabled,
            name: persisted.name ?? DEFAULTS.name,
            contact: persisted.contact ?? DEFAULTS.contact,
            location: persisted.location ?? DEFAULTS.location,
            reason: persisted.reason ?? DEFAULTS.reason,
            // Decrypt passphrase on the way out (only lives in memory)
            passphrase: persisted.passphraseEnc ? decrypt(persisted.passphraseEnc) : "",
            hasCertificate: fs.existsSync(P12_CERT_PATH),
        };
    } catch {
        return { ...DEFAULTS };
    }
}

/**
 * Saves signature settings. The passphrase is encrypted with AES-256-GCM
 * before being written to disk. `hasCertificate` is derived from filesystem state.
 */
export function saveSignatureSettings(
    update: Partial<Omit<SignatureSettings, "hasCertificate">>
): void {
    const current = getSignatureSettings();

    const passphraseToStore = update.passphrase !== undefined
        ? update.passphrase
        : current.passphrase;

    const persisted: PersistedSettings = {
        enabled: update.enabled ?? current.enabled,
        name: update.name ?? current.name,
        contact: update.contact ?? current.contact,
        location: update.location ?? current.location,
        reason: update.reason ?? current.reason,
        // Encrypt passphrase before writing — never store plaintext
        passphraseEnc: passphraseToStore ? encrypt(passphraseToStore) : "",
    };

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(persisted, null, 2), "utf8");
}
