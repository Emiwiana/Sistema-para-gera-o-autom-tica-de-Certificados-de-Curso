import path from "path";
import {Student} from "../../../model/student";
import fs from "fs/promises";
import {CertificateRepositoryDir} from "../../../configs/localRepository";

export class CertificateDAO {

    async getCertificateByStudent(student : Student) {
        try {
            const filePath = path.join(CertificateRepositoryDir, student.certificateFileName);
            return fs.readFile(filePath);
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
                    return {
                        fileName,
                        path: filePath,
                        // mtime is the last modified date, birthtime is creation date
                        createdAt: stats.birthtime,
                        timestamp: stats.birthtimeMs
                    };
                })
            );
        } catch (error) {
            console.error("Error reading output directory:", error);
            return [];
        }
    }

    async deleteCertificate(fileName: string) {
        try {
            const filePath = path.join(CertificateRepositoryDir, fileName);
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            console.error(`Error deleting ${fileName}:`, error);
            return false;
        }
    }

    async getCertificateByName(fileName: string) {
        try {
            const filePath = path.join(CertificateRepositoryDir, fileName);
            return fs.readFile(filePath);
        } catch (error) {
            return null;
        }

    }
}

