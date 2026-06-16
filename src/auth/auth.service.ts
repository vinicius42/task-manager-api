import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async login(email: string, password: string) {
        const userService = await this.usersService.getUserCredentials(email);

        const comparePassword = await bcrypt.compare(password, userService.password);
        if(!comparePassword){
            throw new UnauthorizedException('Invalid password')
        }

        const payload = {
            id: userService.id,
            email: userService.email,
            role: userService.role
        }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
        
    }
}
