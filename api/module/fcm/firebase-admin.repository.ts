import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import * as admin from 'firebase-admin';
import { FirebaseAdmin, FirebaseAdminDocument, FirebaseAdminSchema } from './firebase-admin.model';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRelationDocument } from 'module/firends/friend.model';
import { Model } from 'mongoose';
@Injectable()
export class FirebaseAdminRepository {
     constructor(@InjectModel(FirebaseAdmin.name, 'MONGODB_CONNECTION')
     private readonly firebaseAdminModel: Model<FirebaseAdminDocument>
     ) { }

     async sendPushNotification(
          token: string,
          title: string,
          body: string,
          image?: string,
          data: Record<string, string> = {},
     ) {
          const message: admin.messaging.Message = {
               token,
               notification: {
                    title: title,
                    body,
                    imageUrl: image,
               },
               data,
          };
          //   logger.info('token:', JSON.stringify(token));
          //   logger.info('notification:', message.notification);
          //   logger.info('Sending FCM message:', (message as any).notification);
          const push = admin.messaging().send(message);
          //   console.log('Push notification sent:', push);
          //   logger.info('Push notification sent:', push);
          return push;
     }
     async updateFcmToken(userId: string, fcmToken: string) {
          return this.firebaseAdminModel.findOneAndUpdate(
               { userId },
               { fcm_token: fcmToken },
               { upsert: true, new: true, setDefaultsOnInsert: true }
          );
     }


     async findUserInfoWithFcm(userId: string): Promise<any | null> {
          return this.firebaseAdminModel
               .findOne({ userId })
               .populate({
                    path: 'userId',
                    select: 'name avatar'
               })
               .lean();
     }



}
