import {VariableUserDAO} from "../../dao/implementations/variableUnsafe/variableUserDAO";
import * as bcrypt from 'bcrypt-ts'
import {User} from "../../model/user";
import {IUserDAO} from "../../dao/interfaces/IUserDAO";

const dao: IUserDAO = new VariableUserDAO()

export async function validateCredentials(email: string, password: string): Promise<User | null> {
    const hashedPassword = dao.getPassword(email)
    if (hashedPassword) {
        const isMatch = await bcrypt.compare(password, hashedPassword)
        if (isMatch) {
            return dao.getUser(email)
        }
    }
    return null
}

function generateHashedPassword(password: string): string {
    const hash = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, hash)
}