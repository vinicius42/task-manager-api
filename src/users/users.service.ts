import { Injectable } from '@nestjs/common';
import { ok, err, type Result } from "../utils/result";
import type { CreateUserInput, UpdateUserInput, User } from "../types/user.types";
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntityToUser } from './user.mapper';

@Injectable()
export class UsersService {
    constructor(
        //O decorator @InjectRepository() diz ao NestJS qual Entity o repositório gerencia.
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async getUserByEmail(email: string): Promise<Result<User>>{
        const user = await this.userRepository.findOneBy({ email });
        if(!user){
            return err('User not found')
        }

        const userMapped = UserEntityToUser(user);

        return ok(userMapped);
    }

    async createUser(input: CreateUserInput): Promise<Result<User>>{
        const emailExists = await this.userRepository.findOneBy({ email: input.email });
        if(emailExists){
            return err('Email already exists')
        }

        const create = this.userRepository.create(input);

        create.password = await bcrypt.hash(input.password, 10)
        create.role = input.role ?? 'member';
        create.createdAt = new Date().toISOString();

        const saveUser = await this.userRepository.save(create);

        const userMapped = UserEntityToUser(saveUser);

        return ok(userMapped);
    }
    
    async getAllUsers(): Promise<Result<User[]>>{
        const users = await this.userRepository.find();
        if(!users){
            return err('Users not found')
        }

        const usersMapped = users.map(UserEntityToUser);
        return ok(usersMapped);
    }
    
    async getUserById(id: string): Promise<Result<User>>{
        const users = await this.userRepository.findOneBy({ id });
        if(!users){
            return err('User not found')
        }

        const userMapped = UserEntityToUser(users);
        return ok(userMapped)
    }
    
    async updateUser(id: string, update: UpdateUserInput): Promise<Result<User>>{
        const userUpdate = await this.userRepository.findOneBy({ id });
        
        if(!userUpdate){
            return err('User not found')
        }

        userUpdate.email = update.email ?? userUpdate.email //Se update.email for uma string vazia '', o || vai usar o valor antigo. O operador correto para "use o novo valor se existir, senão mantenha o antigo" é ??.
        userUpdate.password = update.password ?? userUpdate.password
        userUpdate.role = update.role ?? userUpdate.role

        const updatedUser = await this.userRepository.save(userUpdate);
        const userMapped = UserEntityToUser(updatedUser);

        return ok(userMapped);
    }
    
    async deleteUser(id: string): Promise<Result<User>>{
        const getUser = await this.userRepository.findOneBy({ id });
        if(!getUser){
            return err('User not found')
        }

        const deletedUser = await this.userRepository.remove(getUser);
        const userMapped = UserEntityToUser(deletedUser);
        return ok(userMapped);
    }
}
