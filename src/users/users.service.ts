import { Injectable } from '@nestjs/common';
import { ok, err, type Result } from "../utils/result";
import { createUserRepository, deleteUserRepository, getAllUsersRepository, getUserByIdRepository, updateUserRepository } from "../repositories/user.repository";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user.types";

@Injectable()
export class UsersService {
    createUser(input: CreateUserInput): Result<User>{
        if(input.email == ''){
            return err('Email is required')
        }
    
        if(input.email.length > 100){
            return err('Email cannot exceed 100 characters')
        }
    
        if(input.password == ''){
            return err('Password is required')
        }
    
        if(input.role != 'admin' && input.role != 'member'){
            return err('Role must be admin or member')
        }
    
        const data: User = {
            id: crypto.randomUUID(),
            email: input.email,
            password: input.password,
            role: input.role,
            createdAt: new Date().toISOString()
        }
    
        if(createUserRepository(data).success){
            return ok(data);
        } else {
            return err('Error creating user')
        }
    }
    
    getAllUsers(): Result<User[]>{
        return getAllUsersRepository();
    }
    
    getUserById(id: string): Result<User>{
        return getUserByIdRepository(id);
    }
    
    updateUser(id: string, update: UpdateUserInput): Result<User>{
        if(update.email == ''){
            return err('Email is required')
        }
    
        if(update.password == ''){
            return err('Password is required')
        }

        if(update.role !== undefined && update.role != 'admin' && update.role != 'member'){
            return err('Role must be admin or member')
        }
    
        const getUserId = getUserByIdRepository(id);
        if(!getUserId.success){
            return err('User not found')
        }
    
        return updateUserRepository(id, update);
    }
    
    deleteUser(id: string): Result<User>{
        return deleteUserRepository(id);
    }
}
