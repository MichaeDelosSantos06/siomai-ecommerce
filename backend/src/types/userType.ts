export type UserRegistrationDTO = {
    username: string;
    email: string;
    password: string;
}

export type RegisterUser = {
    id: number;
    username: string;
    email: string;
    // password: string;
}

export type LoginDTO = {
    email: string;
    password: string;
}