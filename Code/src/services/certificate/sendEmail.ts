import nodemailer, {SendMailOptions} from 'nodemailer'
import emailConfigs from "../../configs/email";
import {Student} from "../../model/student";
import {CertificateDAO} from "../../dao/implementations/local/certificateDAO";

const configOptions = {
    host: emailConfigs.EMAIL_HOST,
    port: 587,
    auth: {
        user: emailConfigs.EMAIL_USER,
        pass: emailConfigs.EMAIL_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(configOptions);
const dao = new CertificateDAO()

export const sendUserCertificateEmail = async (student: Student, filePath?: string) => {
    try {
        const certificate = await dao.getCertificateByStudent(student);
        if (certificate == null) {return}

        const mailOptions: SendMailOptions = {
            from: emailConfigs.EMAIL_SENDER,
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

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${student.email}!`);
    } catch (error) {
        console.error(`Error on sending email to ${student.email}: ${error}`);
    }
};