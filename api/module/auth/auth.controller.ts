import { Controller, Post, Body, Get, Headers, BadRequestException, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CREATED, SuccessResponse } from '../../utils/success.response';
import { LoginUserDto } from './dto/login.dto';
import { BadRequestError } from '../../utils/error.response';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { log } from 'console';
import { logger } from '../../utils/logger';
import { AuthGuard } from './guards/access-token.guard';
import { AuthRequest } from './interfaces/auth-request.interface';
import { RefreshTokenGuard } from './guards/refresh-token.guard';




@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiBearerAuth()
    @Post('register')
    async createUser(@Body() registerUserDto: RegisterDto, @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
        try {
            const result = await this.authService.register(registerUserDto);
            return new CREATED({
                message: 'Create user successfully',
                metadata: result,
            });
        } catch (e) {
            throw new BadRequestError(e.message || 'Error creating user');
        }
    }

    @ApiBearerAuth()
    @Post('login')
    async loginUser(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {

        const result = await this.authService.loginUser(loginUserDto);
        return new SuccessResponse({
            message: 'Login successfully',
            metadata: result,
        });

    }


    
    @Post('logout')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    async logout(
        @Res({ passthrough: true }) res: Response,
        @Req() req: AuthRequest
    ) {
        logger.info(`User ID from request: ${req.user?.userId}`);
        const userId = req.user?.userId;
        if (!userId) {
            throw new UnauthorizedException('User not found in request');
        }
        logger.info(`User ID from request: ${userId}`);
        logger.info(`Logging out userId: ${userId}`);
        await this.authService.logout(userId);
        return { message: 'Logout successfully' };
    }


    @ApiHeader({
        name: 'x-refresh-token',
        description: 'refresh token',
        required: true,
        example: 'your-refresh-token-here',
    })

    
    @Post('refresh-token')
    @UseGuards(RefreshTokenGuard)
    async handlerRefreshToken(
        @Headers('x-refresh-token') refreshToken: string,
        @Req() req: AuthRequest,
    ) {
        if (refreshToken !== req.refreshToken) {
            throw new BadRequestException('Refresh token does not match');
        }

        const userId = req.user?.userId as string;
        const email = req.user?.email as string;

        const result = await this.authService.handlerRefreshToken(refreshToken, userId, email);

        return {
            statusCode: 200,
            message: 'Refresh token successfully',
            data: result,
        };
    }

}



