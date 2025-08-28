
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notification.model';
import { Notification } from './notification.model';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { NotificationRepository } from './notification.reponsitory';
import { AuthModule } from 'module/auth/module.auth';
import { FirebaseAdminService } from '../fcm/firebase-admin.service';
import { UserModule } from 'module/user/user.module';
import { FirebaseAdminModule } from 'module/fcm/firebase-admin.module';
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Notification.name, schema: NotificationSchema }],
      'MONGODB_CONNECTION',
    ),
    forwardRef(() => AuthModule),
    FirebaseAdminModule,
    //  UserModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
  exports: [MongooseModule, NotificationsService],
})
export class NotificationsModule {}
