
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
    comment_post_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'User'})
    comment_user_id: Types.ObjectId;

    @Prop({ type: String, required: true })
    comment_content: string;

    @Prop({ type: Types.ObjectId })
    comment_parent_id: Types.ObjectId;
    

}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
