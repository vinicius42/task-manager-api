import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/types/user.types";

export class CreateUserDTO {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty({message: 'Password cannot be empty'})
    password!: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}