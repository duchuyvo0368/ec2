
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { KeyToken } from './keyToken.model';
import { KeyTokenDocument } from './keyToken.model';
import { Model, Types } from 'mongoose';
import { convertToObject } from 'utils';

@Injectable()
export class KeyTokenService {
     constructor(
          @InjectModel(KeyToken.name, 'MONGODB_CONNECTION')
          private keyTokenDocument: Model<KeyTokenDocument>,
     ) { }

     async createKeyToken(userId: string, refreshToken: string) {
          return await this.keyTokenDocument.findOneAndUpdate(
               { userId: convertToObject(userId) },
               { refreshToken },
               { upsert: true, new: true },
          );
     }

     async findByUserId(userId: string) {
          return this.keyTokenDocument.findOne({ user: convertToObject(userId) });
     }

     async findByRefreshToken(refreshToken: string) {
          return this.keyTokenDocument.findOne({ refreshToken });
     }

     async removeByUserId(userId: string): Promise<any> {
          return this.keyTokenDocument.deleteOne({ user: convertToObject(userId) });
     }
     async findOneRefreshToken(refreshToken: string) {
          return this.keyTokenDocument.findOne({ refreshToken: refreshToken });
     }

     async updateToken(userId: string, refreshToken: string) {
          const result = await this.keyTokenDocument.updateOne(
               { userId },
               { $set: { refreshToken } }
          );
          return result;
     }
}
