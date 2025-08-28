import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.reponsitory';
import { FirebaseAdminService } from '../fcm/firebase-admin.service';
import { logger } from 'utils/logger';

@Injectable()
export class NotificationsService {
     constructor(
          private readonly notificationRepository: NotificationRepository,
          private readonly firebaseAdmin: FirebaseAdminService,
     ) { }

     async pushNotification(
          senderId: string,
          receivedId: string,
          type: string,
          options: { senderName: string; fcmToken?: string; image?: string },
     ) {
          let noti_content = '';

          if (type === 'friend_request') {
               noti_content = `${options.senderName} sent a friend request to you`;
          } else if (type === 'friend_accept') {
               noti_content = `${options.senderName} accepted your friend request`;
          } else if (type === 'comment') {
               noti_content = `${options.senderName} commented on your post.`;
          } else if (type === 'like') {
               noti_content = `${options.senderName} liked your post.`;
          }


          const newNotification =
               await this.notificationRepository.createNotification(
                    senderId,
                    receivedId,
                    noti_content,
                    type,
                    options,
               );

          if (options.fcmToken) {
               await this.firebaseAdmin.sendPushNotification(
                    options.fcmToken,
                    'New Notification',
                    noti_content,
                    options['image'] || undefined,
                    { type },
               );
          } else {
               logger.info('No fcm token');
          }

          return newNotification;
     }

     async getByUser(userId: string) {
          return await this.notificationRepository.getByUser(userId);
     }

     async listNotiByUser(params: {
          userId: string | number;
          type?: string;
          isRead?: number;
     }) {
          return this.notificationRepository.findNotificationsByUser(params);
     }
}
