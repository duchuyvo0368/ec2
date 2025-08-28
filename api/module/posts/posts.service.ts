import { PostsModule } from 'module/posts/posts.module';
import { Post, PostDocument } from './posts.model';
import { extractMetadata } from './../../utils/extractMetadata';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { logger } from 'utils/logger';
import { FriendService } from 'module/firends/friends.service';
import { Types } from 'mongoose';
import { CreatePostDto, EditPostDto } from './create-post.dto';
import { FriendRelation } from '../firends/friend.model';
import { PostRepository } from './post.reponsitory';
import { convertToObject } from 'utils/index';
import { CommentService } from 'module/comment/comment.service';

@ApiTags('Post')
@Injectable()
export class PostsService {
    constructor(
        private readonly friendService: FriendService,
        private readonly postRepository: PostRepository,
    ) { }


     async extractLinkMetadata(content: string) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const match = content.match(urlRegex);
          if (!match) return null;

          // Lấy link đầu tiên
          const url = match[0].replace(/[.,!?)]*$/, '');
          return await extractMetadata(url);
     }



    async createPost(dto: CreatePostDto, userId: string): Promise<PostDocument> {
        const newPostData = {
            userId: userId, 
            title: dto.title || "",
            content: dto.content || "",
            privacy: dto.privacy || "public",
            hashtags: dto.hashtags || [],
            images: dto.images || [],
            videos: dto.videos || [],
            friends_tagged: (dto.friends_tagged || []).map(id => new Types.ObjectId(id)),
            post_link_meta: dto.post_link_meta?.post_link_url ? dto.post_link_meta : undefined,
            comments: 0,
            views: 0,
        };
        return this.postRepository.create(newPostData);
    }









  
    async getFeedPosts(userId: string, page: number, limit: number) {
        const [friendIds, followIds] = await Promise.all([
            this.friendService.getFriendUserIds(userId),
            this.friendService.getFollowingUserIds(userId),
        ]);

        const sixHoursAgo = new Date(Date.now() - 248 * 60 * 60 * 1000);

        const { posts, totalItems, totalPages } = await this.postRepository.findFeedAggregate(
            userId,
            friendIds,
            followIds,
            sixHoursAgo,
            page,
            limit
        );

        if (Array.isArray(posts) && posts.length > 0) {
            logger.info(`Posts: ${JSON.stringify(posts[0]._id)}`);
        }

            

        return {
            data: posts,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
            }
        };
    }








   
    async getPostById(postId: string, userId: string) {
        const post = await this.postRepository.findByIdAggregate(postId, userId);
        if (!post) throw new BadRequestException('Post not found');
        return post; 
    }

    async updatePost(postId: string, data: EditPostDto, userId: string) {
        const post = await this.postRepository.findById(postId);
        if (!post) throw new BadRequestException('Post not found');
        if (post.userId.toString() !== userId) throw new BadRequestException('You are not the owner of this post');
        return this.postRepository.updatePost(postId, data);
    }


   
    async deletePost(postId: string, userId: string) {
        const post = await this.postRepository.findById(postId);
        if (!post) throw new BadRequestException('Post not found');
        if (post.userId.toString() !== userId) throw new BadRequestException('You are not the owner of this post');
        return this.postRepository.deletePost(postId);
    }

   
   










    async getAccessLevel(userId: string, requesterId: string): Promise<'owner' | 'friend' | 'public'> {
        if (userId === requesterId) return 'owner';

        logger.info(`userId: ${userId}, requesterId: ${requesterId}`);
        const isFriend = await this.friendService.isFriend(userId, requesterId);
        logger.info(`isFriend: ${isFriend}`);
        return isFriend ? 'friend' : 'public';
    }

    async buildPostQuery(userId: string, accessLevel: 'owner' | 'friend' | 'public') {
        switch (accessLevel) {
            case 'owner':
                return { userId };
            case 'friend':
                return { userId, privacy: { $in: ['public', 'friend'] } };
            case 'public':
            default:
                return { userId, privacy: 'public' };
        }
    }

     async getPostsByUserWithAccess(
          userId: string,
          requesterId: string,
          page: number,
          limit: number,
     ) {
          const accessLevel = await this.getAccessLevel(userId, requesterId);
          logger.info(`accessLevel: ${accessLevel}`);

          const query = await this.buildPostQuery(userId, accessLevel);
          logger.info(`query: ${JSON.stringify(query)}`);

          const data = await this.postRepository.findPostsByQuery(query, requesterId, page, limit);


       

          return {
               data,
               pagination: {
                    page,
                    limit,
                    totalItems:data.length,
                    totalPages: Math.ceil(data.length / limit),
               },
          };
     }
    
    async findByIdAndUpdate(postId: string, data: any) {
        return this.postRepository.findByIdAndUpdate(postId, data);
     }
     async updateCommentCount(postId: string, count: number) {
        return this.postRepository.updateCommentCount(postId, count);
     }

}
