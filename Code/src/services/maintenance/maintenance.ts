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

export async function deleteCertificate(fileName: string) {
    return await dao.deleteCertificate(fileName);
}

function extractStudentNumber(fileName: string) {
    const parts = fileName.split('_');
    const lastPart = parts[parts.length - 1] ?? '';
    const numberPart = lastPart.replace(/\.[^.]+$/, '');
    return parseInt(numberPart, 10);
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
    const filesToDelete = files.filter(file => {
        const fileStudentNumber = extractStudentNumber(file.fileName);
        return !Number.isNaN(fileStudentNumber) && fileStudentNumber < cutoff;
    });

    return filesToDelete;
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
