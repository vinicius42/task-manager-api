import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserInput, UpdateUserInput } from 'src/types/user.types';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseGuards(JwtGuard)
    @Get()
    async getAllUsers(){
        const users = await this.usersService.getAllUsers();
        if(!users.success){
            throw new BadRequestException(users.error)
        }
        return users;
    }

    @UseGuards(JwtGuard)
    @Get('/:id')
    async getUserById(@Param('id') id: string){
        const user = await this.usersService.getUserById(id);
        if(!user.success){
            throw new NotFoundException(user.error)
        }
        return user;
    }

    @Post()
    @HttpCode(201)
    async createUser(@Body() create: CreateUserDTO){
        const user = await this.usersService.createUser(create);
        if(!user.success){
            throw new BadRequestException(user.error)
        }

        return user;
    }

    @UseGuards(JwtGuard)
    @Put('/:id')
    async updateUser(@Param('id') id: string, @Body() update: UpdateUserDTO){
        const user = await this.usersService.updateUser(id, update)
        if(!user.success){
            if(user.error == 'User not found'){
                throw new NotFoundException(user.error)
            }
            throw new BadRequestException(user.error)
        }
        return user;
    }

    @UseGuards(JwtGuard)
    @Delete('/:id')
    async deleteUser(@Param('id') id: string){
        const user = await this.usersService.deleteUser(id);
        if(!user.success){
            if(user.error == 'User not found'){
                throw new NotFoundException(user.error)
            } else {
                throw new BadRequestException(user.error)
            }
        }
        return user;
    }
}
