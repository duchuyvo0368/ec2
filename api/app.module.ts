import { UploadModule } from './module/upload/upload.module';
import { Module } from '@nestjs/common';
import { FriendModule } from './module/firends/friend.module';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './module/database/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
//import { FollowModule } from 'module/follow/follow.module';
import { PostsModule } from 'module/posts/posts.module';
import { FeelModule } from 'module/feels/feels.module';
import { NotificationsModule } from 'module/notification/notification.module';
import { CommentModule } from 'module/comment/comment.module';
import {  FirebaseAdminModule } from 'module/fcm/firebase-admin.module';

@Module({
     imports: [
          MongooseModule.forRoot(
               `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
               {
                    connectionName: 'MONGODB_CONNECTION',
                    ...config.options,
               },
          ),

          ServeStaticModule.forRoot({
               rootPath: join(__dirname, '..', 'uploads'),
               serveRoot: '/uploads',
          }),
          UploadModule,
          FriendModule,
          UserModule,

          //FollowModule,
          PostsModule,
           FeelModule,
          NotificationsModule,
          FirebaseAdminModule,
          CommentModule,
     ],
})
export class AppModule { }
