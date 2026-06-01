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

export async function getCertificateBeforeStudentNumber(studentNumber: string) {
    //Ignora este ainda n acabei
    let files = await dao.getAllCertificates();

    // Filter files based on student number
    files.sort((a, b) => a.fileName.localeCompare(b.fileName)).filter(file => {
        const fileStudentNumber = file.fileName.split('_')[0];
        return fileStudentNumber < studentNumber;
    });


    return files;
}

async function getCertificatesBeforeDate(date: string | Date) {
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

export async function deleteCertificatesBeforeDate(date: string | Date) {
    const files = await getCertificatesBeforeDate(date);
    for (const file of files) {
        await deleteCertificate(file.fileName);
    }
    console.log(`Deleted files before ${date}:`, files.map(f => f.fileName));
}
