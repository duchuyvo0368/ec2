import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateFeelDto {

    @IsString()
    @IsNotEmpty()
    feel_name: string;

    @IsString()
    @IsOptional()
    feel_type?: string;

    @IsString()
    @IsOptional()
    feel_image?: string;
}




export class CreateFeelAdminDto{
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    feel_name: string;

    @IsString()
    @IsOptional()
    feel_type?: string;

    @IsString()
    @IsOptional()
    feel_image?: string;
}