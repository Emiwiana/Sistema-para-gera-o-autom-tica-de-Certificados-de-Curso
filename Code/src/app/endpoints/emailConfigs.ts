import * as dotenv from 'dotenv';

dotenv.config()

const user = process.env.EMAIL_USER;
console.log(user);

export default {
    EmailHost: process.env.EMAIL_HOST,
    EmailUser: process.env.EMAIL_USER,
    EmailPassword: process.env.EMAIL_PASSWORD,
}