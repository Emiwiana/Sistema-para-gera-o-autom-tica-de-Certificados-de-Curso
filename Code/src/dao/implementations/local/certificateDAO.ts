import path from "path";
import fs from "fs/promises";
import { Student } from "../../../model/student";
import { CertificateRepositoryDir } from "../../../configs/localRepository";
import { Certificate } from "../../../model/certificate";

export class CertificateDAO {

    // Extracted helper method to centralize file reading and object instantiation
    private async createCertificateFromFile(fileName: string): Promise<Certificate | null> {
        try {
            const filePath = path.join(CertificateRepositoryDir, fileName);
            const stats = await fs.stat(filePath);
            return new Certificate(fileName, filePath, stats.birthtime, stats.birthtimeMs);
        } catch (error) {
            return null;
        }
    }

    async getCertificateByStudent(student: Student): Promise<Certificate | null> {
        return this.createCertificateFromFile(student.certificateFileName);
    }

    async getCertificateByName(fileName: string): Promise<Certificate | null> {
        return this.createCertificateFromFile(fileName);
    }

    async getAllCertificates(): Promise<Certificate[]> {
        try {
            const files = await fs.readdir(CertificateRepositoryDir);

            const certificates = await Promise.all(
                files.map(fileName => this.createCertificateFromFile(fileName))
            );

            // Filter out any nulls in case a file was deleted between readdir and stat
            return certificates.filter((cert): cert is Certificate => cert !== null);
        } catch (error) {
            console.error("Error reading output directory:", error);
            return [];
        }
    }

    async deleteCertificate(certificate: Certificate): Promise<boolean> {
        try {
            const filePath = path.join(CertificateRepositoryDir, certificate.name);
            await fs.unlink(filePath);
            return true;
        } catch (error) {
            console.error(`Error deleting ${certificate.name}:`, error);
            return false;
        }
    }

    async getCertificatesByCourse(courseId: number): Promise<Certificate[]> {
        const files = await this.getAllCertificates();
        return files.filter(f => {
            const cid = f.extractCourseId();
            return !Number.isNaN(cid) && cid === courseId;
        });
    }

    async getCertificatesBeforeDate(cutoffDate: Date): Promise<Certificate[]> {
        const files = await this.getAllCertificates();
        return files.filter(file => file.createdAt < cutoffDate);
    }

    async getCertificatesBeforeStudentNumber(cutOff: number): Promise<Certificate[]> {
        const files = await this.getAllCertificates();
        return files.filter(file => {
            const num = file.extractStudentNumber();
            return !Number.isNaN(num) && num < cutOff;
        });
    }
}