import { Injectable } from '@nestjs/common';
import { ok, err, type Result } from "../utils/result";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user.types";
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        //O decorator @InjectRepository() diz ao NestJS qual Entity o repositório gerencia.
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ) {}
    async createUser(input: CreateUserInput): Promise<Result<User>>{    
        const create = this.userRepository.create(input);
        create.role = input.role ?? 'member';
        create.createdAt = new Date().toISOString();
        return ok(await this.userRepository.save(create));
    }
    
    async getAllUsers(): Promise<Result<User[]>>{
        const users = await this.userRepository.find();
        return ok(users);
    }
    
    async getUserById(id: string): Promise<Result<User>>{
        const users = await this.userRepository.findOneBy({ id });
        if(!users){
            return err('User not found')
        }
        return ok(users)
    }
    
    async updateUser(id: string, update: UpdateUserInput): Promise<Result<User>>{
        const userUpdate = await this.userRepository.findOneBy({ id });
        
        if(!userUpdate){
            return err('User not found')
        }

        userUpdate.email = update.email ?? userUpdate.email //Se update.email for uma string vazia '', o || vai usar o valor antigo. O operador correto para "use o novo valor se existir, senão mantenha o antigo" é ??.
        userUpdate.password = update.password ?? userUpdate.password
        userUpdate.role = update.role ?? userUpdate.role

        return ok(await this.userRepository.save(userUpdate));
    }
    
    async deleteUser(id: string): Promise<Result<User>>{
        const getUser = await this.userRepository.findOneBy({ id });
        if(!getUser){
            return err('User not found')
        }

        await this.userRepository.remove(getUser);
        return ok(getUser);
    }
}
