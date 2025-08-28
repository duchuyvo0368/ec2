import { Controller, Post, Param, Body, Req, UseGuards, BadRequestException, Get, Delete } from '@nestjs/common';
import { FeelService } from './feels.service';
import { AuthGuard } from '../auth/guards/access-token.guard'; // tuỳ hệ thống của bạn
import { CreateFeelDto } from './create-feel.dto';
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';



@ApiTags('Feel')
@Controller('feel')
export class FeelController {
     constructor(private readonly feelService: FeelService) { }



     @ApiBody({
          type: CreateFeelDto,
          description: 'The ID of the post and the type of feel',
          examples: {
               example1: {
                    summary: 'Like a post',
                    value: {
                         postId: '12345',
                         type: 'like',
                    },
               },
               example2: {
                    summary: 'Remove reaction',
                    value: {
                         postId: '12345',
                         type: '',
                    },
               },
          },
     })
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Post('')
     async updateFeel(
          @Body() body: { postId: string; type: "like" | "love" | "haha" | "wow" | "sad" | "angry" | "" },
          @Req() req: AuthRequest,
     ) {
          const userId = req?.user?.userId;
          const { postId, type } = body;

          if (!userId) {
               throw new BadRequestException('User ID is required');
          }

          const result = await this.feelService.updateFeel(userId, postId, type);
          return { message: 'Feel updated successfully', data: result };
     }



     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Get(':postId')
     async getFeelByPost(@Param('postId') postId: string, @Req() req: AuthRequest) {
          const userId = req?.user?.userId;

          if (!userId) {
               throw new BadRequestException('User ID is required');
          }

          const result = await this.feelService.getFeelByPost(postId);
          return { message: 'Feel summary retrieved successfully', data: result };
     }

     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Delete(':postId')
     async deleteFeelByPost(@Param('postId') postId: string, @Req() req: AuthRequest) {
          const userId = req?.user?.userId;
          if (!userId) {
               throw new BadRequestException('User ID is required');
          }

          const result = await this.feelService.deleteFeelById(postId);
          return { message: 'Feel deleted successfully', data: result };
     }
}



