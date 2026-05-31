import { IUserDAO } from "../../interfaces/IUserDAO";
import { User, userRole } from "../../../model/user";
import { RowDataPacket } from "mysql2/promise";
import {pool} from "../../../configs/authDB";

interface EmployeeJoinRow extends RowDataPacket {
    EmployeeID: number;
    Email: Buffer; // Since VARBINARY comes over as a Node Buffer
    FirstName: string;
    LastName: string;
    Role: string;
    Password?: Buffer;
}

export class SqlUserDAO implements IUserDAO {

    async getUser(email: string): Promise<User | null> {
        const query = `
            SELECT
                e.EmployeeID,
                c.Email,
                e.FirstName,
                e.LastName,
                e.Role
            FROM Credentials c
                     INNER JOIN Employees e ON c.ID = e.EmployeeID
            WHERE c.Email = ?
                LIMIT 1
        `;

        try {
            const [rows] = await pool.execute<EmployeeJoinRow[]>(query, [email.trim()]);

            if (rows.length === 0) {
                return null;
            }

            const dbEmployee = rows[0];
            const fullName = `${dbEmployee.FirstName} ${dbEmployee.LastName}`;
            const stringEmail = dbEmployee.Email.toString('utf8');
            const validatedRole = dbEmployee.Role as keyof typeof userRole;

            return new User(dbEmployee.EmployeeID, stringEmail, fullName, userRole[validatedRole]);
        } catch (error) {
            console.error("Database error inside getUser:", error);
            throw new Error("Data retrieval transaction failed.");
        }
    }

    async getPassword(email: string): Promise<string | null> {
        const query = `
            SELECT Password
            FROM Credentials
            WHERE Email = ?
                LIMIT 1
        `;

        try {
            const [rows] = await pool.execute<EmployeeJoinRow[]>(query, [email.trim()]);

            if (rows.length === 0) {
                return null;
            }

            const passwordBuffer = rows[0].Password;
            return passwordBuffer ? passwordBuffer.toString('utf8') : null;
        } catch (error) {
            console.error("Database error inside getCredentialPassword:", error);
            throw new Error("Credential resolution transaction failed.");
        }
    }
}