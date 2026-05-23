import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/types/user.types";

export class UpdateUserDTO{
    @IsEmail({}, {message: 'Invalid email format'})
    @IsOptional()
    email!:string;

    @IsString({message: 'Password must be a string'})
    @IsNotEmpty({message: 'Password cannot be empty'})
    @IsOptional()
    password!:string;

    @IsEnum(UserRole, {message: 'Role must be admin or member'})
    @IsOptional()
    role?:UserRole;
}