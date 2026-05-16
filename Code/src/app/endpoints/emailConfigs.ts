import * as dotenv from 'dotenv';

dotenv.config()

export default {
    EmailHost: process.env.EMAIL_HOST,
    EmailUser: process.env.EMAIL_USER,
    EmailPassword: process.env.EMAIL_PASSWORD,
    EmailSender: process.env.EMAIL_SENDER,
}