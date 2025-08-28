import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Patch,
    Delete,
    NotFoundException,
    UseGuards,
    Req,
    UploadedFiles,
    UseInterceptors,
    UploadedFile,
    Query,
    UnauthorizedException,
    BadRequestException
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { SuccessResponse, CREATED } from '../../utils/success.response';
import { logger } from '../../utils/logger';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';
import { uploadConfig } from 'module/upload/utils/multer.config';
import { AuthFailureError } from 'utils/error.response';
import { MulterS3File } from 'module/upload/utils/multe.s3.file';


@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiQuery({ name: 'limit', example: '12' })
    @ApiQuery({ name: 'page', example: '1' })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('all')
    async getAllUsers(
        @Query('limit') limit: string = '12',
        @Query('page') page: string = '1',
        @Req() req: AuthRequest,
    ) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthFailureError("User auth")
        }
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);

        const result = await this.userService.getAllUsers(
            userId,
            limitNumber,
            pageNumber,
        );

        return new SuccessResponse({
            message: 'User list fetched successfully',
            metadata: result,
        });
    }

    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', uploadConfig))
    async uploadAvatar(
        @UploadedFile() file: MulterS3File,
        @Req() req: AuthRequest,
    ) {
        const userId = req.user!!.userId;
        if (!userId) {
            throw new AuthFailureError("User auth")
        }
        return await this.userService.updateAvatar(userId, 'avatar', file);

    }
    @Get('/search')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'query', example: 'huy' })
    async searchUsers(@Query('query') query: string, @Query('page') page: string = '1', @Query('limit') limit: string = '5', @Req() req: AuthRequest) {
        if (!query) {
            throw new BadRequestException('Query is required');
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthFailureError("User auth")
        }
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);

        const result = await this.userService.searchUsers(
            userId,
            query,
            limitNumber,
            pageNumber,
        );

        return new SuccessResponse({
            message: 'User list fetched successfully',
            metadata: result,
        });


    }


    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('profile/:userId')
    async getUserProfile(
        @Param('userId') id: string,
        @Req() req: AuthRequest,
    ) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthFailureError("User auth")
        }
        const result = await this.userService.getProfile(
            userId,
            id,
        );

        return new SuccessResponse({
            message: 'User profile fetched successfully',
            metadata: result,
        });
    }
    async editProfile(@Req() req: AuthRequest, @Body() body: UserDto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AuthFailureError("User auth")
        }
        const result = await this.userService.editProfile(
            userId,
            body,
        );

        return result;
    }




}


