export class UserModel {
    email?: string;
    password?: string;
}

export interface TokenModel {
    access_token: string;
}