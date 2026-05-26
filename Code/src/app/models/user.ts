enum userRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

class User {
    id: number;
    employeeName: string;
    email: string;
    role: userRole;

    constructor(id: number, email: string, employeeName: string, role: userRole) {
        this.id = id;
        this.email = email;
        this.employeeName = employeeName;
        this.role = role;
    }
}