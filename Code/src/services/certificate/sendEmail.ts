import nodemailer, {SendMailOptions} from 'nodemailer'
import emailConfigs from "../../configs/email";
import {Student} from "../../model/student";
import {getCertificateByStudent} from "../../dao/implementations/local/certificateDAO";

const configOptions = {
    host: emailConfigs.EmailHost,
    port: 587,
    auth: {
        user: emailConfigs.EmailUser,
        pass: emailConfigs.EmailPassword,
    },
};

const transporter = nodemailer.createTransport(configOptions);


export const sendUserCertificateEmail = async (student: Student) => {
    try {
        const certificate = getCertificateByStudent(student);
        if (certificate == null) {return}

        const mailOptions: SendMailOptions = {
            from: emailConfigs.EmailSender,
            to: student.email,
            subject: `Certificado ${student.name}!`,
            html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>O seu certificado for gerado com sucesso, ${student.name}!</h1>
          <p>Em anexo, encontra-se o seu certificado do curso ${student.course.name}!</p>
        </body>
      </html>`,
            attachments: [
                {
                    filename: `certificado_${student.id}.pdf`,
                    content: certificate,
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${student.email}!`);
    } catch (error) {
        console.error(`Error on sending email to ${student.email}: ${error}`);
    }
};