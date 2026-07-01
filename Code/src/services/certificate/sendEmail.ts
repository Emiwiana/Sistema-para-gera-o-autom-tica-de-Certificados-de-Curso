import nodemailer, { SendMailOptions } from 'nodemailer';
import { getEmailSettings } from "../../configs/emailManager";
import { Student } from "../../model/student";
import { CertificateDAO } from "../../dao/implementations/local/certificateDAO";

const dao = new CertificateDAO();

/**
 * Creates a fresh nodemailer transporter from the current email settings.
 * Called per-send so any settings change takes effect immediately without restart.
 */
function createTransporter() {
    const settings = getEmailSettings();

    if (!settings.host || !settings.user || !settings.hasPassword) {
        throw new Error(
            "Email não configurado. Aceda a Definições → Email para inserir as credenciais SMTP."
        );
    }

    return nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.port === 465, // true for port 465, false for others (STARTTLS)
        auth: {
            user: settings.user,
            pass: settings.password,
        },
    });
}

export const sendUserCertificateEmail = async (student: Student, filePath?: string): Promise<void> => {
    const certificate = await dao.getCertificateByStudent(student);
    if (certificate == null) { return; }

    const settings = getEmailSettings();
    const transporter = createTransporter(); // throws if not configured

    const mailOptions: SendMailOptions = {
        from: settings.sender || settings.user,
        to: student.email,
        subject: `Certificado ${student.name}!`,
        html: `
  <!DOCTYPE html>
  <html>
    <body>
      <h1>O seu certificado foi gerado com sucesso, ${student.name}!</h1>
      <p>Em anexo, encontra-se o seu certificado do curso ${student.course.name}!</p>
    </body>
  </html>`,
        attachments: [
            {
                filename: student.certificateFileName,
                path: filePath || certificate.path,
            }
        ]
    };

    // Let errors propagate – the caller is responsible for handling them.
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${student.email}!`);
};