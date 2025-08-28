import { PostsService } from './../posts/posts.service';
import { async } from 'rxjs';
import { convertToObject } from './../../utils/index';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.model';
import { logger } from 'utils/logger';
import { CommentGateway } from './comment.gateway';

@Injectable()
export class CommentService {
     constructor(
          private readonly commentRepository: CommentRepository,
          private readonly postsService: PostsService,
          private readonly commentGateway: CommentGateway
     ) { }

     async createComment(commentPostId: string, commentUserId: string, commentContent: string, commentParentId: string): Promise<Comment> {
          if (commentParentId && !(await this.commentRepository.findById(commentParentId))) {
               throw new NotFoundException('Comment parent not found');
          }

          const comment = await this.commentRepository.create(
               commentPostId,
               commentUserId,
               commentContent,
               commentParentId,
          );

          await this.postsService.findByIdAndUpdate(
               commentPostId,
               { $inc: { comments: 1 } }
          );

          // Emit socket event cho comment mới
          this.commentGateway.sendNewComment(commentPostId, comment);

          return comment;
     }

     async findCommentsParent(postId: string, limit: number, page: number) {
          const comments = await this.commentRepository.findCommentsByPostId(postId, limit, page);
          return comments;
     }

     async deleteComment(commentId: string) {
          const comment = await this.commentRepository.findById(commentId);
          if (!comment) {
               throw new NotFoundException('Comment not found');
          }

          const deletedCount = await this.commentRepository.deleteCommentAndChildren(commentId);
          const count = await this.commentRepository.commentCount(comment.comment_post_id);
          await this.postsService.updateCommentCount(comment.comment_post_id, count);

          return { deletedCount };
     }

     async commentCount(postId: string) {
          return this.commentRepository.commentCount(postId);
     }
}
