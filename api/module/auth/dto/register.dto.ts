import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'voduchuy', description: 'Tên tài khoản' })
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;
    @ApiProperty({ example: 'voduchuy016688@gmail.com', description: 'Email' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;
    @ApiProperty({ example: '123456', description: 'Password' })
    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
}
