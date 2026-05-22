import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserInput, UpdateUserInput } from 'src/types/user.types';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    getAllUsers(){
        const users = this.usersService.getAllUsers();
        if(!users.success){
            throw new BadRequestException(users.error)
        }
        return users;
    }

    @Get('/:id')
    getUserById(@Param('id') id: string){
        const user = this.usersService.getUserById(id);
        if(!user.success){
            throw new NotFoundException(user.error)
        }
        return user;
    }

    @Post()
    @HttpCode(201)
    createUser(@Body() create: CreateUserInput){
        const user = this.usersService.createUser(create);
        if(!user.success){
            throw new BadRequestException(user.error)
        }

        return user;
    }

    @Put('/:id')
    updateUser(@Param('id') id: string, @Body() update: UpdateUserInput){
        const user = this.usersService.updateUser(id, update)
        if(!user.success){
            if(user.error == 'User not found'){
                throw new NotFoundException(user.error)
            }
            throw new BadRequestException(user.error)
        }
        return user;
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string){
        const user = this.usersService.deleteUser(id);
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
