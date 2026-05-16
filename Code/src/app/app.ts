/// <reference types="node" />
//app to be launched through this file
import {generatePdfCertificates} from "./controllers/certificate/certificateGenerator";
import {Student} from "./models/student";
import {Course} from "./models/course";
import {sendUserCertificateEmail} from "./controllers/email/emailer";

const leim = new Course(1101, "LEIM", "12-09-2023", "12-09-2023")
const list = [
    new Student(48155, "Nilo Duarte", "a51635@alunos.isel.pt", leim),
    new Student(48156, "Maria Silva", "", leim),
    new Student(48157, "João Pereira", "", leim)
]

//generatePdfCertificates(list);

sendUserCertificateEmail(list[0])






