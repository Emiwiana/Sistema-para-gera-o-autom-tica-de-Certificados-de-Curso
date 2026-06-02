import {CertificateDAO} from "../../dao/implementations/local/certificateDAO";
import {Certificate} from "../../model/certificate";

const dao = new CertificateDAO();

export async function getCertificateByName(name: string): Promise<Certificate[]> {
    const certificate = await dao.getCertificateByName(name)
    if (certificate) {
        return [certificate];
    }
    return []
}

export async function getSortedCertificates(sortOrder: string) {
    let files = await dao.getAllCertificates();

    // Sort the files by age
    files.sort((a, b) => {
        if (sortOrder === 'oldest') {
            return a.modifiedAt - b.modifiedAt; // Ascending
        } else {
            return b.modifiedAt - a.modifiedAt; // Descending
        }
    });

    return files;
}

export async function deleteCertificates(certificates: Promise<Certificate[]>): Promise<boolean> {
    for (const file of await certificates) {
        if (await dao.deleteCertificate(file)) {
            console.log('Deleted file', file.name);
        }
        else return false;
    }
    return true;
}

export async function sortCertificatesByStudentNumber(sortOrder: string) {
    let files = await dao.getAllCertificates();
    files.sort((a, b) => {
        const studentNumberA = a.extractStudentNumber();
        const studentNumberB = b.extractStudentNumber();

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

export async function getCertificatesBeforeStudentNumber(studentNumber: string) {
    const files = await sortCertificatesByStudentNumber('increasing'); // Get files sorted by student number
    const cutoff = parseInt(studentNumber, 10);
    return files.filter(file => {
        const fileStudentNumber = file.extractStudentNumber();
        return !Number.isNaN(fileStudentNumber) && fileStudentNumber < cutoff;
    });
}

export async function getCertificatesByCourse(courseId: number | string) {
    const cutoff = parseInt(String(courseId), 10);
    if (Number.isNaN(cutoff)) return [];
    const files = await dao.getAllCertificates();
    return files.filter(f => {
        const cid = f.extractCourseId();
        return !Number.isNaN(cid) && cid === cutoff;
    });
}


export async function getCertificatesBeforeDate(date: string | Date) {
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
