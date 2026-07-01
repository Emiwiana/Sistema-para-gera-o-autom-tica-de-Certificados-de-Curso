import path from "path";
import fs from "fs";
import { encrypt, decrypt } from "./crypto";

const SETTINGS_FILE = path.join(__dirname, "email.json");

export interface EmailSettings {
    host: string;
    port: number;
    user: string;
    /** Plaintext password — only kept in memory, never written to disk as-is */
    password: string;
    sender: string;
    hasPassword: boolean;
}

/** Shape persisted to disk — password is always encrypted */
interface PersistedEmailSettings {
    host: string;
    port: number;
    user: string;
    passwordEnc: string; // AES-256-GCM encrypted
    sender: string;
}

const DEFAULTS: EmailSettings = {
    host: "",
    port: 587,
    user: "",
    password: "",
    sender: "",
    hasPassword: false,
};

/**
 * Reads persisted email settings and decrypts the password in memory.
 * Falls back to defaults if the file does not exist yet.
 */
export function getEmailSettings(): EmailSettings {
    try {
        if (!fs.existsSync(SETTINGS_FILE)) {
            return { ...DEFAULTS };
        }
        const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
        const persisted = JSON.parse(raw) as Partial<PersistedEmailSettings>;

        const password = persisted.passwordEnc ? decrypt(persisted.passwordEnc) : "";

        return {
            host: persisted.host ?? DEFAULTS.host,
            port: persisted.port ?? DEFAULTS.port,
            user: persisted.user ?? DEFAULTS.user,
            sender: persisted.sender ?? DEFAULTS.sender,
            password,
            hasPassword: !!password,
        };
    } catch {
        return { ...DEFAULTS };
    }
}

/**
 * Saves email settings. The password is encrypted with AES-256-GCM before
 * being written to disk. If `password` is omitted or empty, the existing
 * encrypted password is preserved.
 */
export function saveEmailSettings(
    update: Partial<Omit<EmailSettings, "hasPassword">>
): void {
    const current = getEmailSettings();

    const passwordToStore = update.password !== undefined && update.password !== ""
        ? update.password
        : current.password;

    const persisted: PersistedEmailSettings = {
        host: update.host ?? current.host,
        port: update.port ?? current.port,
        user: update.user ?? current.user,
        sender: update.sender ?? current.sender,
        // Encrypt before writing — plaintext never touches disk
        passwordEnc: passwordToStore ? encrypt(passwordToStore) : "",
    };

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(persisted, null, 2), "utf8");
}
