import * as bcrypt from 'bcrypt-ts'
import {User} from "../../model/user";
import {IUserDAO} from "../../dao/interfaces/IUserDAO";
import {SqlUserDAO} from "../../dao/implementations/sql/sqlUserDAO";

const dao: IUserDAO = new SqlUserDAO()

export async function validateCredentials(email: string, password: string): Promise<User | null> {
    const hashedPassword = await dao.getPassword(email)
    if (hashedPassword ) {
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