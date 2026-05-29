

export interface UserDAO {
    /**
     * Searches the database to authenticate a user based on the login credentials
     * if a user with a valid email/password combination is found, returns that user
     * otherwise, returns null
     *
     * @param email user email
     * @param password encrypted password
     * @returns: valid user, or null
     */
    getUserFromCredentials (email: String, password: String) : User | null;
}