import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserInput, UpdateUserInput } from 'src/types/user.types';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseGuards(JwtGuard)
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of users' })
    async getAllUsers(){
        return await this.usersService.getAllUsers();
    }

    @UseGuards(JwtGuard)
    @Get('/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: string){
        return await this.usersService.getUserById(id);
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Conflict - Email already exists' })
    async createUser(@Body() create: CreateUserDTO){
        const createUserType: CreateUserInput = {
            email: create.email,
            password: create.password,
            role: create.role
        }
        return await this.usersService.createUser(createUserType);
    }

    @UseGuards(JwtGuard)
    @Put('/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(@Param('id') id: string, @Body() update: UpdateUserDTO){
        const updateUserType: UpdateUserInput = {
            email: update.email,
            password: update.password,
            role: update.role
        }
        return await this.usersService.updateUser(id, updateUserType)
    }

    @UseGuards(JwtGuard)
    @Delete('/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(@Param('id') id: string){
        return await this.usersService.deleteUser(id);
    }
}
