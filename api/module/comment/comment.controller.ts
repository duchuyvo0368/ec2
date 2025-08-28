import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CREATED, SuccessResponse } from "utils/success.response";
import { logger } from "utils/logger";
import { AuthGuard } from "module/auth/guards/access-token.guard";
import { AuthRequest } from "module/auth/interfaces/auth-request.interface";
import { CommentGateway } from "./comment.gateway";

@ApiTags("Comment")
@Controller("comment")
export class CommentController {
    constructor(
         private readonly commentService: CommentService, 
         private readonly commentGateway: CommentGateway
    ) { }



    @Post("create")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new comment' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                commentPostId: { type: 'string', example: '689c008bb2eefbfe05e9ddc6' },
                commentUserId: { type: 'string', example: '689424d5c9447fcf37f53ad2' },
                commentContent: { type: 'string', example: 'This is a comment' },
                commentParentId: { type: 'string', example: 'parentCommentId', nullable: true },
            },
            required: ['commentPostId', 'commentUserId', 'commentContent'],
        },
    })
    async createComment(@Body() body: any) {
        const { commentPostId, commentUserId, commentContent, commentParentId } = body;
        if (!commentPostId || !commentUserId || !commentContent) {
            throw new BadRequestException('Missing required fields');
        }
         const result = await this.commentService.createComment(commentPostId, commentUserId, commentContent, commentParentId);
         this.commentGateway.sendNewComment(commentPostId, result);
        return new SuccessResponse({
            metadata: result,
            message: "Create comment successfully",
        })
        
    }

    @Get(":postId")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get comments by post id' })
    @ApiParam({ name: 'postId', required: true, description: 'Post id' })
    async getCommentsByPostId(@Param('postId') postId: string, @Query('limit') limit: number, @Query('page') page: number,) {
        if (!postId) {
            throw new BadRequestException('Missing required fields');
        }
        const limitDefault = limit || 10;
        const pageDefault = page || 1;
        const result = await this.commentService.findCommentsParent(postId, limitDefault, pageDefault);
        return new SuccessResponse({
           metadata: result,
            message: "Get comments successfully",
        })
    }
    


   




  
    @Post("delete")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                commentId: { type: 'string', example: '689c008bb2eefbfe05e9ddc6' },
            },
            required: ['commentId'],
        },
    })
    async deleteComments(@Body('commentId') commentId: string) {
      
        if (!commentId) {
            throw new BadRequestException('Missing required fields');
        }
       const result = await this.commentService.deleteComment(commentId);
        return new SuccessResponse({
            metadata: result,
            message: "Delete comment successfully",
        })
        
    }
    

}