import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    Req,
    UseGuards,
    HttpCode,
    Patch,
    BadRequestException,
    Query,
    Delete,
    DefaultValuePipe,
    ParseIntPipe,
    UnauthorizedException,
} from '@nestjs/common';
import { FriendService } from './friends.service';
import { CREATED, SuccessResponse } from '../../utils/success.response';
import { logger } from '../../utils/logger';
import { BadRequestError, NotFoundError } from '../../utils/error.response';

import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';


@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendService) { }




    @Get('')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'type',
        enum: ['all', 'sent', 'pending'],
        required: true,
        description: 'all = all accepted friends, sent = sent friend requests, pending = received pending friend requests',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit number of results (optional, default = 10)',
    })
    async getFriendList(
        @Query('type') type: 'all' | 'sent' | 'pending', @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Req() req: Request,
    ) {
        const userId = (req as any).user.userId;
         const { message, result } = await this.friendsService.getFriendListByType(userId, type, limit);

        

        return new SuccessResponse({
            message,
            metadata: result,
        });
    }
    




    @Post('/update-status')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: {
                    type: 'string',
                    example: 'abc123',
                },
                type: {
                    type: 'string',
                    enum: ['accept', 'reject', 'deleted', 'send', 'unfriend'],
                    example: 'send',
                    description:
                        'accept = đồng ý, reject = từ chối, deleted = xóa bạn, send = gửi lời mời, unfriend = hủy kết bạn',
                },
            },
            required: ['userId', 'type'],
        },
    })

    async handleFriendRequestStatus(@Body('userId') toUser: string, @Body('type') type: 'accept' | 'reject' | 'deleted' | 'unfriend' | 'send' | 'follow' | 'unfollow', @Req() req: AuthRequest) {
        const fromUser = req.user?.userId;
        if (!fromUser) {
            throw new UnauthorizedException('User not found in request');
        }
        logger.info(`Accepting requestId:${fromUser} and ${toUser} with action: ${type}`);
        const result = await this.friendsService.handleFriendRequestAction(fromUser, toUser, type);
        return new SuccessResponse({
            message: result.message,
            metadata: result,
        });

    }

  


}



