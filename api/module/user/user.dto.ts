import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserDto {
    @IsOptional()
    @IsNotEmpty({ message: 'Name should not be empty' })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid email address' })
    email?: string;

    @IsOptional()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Avatar is required' })
    avatar?: string;

    @IsOptional()
    bio?: string;
}
