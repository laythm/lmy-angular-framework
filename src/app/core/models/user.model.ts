import { BaseModel } from "./base.model";

export class UserModel extends BaseModel {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    roles: RolesEnum[]
}

export class SignInModel {
    username: string;
    password: string;
}


export const  enum RolesEnum {
    Admin = 'Admin',
    ProjectManager = 'ProjectManager',
}


