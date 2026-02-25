export class UserModel {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public address?: string;
    public email!: string;
    public phone!: string;
    public role!: 'user' | 'manager'; // "manager" or "user"
    public signAt?: Date;
    public updatedAt?: Date;
}