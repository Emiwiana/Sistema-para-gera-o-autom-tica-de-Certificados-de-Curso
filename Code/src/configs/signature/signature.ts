import path from "path";
import fs from "fs";
import { encrypt, decrypt, isEncrypted } from "../../services/crypto";
import config from "./signature.json"

// Path where the institution's .p12 certificate is stored on the server
export const P12_CERT_PATH = path.join(__dirname, "signature.p12");

export interface WrittenSignatureSettings {
    enabled: boolean;
    password: string;
    name: string;
    contactInfo: string;
    location: string;
    reason: string;
}

export interface SignatureSettings extends WrittenSignatureSettings {
    enabled: boolean;
    password: string;
    name: string;
    contactInfo: string;
    location: string;
    reason: string;

    hasCertificate: boolean;
}



/**
 * Reads persisted signature settings and decrypts the passphrase in memory.
 * Falls back to defaults if the file does not exist yet.
 */
export function getSignatureSettings(): SignatureSettings {


        return {
            enabled: config.enabled,
            password: config.password,
            name: config.name,
            contactInfo: config.contactInfo,
            location: config.location,
            reason: config.reason,
            // Decrypt passphrase on the way out (only lives in memory)
            hasCertificate: fs.existsSync(P12_CERT_PATH),
        };
}

/**
 * Saves signature settings. The passphrase is encrypted with AES-256-GCM
 * before being written to disk. `hasCertificate` is derived from filesystem state.
 */
export function saveSignatureSettings(update: Partial<Omit<SignatureSettings, "hasCertificate">>): void {
    const currentSettings = getSignatureSettings();

    const passphraseToStore = update.password !== undefined
        ? update.password
        : currentSettings.password;

    const newSettings: WrittenSignatureSettings = {
        enabled: update.enabled ?? currentSettings.enabled,
        name: update.name ?? currentSettings.name,
        contactInfo: update.contactInfo ?? currentSettings.contactInfo,
        location: update.location ?? currentSettings.location,
        reason: update.reason ?? currentSettings.reason,
        password: passphraseToStore ? decrypt(passphraseToStore) : "",
    };

    fs.writeFileSync("./signature.json", JSON.stringify(newSettings, null, 2), "utf8");
}
