import {UserDAO} from "../../interfaces/userDAO";
import {User} from "../../../model/user";
import {userRole} from "../../../model/user";

//this class is just for tests, this method of saving users is too unsafe

const testAdmin = {
    id: 12345,
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
}

const testUser = {
    id: 12346,
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'USER',
}

const testAdminCredential = {
    id: testAdmin.id,
    email: 'admin@example.com',
    password: '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK' //admin123
}

const testUserCredential = {
    id: testUser.id,
    email: 'user@example.com',
    password: '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK' //admin123
}

const testUsers = [testAdmin, testUser]
const testCredentials = [testAdminCredential, testUserCredential]


export class VariableUserDAO implements UserDAO {
    getUser(email: string): User | null {
        for (const credential in testCredentials) {
            if (testCredentials[credential].email === email) {
                const id = testCredentials[credential].id;
                for (const user in testUsers) {
                    if (testUsers[user].id === id) {
                        const name = testUsers[user].firstName + " " + testUsers[user].lastName;
                        const role = testUsers[user].role as keyof typeof userRole;
                        return new User(id, email, name, <userRole>role);
                    }
                }
            }
        }
        return null;
    }

    getPassword(email: string): string | null {
        for (const credential in testCredentials) {
            if (testCredentials[credential].email === email) {
                return testCredentials[credential].password;
            }
        }
        return null;
    }

}