import {
     Controller,
     Get,
     Post,
     Body,
     Patch,
     Param,
     Delete,
     UseGuards,
     Req,
     Query,
     BadRequestException,
     UnauthorizedException,
     UploadedFile,
     UseInterceptors,
     UploadedFiles,
     HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import {
     ApiBearerAuth,
     ApiBody,
     ApiOperation,
     ApiParam,
     ApiQuery,
} from '@nestjs/swagger';
import { isValidUrl } from '../../utils/index';
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { uploadConfig } from 'module/upload/utils/multer.config';
import { MulterS3File } from 'module/upload/utils/multe.s3.file';
import { CreatePostDto, EditPostDto } from './create-post.dto';
import { logger } from 'utils/logger';
import { SuccessResponse } from 'utils/success.response';
@Controller('posts')
export class PostsController {
     constructor(private readonly postService: PostsService) { }



     @Get('user')
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @ApiOperation({ summary: 'Get posts by user' })
     @ApiQuery({
          name: 'userId',
          required: true,
          type: String,
          example: '689424f7c9447fcf37f53ade',
          description: 'User ID',
     })
     @ApiQuery({
          name: 'page',
          required: false,
          type: Number,
          example: 1,
          description: 'Current page number (default = 1)',
     })
     @ApiQuery({
          name: 'limit',
          required: false,
          type: Number,
          example: 10,
          description: 'Number of posts per page (default = 10)',
     })
     async getPostsByType(
          @Req() req: AuthRequest,
          @Query('userId') userId: string,
          @Query('page') page: number,
          @Query('limit') limit: number,
     ) {
          const requesterId = req.user?.userId;

          logger.info(`Parsed userID: ${userId}, requesterId: ${requesterId}`);

          if (!requesterId) {
               throw new UnauthorizedException('Requester not found in request');
          }
          if (!userId) {
               throw new BadRequestException('Target user ID is required');
          }

          const parsedPage = page || 1;
          const parsedLimit = limit || 10;

          logger.info(`Fetching posts of user ${userId} requested by ${requesterId}`);

          const result = await this.postService.getPostsByUserWithAccess(
               userId,
               requesterId,
               parsedPage,
               parsedLimit,
          );

          return result;
     }



     @UseGuards(AuthGuard)
     @ApiBearerAuth()
     @Post('create')
     @ApiOperation({ summary: 'Create Post' })
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    title: { type: 'string', example: 'Title Post' },
                    content: { type: 'string', example: 'Content Post' },
                    privacy: { type: 'string', example: 'public | friend' },
                    friends_tagged: { type: 'array', items: { type: 'string' }, example: ['689424f7c9447fcf37f53ade'] },
                    hashtags: {
                         type: 'array',
                         items: { type: 'string' },
                         example: ['nestjs', 'backend'],
                    },
                    images: {
                         type: 'array',
                         items: { type: 'string' },
                         example: ['https://example.com/image1.jpg'],
                    },
                    videos: {
                         type: 'array',
                         items: { type: 'string' },
                         example: ['https://example.com/video1.mp4'],
                    },
                    post_link_meta: {
                         type: 'object',
                         properties: {
                              post_link_url: { type: 'string', example: 'https://vnexpress.net/...' },
                              post_link_title: { type: 'string', example: 'Title link' },
                              post_link_description: { type: 'string', example: 'Mô tả link' },
                              post_link_image: { type: 'string', example: 'https://...' },
                         }
                    }
               },

          }
     })
     async create(@Body() body: CreatePostDto, @Req() req: AuthRequest) {
          const userId = req.user?.userId;
          if (!userId) throw new UnauthorizedException('User not found in request');
          logger.info('Creating post with data:', body);
          return this.postService.createPost(body, userId);
     }






     @ApiBearerAuth()
     @ApiBody({
          description: 'URL extract metadata',
          type: Object,
          examples: {
               example: {
                    summary: 'Example',
                    value: {
                         url: 'https://vnexpress.net/lo-hong-tu-vu-lat-tau-vinh-xanh-4917031.html',
                    },
               },
          },
     })
     @UseGuards(AuthGuard)
     @Post('extract-link-metadata')
     async extractLinkMetadata(@Body('url') url: string) {
          if (!isValidUrl(url)) {
               throw new BadRequestException('Error URL');
          }
          const metadata = await this.postService.extractLinkMetadata(url);
          logger.info('Extracted metadata:', metadata);
          return { metadata };
     }

    

     @ApiOperation({ summary: 'Get posts by type friend ' })
     @ApiQuery({
          name: 'type',
          enum: ['friend', 'public'],
          required: true,
          description: 'Type of posts to retrieve',
     })
     @ApiQuery({
          name: 'page',
          required: false,
          type: Number,
          example: 1,
          description: 'Current page number (default = 1)',
     })
     @ApiQuery({
          name: 'limit',
          required: false,
          type: Number,
          example: 10,
          description: 'Number of posts per page (default = 10)',
     })
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Get('')
     async getFriendPosts(
          @Req() req: AuthRequest,
          @Query('page') page: number,
          @Query('limit') limit: number,
     ) {
          const userId = req.user?.userId;
          if (!userId) {
               throw new UnauthorizedException('User not found in request');
          }
          const parsedPage = Number(page) || 1;
          const parsedLimit = Number(limit) || 1;

          return this.postService.getFeedPosts(userId, parsedPage, parsedLimit);
     }

     @ApiOperation({ summary: 'Edit post' })
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Patch(':postId')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    title: { type: 'string', example: 'Title Post' },
                    content: { type: 'string', example: 'Content Post' },
                    privacy: { type: 'string', example: 'public | friend | private' },
                    hashtags: {
                         type: 'array',
                         items: { type: 'string' },
                         example: ['nestjs', 'backend'],
                    },
                    images: {
                         type: 'array',
                         items: { type: 'string' },
                         example: ['https://example.com/image1.jpg'],
                    },
                    videos: {
                         type: 'array',
                         items: { type: 'string' },
                         example: ['https://example.com/video1.mp4'],
                    },
                    post_link_meta: {
                         type: 'object',
                         properties: {
                              post_link_url: { type: 'string', example: 'https://vnexpress.net/...' },
                              post_link_title: { type: 'string', example: 'Title link' },
                              post_link_description: { type: 'string', example: 'Mô tả link' },
                              post_link_image: { type: 'string', example: 'https://...' },
                         }
                    }
               },
               required: ['title', 'content']
          }
     })
     async updatePost(
          @Param('postId') postId: string,
          @Body() body: EditPostDto,
          @Req() req: AuthRequest,
     ) {
          const userId = req.user?.userId;
          if (!userId) {
               throw new UnauthorizedException('User not found in request');
          }
          await this.postService.updatePost(postId, body, userId);
          return new SuccessResponse({ message: 'Edit post successfully' });
     }

     @ApiOperation({ summary: 'Delete post' })
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Delete(':postId')
     @HttpCode(204)
     async deletePost(
          @Param('postId') postId: string,
          @Req() req: AuthRequest,
     ) {
          const userId = req.user?.userId;
          if (!userId) {
               throw new UnauthorizedException('User not found in request');
          }
          await this.postService.deletePost(postId, userId);
          return new SuccessResponse({ message: 'Delete post successfully' });
     }

     @ApiOperation({ summary: 'Get post by id' })
     @ApiBearerAuth()
     @UseGuards(AuthGuard)
     @Get(':postId')
     async getPostById(@Param('postId') postId: string, @Req() req: AuthRequest) {
          if (!postId) {
               throw new BadRequestException('Post ID is required');
          }
          if (!req.user?.userId) {
               throw new UnauthorizedException('User not found in request');
          }
          const post = await this.postService.getPostById(postId, req.user?.userId);
          return new SuccessResponse({ message: 'Get post successfully', metadata: post });
     }
     
}
