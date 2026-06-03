import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}