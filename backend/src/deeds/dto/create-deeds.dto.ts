import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateDeedDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}