import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { Post, PostDocument } from "./posts.model";
import { CreatePostDto } from "./create-post.dto";
import { logger } from "utils/logger";
import { Document } from 'mongoose';
import { Type } from "class-transformer";

export class PostRepository {
     constructor(
          @InjectModel(Post.name, 'MONGODB_CONNECTION')
          private readonly postModel: Model<PostDocument>,
     ) { }

     async create(postData: any): Promise<any> {
          const newPost = new this.postModel(postData);
          return this.postModel.create(postData);
     }


     async findById(postId: string) {
          return await this.postModel.findById(postId);
     }



     async findByIdAggregate(postId: string, userId: string, page = 1, limit = 10) {
          const skip = (page - 1) * limit;
          const postObjectId = new Types.ObjectId(postId);

          const pipeline: PipelineStage[] = [
               {
                    $match: { _id: postObjectId },
               },
               {
                    $lookup: {
                         from: "feels",
                         let: { postIdStr: { $toString: "$_id" } },
                         pipeline: [
                              {
                                   $match: {
                                        $expr: { $eq: ["$postId", "$$postIdStr"] },
                                   },
                              },
                              { $project: { _id: 0, userId: 1, feel_type: 1 } },
                         ],
                         as: "feels",
                    },
               },
               {
                    $addFields: {
                         feel_count: {
                              like: {
                                   $size: {
                                        $filter: {
                                             input: "$feels",
                                             cond: { $eq: ["$$this.feel_type", "like"] },
                                        },
                                   },
                              },
                              love: {
                                   $size: {
                                        $filter: {
                                             input: "$feels",
                                             cond: { $eq: ["$$this.feel_type", "love"] },
                                        },
                                   },
                              },
                              haha: {
                                   $size: {
                                        $filter: {
                                             input: "$feels",
                                             cond: { $eq: ["$$this.feel_type", "haha"] },
                                        },
                                   },
                              },
                              wow: {
                                   $size: {
                                        $filter: {
                                             input: "$feels",
                                             cond: { $eq: ["$$this.feel_type", "wow"] },
                                        },
                                   },
                              },
                              sad: {
                                   $size: {
                                        $filter: {
                                             input: "$feels",
                                             cond: { $eq: ["$$this.feel_type", "sad"] },
                                        },
                                   },
                              },
                              angry: {
                                   $size: {
                                        $filter: {
                                             input: "$feels",
                                             cond: { $eq: ["$$this.feel_type", "angry"] },
                                        },
                                   },
                              },
                         },
                         my_feel: {
                              $let: {
                                   vars: {
                                        myFeel: {
                                             $first: {
                                                  $filter: {
                                                       input: "$feels",
                                                       cond: { $eq: ["$$this.userId", userId] },
                                                  },
                                             },
                                        },
                                   },
                                   in: "$$myFeel.feel_type",
                              },
                         },
                    },
               },
               { $skip: skip },
               { $limit: limit },
          ];

          let posts = await this.postModel.aggregate(pipeline).exec();

          posts = await this.postModel.populate(posts, [
               { path: "userId", select: "name avatar" },
               { path: "friends_tagged", select: "email name avatar" },
          ]);

          return posts[0] || null;
     }


     async save(post: PostDocument) {
          const createdPost = new this.postModel(post);
          return createdPost.save();
     }

     async updatePost(postId: string, data: any) {
          return this.postModel.findByIdAndUpdate(postId, data, { new: true });
     }

     async findPosts(query: any, page: number, limit: number): Promise<any[]> {
          return this.postModel
               .find(query)
               .sort({ createdAt: -1 })
               .skip((page - 1) * limit)
               .limit(limit)
               .populate('userId', 'name avatar')
               .populate('friends_tagged', 'email name avatar').lean();
     }
     async findPostAll(query: any): Promise<any[]> {
          return this.postModel
               .find(query)
               .sort({ createdAt: -1 })
               .populate('userId', 'name avatar')
               .populate('friends_tagged', 'email name avatar').lean();
     }
     async deletePost(postId: string) {
          return this.postModel.findByIdAndDelete(postId);
     }



