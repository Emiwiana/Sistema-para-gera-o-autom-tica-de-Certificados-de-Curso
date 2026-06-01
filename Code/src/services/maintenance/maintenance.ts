import {CertificateDAO} from "../../dao/implementations/local/certificateDAO";

const dao = new CertificateDAO();

export async function getSortedCertificates(sortOrder: string) {
    let files = await dao.getAllCertificates();

    // Sort the files by age
    files.sort((a, b) => {
        if (sortOrder === 'oldest') {
            return a.timestamp - b.timestamp; // Ascending
        } else {
            return b.timestamp - a.timestamp; // Descending
        }
    });

    return files;
}

export async function deleteCertificates(certificates: Promise<any>): Promise<boolean> {
    for (const file of await certificates) {
        if (await dao.deleteCertificate(file.fileName)) {
            console.log('Deleted file', file.fileName);
        }
        else return false;
    }
    return true;
}

function extractStudentNumber(fileName: string) {
    const parts = fileName.split('_');
    const lastPart = parts[parts.length - 1] ?? '';
    const numberPart = lastPart.replace(/\.[^.]+$/, '');
    return parseInt(numberPart, 10);
}

function extractCourseId(fileName: string) {
    const parts = fileName.split('_');
    // pattern: certificado_curso_{courseId}_aluno_{studentId}.pdf
    const coursePart = parts[2] ?? '';
    return parseInt(String(coursePart), 10);
}

export async function sortCertificatesByStudentNumber(sortOrder: string) {
    let files = await dao.getAllCertificates();
    files.sort((a, b) => {
        const studentNumberA = extractStudentNumber(a.fileName);
        const studentNumberB = extractStudentNumber(b.fileName);

        if (Number.isNaN(studentNumberA) || Number.isNaN(studentNumberB)) {
            return 0;
        }

        if (sortOrder === 'increasing') {
            return studentNumberA - studentNumberB;
        } else {
            return studentNumberB - studentNumberA;
        }
    });
    return files;
}

export async function getCertificateBeforeStudentNumber(studentNumber: string) {
    const files = await sortCertificatesByStudentNumber('increasing'); // Get files sorted by student number
    const cutoff = parseInt(studentNumber, 10);
    return files.filter(file => {
        const fileStudentNumber = extractStudentNumber(file.fileName);
        return !Number.isNaN(fileStudentNumber) && fileStudentNumber < cutoff;
    });
}

export async function getCertificatesByCourse(courseId: number | string) {
    const cutoff = parseInt(String(courseId), 10);
    if (Number.isNaN(cutoff)) return [];

    const files = await dao.getAllCertificates();
    return files.filter(f => {
        const cid = extractCourseId(f.fileName);
        return !Number.isNaN(cid) && cid === cutoff;
    });
}


export async function getCertificateBeforeDate(date: string | Date) {
    let cutoff: Date;
    
    if (date instanceof Date) {
        cutoff = date;
    } else {
        // Format: YYYY-MM-DDTHH:MM or YYYY-MM-DDTHH:MM:SS
        cutoff = new Date(date);
    }
    
    if (isNaN(cutoff.getTime())) {
        // invalid date, return empty list
        return [];
    }

    const files = await getSortedCertificates('oldest');
    return files.filter(file => file.createdAt < cutoff);
}
