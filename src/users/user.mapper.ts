import { PublicUser, UserRole } from "src/types/user.types";
import { UserEntity } from "./entities/user.entity";

export function UserEntityToUser(userEntity: UserEntity): PublicUser {
    return {
        id: userEntity.id,
        email: userEntity.email,
        role: userEntity.role as UserRole,
        createdAt: userEntity.createdAt
    }
}