     async findPostsByQuery(query: any, userId: string, page: number, limit: number): Promise<any[]> {
          const skip = (page - 1) * limit;

          const pipeline: PipelineStage[] = [
               { $match: query },
               {
                    $lookup: {
                         from: "feels",
                         let: { postIdStr: { $toString: "$_id" } },
                         pipeline: [
                              {
                                   $match: {
                                        $expr: { $eq: ["$postId", "$$postIdStr"] },
                                   },
                              },
                              { $project: { _id: 0, userId: 1, feel_type: 1 } },
                         ],
                         as: "feels",
                    },
               },
               {
                    $addFields: {
                         feel_count: {
                              like: { $size: { $filter: { input: "$feels", cond: { $eq: ["$$this.feel_type", "like"] } } } },
                              love: { $size: { $filter: { input: "$feels", cond: { $eq: ["$$this.feel_type", "love"] } } } },
                              haha: { $size: { $filter: { input: "$feels", cond: { $eq: ["$$this.feel_type", "haha"] } } } },
                              wow: { $size: { $filter: { input: "$feels", cond: { $eq: ["$$this.feel_type", "wow"] } } } },
                              sad: { $size: { $filter: { input: "$feels", cond: { $eq: ["$$this.feel_type", "sad"] } } } },
                              angry: { $size: { $filter: { input: "$feels", cond: { $eq: ["$$this.feel_type", "angry"] } } } },
                         },
                         my_feel: {
                              $let: {
                                   vars: {
                                        myFeel: {
                                             $first: {
                                                  $filter: {
                                                       input: "$feels",
                                                       cond: {
                                                            $eq: [
                                                                 { $toString: "$$this.userId" },
                                                                 userId // userId là string
                                                            ]
                                                       }
                                                  }
                                             }
                                        }
                                   },
                                   in: { $ifNull: ["$$myFeel.feel_type", ""] } // nếu chưa feel trả về rỗng
                              }
                         }
                    }
               },
               { $sort: { createdAt: -1 } },
               { $skip: skip },
               { $limit: limit },
          ];

          let posts = await this.postModel.aggregate(pipeline).exec();

          posts = await this.postModel.populate(posts, [
               { path: "userId", select: "name avatar" },
               { path: "friends_tagged", select: "email name avatar" },
          ]);

          return posts;
     }






     async findFeedAggregate(
          userId: string,
          friendIds: string[],
          followIds: string[],
          sixHoursAgo: Date,
          page: number,
          limit: number,
     ) {
          const onlyFollowIds = followIds.filter((id) => !friendIds.includes(id));
          const skip = (page - 1) * limit;

          const pipeline: PipelineStage[] = [
               {
                    $match: {
                         $or: [
                              {
                                   userId: userId, // post của chính mình
                                   privacy: { $in: ["public", "friend"] },
                                   createdAt: { $gte: sixHoursAgo },
                              },
                              { userId: { $in: friendIds }, privacy: { $in: ["public", "friend"] } },
                              { userId: { $in: onlyFollowIds }, privacy: "public" },
                         ],
                    },
               },
               { $sort: { createdAt: -1 } },
               {
                    $facet: {
                         paginatedResults: [
                              { $skip: skip },
                              { $limit: limit },
                              {
                                   $lookup: {
                                        from: "feels",
                                        let: { postIdStr: { $toString: "$_id" } }, // convert ObjectId -> string
                                        pipeline: [
                                             {
                                                  $match: {
                                                       $expr: { $eq: ["$postId", "$$postIdStr"] },
                                                  },
                                             },
                                             { $project: { _id: 0, userId: 1, feel_type: 1 } },
                                        ],
                                        as: "feels",
                                   },
                              },
                              {
                                   $addFields: {
                                        feel_count: {
                                             like: {
                                                  $size: {
                                                       $filter: {
                                                            input: "$feels",
                                                            cond: { $eq: ["$$this.feel_type", "like"] },
                                                       },
                                                  },
                                             },
                                             love: {
                                                  $size: {
                                                       $filter: {
                                                            input: "$feels",
                                                            cond: { $eq: ["$$this.feel_type", "love"] },
                                                       },
                                                  },
                                             },
                                             haha: {
                                                  $size: {
                                                       $filter: {
                                                            input: "$feels",
                                                            cond: { $eq: ["$$this.feel_type", "haha"] },
                                                       },
                                                  },
                                             },
                                             wow: {
                                                  $size: {
                                                       $filter: {
                                                            input: "$feels",
                                                            cond: { $eq: ["$$this.feel_type", "wow"] },
                                                       },
                                                  },
                                             },
                                             sad: {
                                                  $size: {
                                                       $filter: {
                                                            input: "$feels",
                                                            cond: { $eq: ["$$this.feel_type", "sad"] },
                                                       },
                                                  },
                                             },
                                             angry: {
                                                  $size: {
                                                       $filter: {
                                                            input: "$feels",
                                                            cond: { $eq: ["$$this.feel_type", "angry"] },
                                                       },
                                                  },
                                             },
                                        },
                                        my_feel: {
                                             $let: {
                                                  vars: {
                                                       myFeel: {
                                                            $first: {
                                                                 $filter: {
                                                                      input: "$feels",
                                                                      cond: { $eq: ["$$this.userId", userId] }, // so sánh userId
                                                                 },
                                                            },
                                                       },
                                                  },
                                                  in: "$$myFeel.feel_type",
                                             },
                                        },
                                   },
                              },
                         ],
                         totalCount: [{ $count: "count" }],
                    },
               },
          ];

          const result = await this.postModel.aggregate(pipeline).exec();

          let posts = result[0]?.paginatedResults || [];
          posts = await this.postModel.populate(posts, [
               { path: "userId", select: "name avatar" },
               { path: "friends_tagged", select: "email name avatar" },
          ]);

          const totalItems = result[0]?.totalCount[0]?.count || 0;
          const totalPages = Math.ceil(totalItems / limit);

          return { posts, totalItems, totalPages };
     }





     findByIdAndUpdate(postId: string, data: any) {
          return this.postModel.findByIdAndUpdate({ _id: new Types.ObjectId(postId) }, data, { new: true });
     }
     updateCommentCount(postId: string, count: number) {
          return this.postModel.findByIdAndUpdate({ _id: new Types.ObjectId(postId) }, { comments: count }, { new: true });
     }
}