import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { logger } from 'utils/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { log } from 'console';
import { UserRepository } from 'module/user/user.repository';
import { FirebaseAdminRepository } from './firebase-admin.repository';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
     constructor(
          private readonly firebaseAdminRepository: FirebaseAdminRepository,
     ) { }
     onModuleInit() {
          if (!admin.apps.length) {
               try {
                    const serviceAccountPath =
                         'D:/Users/web_application/api/utils/training-3f6e4-firebase-adminsdk-fbsvc-24a33b8098.json';
                    logger.info('Looking for service account at:', serviceAccountPath);

                    if (!require('fs').existsSync(serviceAccountPath)) {
                         throw new Error(
                              `Service account file not found at: ${serviceAccountPath}`,
                         );
                    }

                    const serviceAccount = JSON.parse(
                         readFileSync(serviceAccountPath, 'utf8'),
                    );

                    admin.initializeApp({
                         credential: admin.credential.cert({
                              projectId: serviceAccount.project_id,
                              clientEmail: serviceAccount.client_email,
                              privateKey: serviceAccount.private_key,
                         }),
                    });
                    logger.info('Firebase Admin initialized successfully');
               } catch (error) {
                    logger.error('Failed to initialize Firebase Admin:', error);
                    throw error;
               }
          }
     }

     async sendPushNotification(
          token: string,
          title: string,
          body: string,
          image?: string,
          data: Record<string, string> = {},
     ) {
          return this.firebaseAdminRepository.sendPushNotification(
               token,
               title,
               body,
               image,
               data,
          );
     }

     async updateFcmToken(userId: string, fcmToken: string) {
          console.log("data fcm1", fcmToken)
          return this.firebaseAdminRepository.updateFcmToken(userId, fcmToken);
     }
     async getUserFcmInfo(userId: string) {
          const doc = await this.firebaseAdminRepository.findUserInfoWithFcm(userId);

          if (!doc) return null;

          return {
               fcm_token: doc.fcm_token,
               name: doc.userId?.name || null,
               avatar: doc.userId?.avatar || null
          };
     }

}
