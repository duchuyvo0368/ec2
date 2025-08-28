import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.model';
import { User, UserDocument } from '../user/user.model';
import { convertToObject } from 'utils/index';
import { logger } from 'utils/logger';

@Injectable()
export class CommentRepository {
     constructor(
          @InjectModel(Comment.name, 'MONGODB_CONNECTION') private readonly commentModel: Model<CommentDocument>,
          @InjectModel(User.name, 'MONGODB_CONNECTION') private readonly userModel: Model<UserDocument>,
     ) { }

     async findById(id: string): Promise<any> {
          logger.info(`Finding comment by id: ${id}`);
          return this.commentModel.findById({ _id: new Types.ObjectId(id) });
     }

     async create(
          commentPostId: string,
          commentUserId: string,
          commentContent: string,
          commentParentId: string | null
     ) {
          const newComment = new this.commentModel({
               comment_post_id: commentPostId,
               comment_user_id: commentUserId,
               comment_content: commentContent,
               comment_parent_id: commentParentId || null
          });

          return await newComment.save();
     }

     async findCommentsByPostId(postId: string, limit: number, page: number) {
          const skip = (page - 1) * limit;

          // Lấy tất cả comments
          const comments = await this.commentModel.find({ comment_post_id: postId }).lean();
          if (!comments.length) {
               return { data: [], totalParents: 0, totalChildren: 0, hasMore: false };
          }

          // Debug: Liệt kê tất cả collections
          try {
               const collections = await this.commentModel.db.listCollections();
               logger.info(`Available collections: ${collections.map((c: any) => c.name).join(', ')}`);
          } catch (error) {
               logger.error(`Error listing collections: ${error}`);
          }

          // Lookup user cho từng comment
          const withUsers = await Promise.all(
               comments.map(async (c: any) => {
                    logger.info(`Looking up user for comment ${c._id}, user_id: ${c.comment_user_id}`);

                    // Thử nhiều cách khác nhau để tìm user
                    let user = null;

                    // Cách 1: Thử collection "users"
                    try {
                         user = await this.commentModel.db
                              .collection("users")
                              .findOne({ _id: new Types.ObjectId(c.comment_user_id) });
                         if (user) {
                              logger.info(`Found user in "users" collection`);
                         }
                    } catch (error) {
                         logger.error(`Error looking up user in "users" collection: ${error}`);
                    }

                    // Cách 2: Nếu không tìm thấy, thử collection "user" (số ít)
                    if (!user) {
                         try {
                              user = await this.commentModel.db
                                   .collection("user")
                                   .findOne({ _id: new Types.ObjectId(c.comment_user_id) });
                              if (user) {
                                   logger.info(`Found user in "user" collection`);
                              }
                         } catch (error) {
                              logger.error(`Error looking up user in "user" collection: ${error}`);
                         }
                    }

                    // Cách 3: Thử tìm bằng string ID
                    if (!user) {
                         try {
                              user = await this.commentModel.db
                                   .collection("users")
                                   .findOne({ _id: c.comment_user_id });
                              if (user) {
                                   logger.info(`Found user with string ID`);
                              }
                         } catch (error) {
                              logger.error(`Error looking up user with string ID: ${error}`);
                         }
                    }

                    // Cách 4: Sử dụng User model
                    if (!user) {
                         try {
                              user = await this.userModel.findById(c.comment_user_id).lean();
                              if (user) {
                                   logger.info(`Found user using User model`);
                              }
                         } catch (error) {
                              logger.error(`Error looking up user with User model: ${error}`);
                         }
                    }

                    logger.info(`Final user result: ${user ? JSON.stringify(user) : 'null'}`);

                    return {
                         ...c,
                         user,
                         _id: c._id.toString(),
                         comment_post_id: c.comment_post_id?.toString(),
                         comment_user_id: c.comment_user_id?.toString(),
                         comment_parent_id: c.comment_parent_id ? c.comment_parent_id.toString() : null
                    };
               })
          );

          // Chia cha / con
          const parents = withUsers.filter((c: any) => !c.comment_parent_id);
          const children = withUsers.filter((c: any) => !!c.comment_parent_id);

          // Phân trang cha
          const paginated = parents
               .sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt))
               .slice(skip, skip + limit);

          // Build replies đệ quy
          const buildTree = (pid: string): any[] =>
               children.filter((c: any) => c.comment_parent_id === pid)
                    .map((c: any) => ({ ...c, replies: buildTree(c._id) }));

          // Gắn replies
          const result = paginated.map((p: any) => ({ ...p, replies: buildTree(p._id) }));

          logger.info(`Final result: ${JSON.stringify(result, null, 2)}`);

          return {
               data: result,
               totalParents: parents.length,
               totalChildren: children.length,
               totalComments: comments.length,
               hasMore: skip + limit < parents.length,
          };
     }





     async deleteCommentAndChildren(commentId: string) {
          const allComments = await this.commentModel.find().select('_id comment_parent_id').lean();

          const commentMap = allComments.reduce((map, c) => {
               if (c.comment_parent_id) {
                    const pid = String(c.comment_parent_id);
                    map[pid] = map[pid] || [];
                    map[pid].push(String(c._id));
               }
               return map;
          }, {} as Record<string, string[]>);


          const getAllDescendants = (id: string): string[] => {
               const children = commentMap[id] || [];
               return children.reduce((acc, childId) => {
                    acc.push(childId);
                    acc.push(...getAllDescendants(childId));
                    return acc;
               }, [] as string[]);
          };

          const idsToDelete = [commentId, ...getAllDescendants(commentId)];


          await this.commentModel.deleteMany({ _id: { $in: idsToDelete } });

          return { deletedCount: idsToDelete.length };
     }

     async commentCount(postId: string) {
          return this.commentModel.countDocuments({ comment_post_id: postId });
     }
}

