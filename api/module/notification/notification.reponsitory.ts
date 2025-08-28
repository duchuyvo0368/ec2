import { InjectModel } from "@nestjs/mongoose";
import { Notification, NotificationDocument } from "./notification.model";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class NotificationRepository {
     constructor(
          @InjectModel(Notification.name, 'MONGODB_CONNECTION')
          private readonly notificationModel: Model<NotificationDocument>,
     ) { }

     async createNotification(senderId: string, receivedId: string, noti_content: string, noti_type: string, options: any) {
          const newNotification = await this.notificationModel.create({
               noti_type: noti_type,
               noti_content: noti_content,
               noti_from: senderId,
               noti_to: receivedId,
               noti_options: options,
          });
          return newNotification;
     }

     async getByUser(userId: string) {
          return await this.notificationModel
               .find({ noti_receivedId: userId })
               .sort({ createdAt: -1 })
               .exec();
     }
     async findNotificationsByUser(params: {
          userId: string | number;
          type?: string;
          isRead?: number;
     }): Promise<any[]> {
          const { userId, type = 'ALL', isRead = 0 } = params;

          const match: any = { noti_receivedId: userId };
          if (type !== 'ALL') {
               match.noti_type = type;
          }
          if (isRead !== undefined && isRead !== null) {
               match.isRead = isRead;
          }

          return this.notificationModel.aggregate([
               { $match: match },
               {
                    $project: {
                         noti_type: 1,
                         noti_content: {
                              $concat: [
                                   { $ifNull: ['$noti_options.sender_name', ''] },
                                   ' Vừa bình luận bài viết của bạn ',
                                   { $ifNull: ['$noti_options.post_content', ''] },
                                   ' ',
                                   { $ifNull: ['$noti_options.sender_name', ''] },
                              ],
                         },
                         noti_senderId: 1,
                         noti_receivedId: 1,
                         createdAt: 1,
                         noti_options: 1,
                    },
               },
          ]).exec();
     }
}