import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { err, ok } from 'src/utils/result';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async login(email: string, password: string) {
        const userService = await this.usersService.getUserByEmail(email);

        if(!userService.success){
            return err('User not found')
        }

        const comparePassword = await bcrypt.compare(password, userService.data.password);
        if(!comparePassword){
            return err('Invalid password')
        }

        const payload = {
            id: userService.data.id,
            email: userService.data.email,
            role: userService.data.role
        }

        return ok ({
            access_token: await this.jwtService.signAsync(payload)
        })  
        
    }
}
