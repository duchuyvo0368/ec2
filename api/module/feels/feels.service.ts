import { BadRequestException, Injectable } from "@nestjs/common";
import { Feel, FeelDocument, } from "./feels.model";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFeelAdminDto, CreateFeelDto } from "./create-feel.dto";
import { FeelRepository } from "./feel.repository";



@Injectable()
export class FeelService {
     constructor(private readonly feelRepo: FeelRepository) { }

     //   async createFeel(
     //     createFeelDto: CreateFeelDto,
     //     userId: string,
     //     postId: string,
     //   ): Promise<FeelDocument> {
     //     return this.feelRepo.createFeel({
     //       data:createFeelDto,
     //       userId,
     //       postId,
     //     });
     //   }

     async findByUserAndPost(
          userId: Types.ObjectId,
          postId: Types.ObjectId,
     ): Promise<FeelDocument | null> {
          return this.feelRepo.findByUserAndPost(userId, postId);
     }

     async countFeelByPost(postId: Types.ObjectId): Promise<any[]> {
          return this.feelRepo.countFeelByPost(postId);
     }
     async deleteFeelById(postId: string): Promise<any> {
          return this.feelRepo.deleteFeelById(postId);
     }



     async updateFeel(
          feelId: string,
          postId: string,
          type: "like" | "love" | "haha" | "wow" | "sad" | "angry" | "",
     ): Promise<FeelDocument | null> {
          return this.feelRepo.upsertFeel(feelId, postId, type);
     }
     async getFeelByPost(postId: string): Promise<any[]> {
          return this.feelRepo.getFeelByPost(postId);
     }
}