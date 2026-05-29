import {VariableUserDAO} from "../../dao/implementations/variableUnsafe/variableUserDAO";

const dao = new VariableUserDAO()

export function validateCredentials(email : string, password: string) {
    //TODO: encrypt password before comparing with database
    return dao.getUserFromCredentials(email, password)
}