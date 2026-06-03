import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from "class-validator";

export class UpdateDeedDTO {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;
}