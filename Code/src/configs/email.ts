export default {
    EMAIL_HOST: process.env.EMAIL_HOST || "",
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
    EMAIL_SENDER: process.env.EMAIL_SENDER || "",
}