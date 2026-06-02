import { User, UserRole } from "src/types/user.types";
import { UserEntity } from "./entities/user.entity";

export function UserEntityToUser(userEntity: UserEntity): User {
    return {
        id: userEntity.id,
        email: userEntity.email,
        password: userEntity.password,
        role: userEntity.role as UserRole,
        createdAt: userEntity.createdAt
    }
}