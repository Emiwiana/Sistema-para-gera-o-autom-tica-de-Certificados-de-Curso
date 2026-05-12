import nodemailer from 'nodemailer'

const configOptions = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(configOptions);
export default transporter;

console.log(process.env.EMAIL_USER)