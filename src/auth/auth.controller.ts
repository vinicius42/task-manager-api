import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDTO: loginDTO){
        const userLogin = await this.authService.login(loginDTO.email, loginDTO.password)
        if(!userLogin.success){
            throw new UnauthorizedException(userLogin.error)
        }
        return userLogin;
    }
}
