import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.model';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { AuthModule } from 'module/auth/module.auth';
import { CommentController } from './comment.controller';
import { PostsModule } from 'module/posts/posts.module';
import { CommentGateway } from './comment.gateway';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Comment.name, schema: CommentSchema }],
            'MONGODB_CONNECTION'
        ),
        forwardRef(() => AuthModule),
        forwardRef(() => PostsModule),
    ],
    controllers: [CommentController],
    providers: [
        CommentService,
        CommentRepository,
        CommentGateway,
    ],
    exports: [MongooseModule, CommentService],
})
export class CommentModule { }
