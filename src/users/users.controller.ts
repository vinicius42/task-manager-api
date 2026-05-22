import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserInput, UpdateUserInput } from 'src/types/user.types';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    getAllUsers(){
        return this.usersService.getAllUsers();
    }

    @Get('/:id')
    getUserById(@Param('id') id: string){
        return this.usersService.getUserById(id);
    }

    @Post()
    createUser(@Body() create: CreateUserInput){
        return this.usersService.createUser(create);
    }

    @Put('/:id')
    updateUser(@Param('id') id: string, @Body() update: UpdateUserInput){
        return this.usersService.updateUser(id, update);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string){
        return this.usersService.deleteUser(id);
    }
}
