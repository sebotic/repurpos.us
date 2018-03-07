export class User {

  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public institution: string,
    public position: string,
    public address: string,
    public zipCode: string,
    public city: string,
    public email: string,
    public password: string,
    public confirmPassword?: string,
    public phone?: string

  ) {  }

}