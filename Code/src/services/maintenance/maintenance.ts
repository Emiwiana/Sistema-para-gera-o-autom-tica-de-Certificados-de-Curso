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