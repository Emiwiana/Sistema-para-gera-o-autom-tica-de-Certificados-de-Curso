import {UserDAO} from "../../interfaces/userDAO";
import {User} from "../../../model/user";
import {userRole} from "../../../model/user";

//this class is just for tests, this method of saving users is too unsafe

const testUser = {
    id: 12345,
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
}

const testCredential = {
    id: testUser.id,
    email: 'admin@example.com',
    password: '$2b$10$YSqNH5POiVP8/Zh24e20AuV7sAQ1KtC0o/kevrewWhVsxgVgoFxEK'
}


export class VariableUserDAO implements UserDAO {
    getUser(email: string): User | null {
        if (testCredential.email === email) {
            const id = testCredential.id;
            if (testUser.id === id) {
                const name = testUser.firstName + " " + testUser.lastName;
                const role = userRole[testUser.role as keyof typeof userRole];
                return new User(id, email, name, role)
            }
        }
        return null
    }

    getPassword(email: string): string | null {
        if (testCredential.email === email) {
            return testCredential.password;
        }
        return null;
    }

}