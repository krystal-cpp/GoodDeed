import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}