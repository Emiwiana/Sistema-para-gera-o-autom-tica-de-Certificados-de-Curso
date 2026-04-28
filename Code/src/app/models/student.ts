class Student {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _email: string;

    constructor(id: number, name: string, email: string) {
        this._id = id;
        this._name = name;
        this._email = email;
    }

    public get id (): number {
        return this._id;
    }

    public get name (): string {
        return this._name;
    }

    public get email (): string {
        return this._email;
    }
}