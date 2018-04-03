export interface User {
    id: number,
    firstName: string,
    lastName: string,
    institution: string,
    position: string,
    address: string,
    zipCode: string,
    city: string,
    email: string,
    password: string,
    confirmPassword?: string,
    phone?: string
}