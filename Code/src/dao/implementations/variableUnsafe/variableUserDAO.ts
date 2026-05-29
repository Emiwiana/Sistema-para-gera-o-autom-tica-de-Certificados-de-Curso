import {UserDAO} from "../../interfaces/userDAO";

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
    password: 'admin123'
}


export class VariableUserDAO implements UserDAO {
    getUserFromCredentials(email: string, password: string): User | null {
        if (testCredential.password === password && testCredential.email === email) {
            const id = testUser.id
            const name = testUser.firstName + " " + testUser.lastName
            const role = testUser.role
            return new User(id, email, name, userRole[role as keyof typeof userRole])
        }
        return null;
    }
}