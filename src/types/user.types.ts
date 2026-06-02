export const UserRole = {
    ADMIN: 'admin',
    MEMBER: 'member'
} as const; //O as const é uma forma de criar um objeto imutável em TypeScript que se comporta de forma similar a um enum, mas é um objeto JavaScript comum — então existe em runtime.

// typeof UserRole — pega o tipo do objeto, que é { ADMIN: 'admin', MEMBER: 'member' }
// keyof typeof UserRole — pega as chaves, que é 'ADMIN' | 'MEMBER'
// typeof UserRole[keyof typeof UserRole] — pega os valores dessas chaves, que é 'admin' | 'member'
export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: string;
}

export type LoginInput = Pick<User, 'id' | 'email' | 'role'>;

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'role'> & Partial<Pick<User, 'role'>>;

export type UpdateUserInput = Partial<Pick<User, 'email' | 'password' | 'role'>>;

export type PublicUser = Omit<User, 'password'>;