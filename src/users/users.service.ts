import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { CreateUserInput, LoginInput, PublicUser, UpdateUserInput, User, UserRole } from "../types/user.types";
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

    async getUserCredentials(email: string): Promise<LoginInput> {
        const user = await this.userRepository.findOneBy({ email: email });
        if(!user){
            throw new NotFoundException('User not found')
        }

        return {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role as UserRole
        };
    }

    async createUser(input: CreateUserInput): Promise<PublicUser>{
        const emailExists = await this.userRepository.findOneBy({ email: input.email });
        if(emailExists){
            throw new ConflictException('Email already exists')
        }
        
        try {
            const create = this.userRepository.create(input);

            create.password = await bcrypt.hash(input.password, 10)
            create.role = input.role ?? 'member';
            create.createdAt = new Date().toISOString();

            const saveUser = await this.userRepository.save(create);

            const userMapped = UserEntityToUser(saveUser);

            return userMapped;
        } catch (error: unknown) {
            if (error instanceof Error && 'code' in error && error.code === '23505') {
                throw new ConflictException('Email already exists')
            }
            throw error;
        }
    }
    
    async getAllUsers(): Promise<User[]>{
        const users = await this.userRepository.find();
        if(!users){
            throw new NotFoundException('Users not found')
        }

        const usersMapped = users.map(UserEntityToUser);
        return usersMapped;
    }
    
    async getUserById(id: string): Promise<User>{
        const users = await this.userRepository.findOneBy({ id });
        if(!users){
            throw new NotFoundException('Users not found')
        }

        const userMapped = UserEntityToUser(users);
        return userMapped;
    }
    
    async updateUser(id: string, update: UpdateUserInput): Promise<User>{
        const userUpdate = await this.userRepository.findOneBy({ id });
        
        if(!userUpdate){
            throw new NotFoundException('Users not found')
        }

        userUpdate.email = update.email ?? userUpdate.email //Se update.email for uma string vazia '', o || vai usar o valor antigo. O operador correto para "use o novo valor se existir, senão mantenha o antigo" é ??.
        userUpdate.password = update.password ?? userUpdate.password
        userUpdate.role = update.role ?? userUpdate.role

        const updatedUser = await this.userRepository.save(userUpdate);
        const userMapped = UserEntityToUser(updatedUser);

        return userMapped
    }
    
    async deleteUser(id: string): Promise<User>{
        const getUser = await this.userRepository.findOneBy({ id });
        if(!getUser){
            throw new NotFoundException('Users not found')
        }

        const deletedUser = await this.userRepository.remove(getUser);
        const userMapped = UserEntityToUser(deletedUser);
        return userMapped
    }
}
