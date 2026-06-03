import { Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDTO: loginDTO){
        const userLogin = await this.authService.login(loginDTO.email, loginDTO.password)
        if(!userLogin.success){
            throw new UnauthorizedException(userLogin.error)
        }
        return userLogin;
    }
}
