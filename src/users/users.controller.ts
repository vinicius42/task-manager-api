import { BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
        const users = await this.usersService.getAllUsers();
        if(!users.success){
            throw new BadRequestException(users.error)
        }
        return users;
    }

    @UseGuards(JwtGuard)
    @Get('/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: string){
        const user = await this.usersService.getUserById(id);
        if(!user.success){
            throw new NotFoundException(user.error)
        }
        return user;
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async createUser(@Body() create: CreateUserDTO){
        const user = await this.usersService.createUser(create);
        if(!user.success){
            throw new BadRequestException(user.error)
        }

        return user;
    }

    @UseGuards(JwtGuard)
    @Put('/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'User not found' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
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
