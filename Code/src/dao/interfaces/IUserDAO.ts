import {User} from "../../model/user";


export interface IUserDAO {
    /**
     * Searches the database to find stored user data. Returning null if no user with the
     * given email was found.
     *
     * @param email user email
     * @returns: valid user, or null
     */
    getUser (email: String) : User | null;

    /**
     * Searches database to find stored hashed password, returning
     * null if no user with the given email was found.
     *
     * @param email
     * @returns: existing hashed password or null
     */
    getPassword(email: string): string | null;
}