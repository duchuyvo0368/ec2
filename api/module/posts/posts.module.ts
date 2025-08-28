import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'module/auth/module.auth';
import { Post, PostSchema } from './posts.model';
import { FriendModule } from 'module/firends/friend.module';
import { UploadModule } from 'module/upload/upload.module';
import { PostRepository } from './post.reponsitory';
import { CommentModule } from 'module/comment/comment.module';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Post.name, schema: PostSchema },
            ],
            'MONGODB_CONNECTION'
        ),
        AuthModule,
        FriendModule,
        forwardRef(() => UploadModule)

    ],
    controllers: [PostsController],
    providers: [PostsService, PostRepository],
    exports: [MongooseModule, PostsService],
})
export class PostsModule { }
