import path from "path";
import {Student} from "../../../model/student";
import fs from "fs/promises";
import {CertificateRepositoryDir} from "../../../configs/localRepository";
import {Certificate} from "../../../model/certificate";

export class CertificateDAO {

    async getCertificateByStudent(student : Student) {
        try {
            const fileName = student.certificateFileName;
            const filePath = path.join(CertificateRepositoryDir, fileName);
            const stats = await fs.stat((filePath))
            return new Certificate(fileName, filePath, stats.birthtime, stats.birthtimeMs)
        } catch (error) {
            return null;
        }
    }

    async getAllCertificates() {
        try {
            const files = await fs.readdir(CertificateRepositoryDir);
            return await Promise.all(
                files.map(async (fileName) => {
                    const filePath = path.join(CertificateRepositoryDir, fileName);
                    const stats = await fs.stat(filePath);
                    return new Certificate(fileName, filePath, stats.birthtime, stats.birthtimeMs)
                })
            );
        } catch (error) {
            console.error("Error reading output directory:", error);
            return [];
        }
    }

    async deleteCertificate(certificate: Certificate) {
        try {
            const filePath = path.join(CertificateRepositoryDir, certificate.name);
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            console.error(`Error deleting ${certificate.name}:`, error);
            return false;
        }
    }

    async getCertificateByName(fileName: string) {
        try {
            const filePath = path.join(CertificateRepositoryDir, fileName);
            const stats = await fs.stat((filePath))
            return new Certificate(fileName, filePath, stats.birthtime, stats.birthtimeMs)
        } catch (error) {
            return null;
        }

    }
}

