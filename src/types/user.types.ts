export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: string;
}

export type UserRole = 'admin' | 'member';

export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export type UpdateUserInput = Partial<Pick<User, 'email' | 'password' | 'role'>>;

export type PublicUser = Omit<User, 'password'>;