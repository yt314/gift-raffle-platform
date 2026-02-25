export class UserCreateModel {
  public id?: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public address?: string;
}
