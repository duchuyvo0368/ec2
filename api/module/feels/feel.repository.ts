import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feel, FeelDocument } from './feels.model';
import { Model, Types } from 'mongoose';
import { CreateFeelDto } from './create-feel.dto';

@Injectable()
export class FeelRepository {
     constructor(
          @InjectModel(Feel.name, 'MONGODB_CONNECTION')
          private readonly feelModel: Model<FeelDocument>,
          
     ) { }

     async findByUserAndPost(userId: Types.ObjectId, postId: Types.ObjectId) {
          return this.feelModel.findOne({ user_id: userId, post_id: postId });
     }

     async findByIdPost(postId: string): Promise<FeelDocument[] | []> {
          return this.feelModel.find({ post_id: postId });
     }
     async createFeel(
          data: CreateFeelDto,
          userId: string,
          postId: string,
     ): Promise<FeelDocument> {
          return this.feelModel.create({
               ...data,
               userId,
               postId,
          });
     }

     async upsertFeel(
          userId: string,
          postId: string,
          newType: "like" | "love" | "haha" | "wow" | "sad" | "angry" | "",
     ): Promise<FeelDocument | null> {
          const existing = await this.feelModel.findOne({ userId, postId });

          if (newType === "") {
               if (existing) {
                    await this.feelModel.deleteOne({ _id: existing._id });
               }
               return null;
          }

          if (!existing) {
               const newFeel = new this.feelModel({ userId, postId, feel_type: newType });
               return newFeel.save();
          }

          if (existing.feel_type === newType) {
               await this.feelModel.deleteOne({ _id: existing._id });
               return null;
          }

          existing.feel_type = newType;
          return existing.save();
     }


     async deleteFeelById(postId: string): Promise<any> {
          return this.feelModel.deleteMany({ post_id: postId });
     }

     async countFeelByPost(postId: Types.ObjectId) {
          return this.feelModel.aggregate([
               { $match: { post_id: postId } },
               {
                    $group: {
                         _id: '$feel_name',
                         count: { $sum: 1 },
                    },
               },
          ]);
     }
     async getFeelByPost(postId: string): Promise<any[]> {
          return this.feelModel
               .find({ postId })               
               .select('userId feel_type -_id')  
               .populate({ path: 'userId', select: 'name avatar' })  
               .lean();
     }

}
