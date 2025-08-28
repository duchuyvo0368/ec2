
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
    @Prop({ type: String, enum: ['friend_request', 'friend_accept', 'comment', 'like'], required: true })
    noti_type: string;

    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    noti_from: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    noti_to: Types.ObjectId;

    @Prop({ type: String, required: true })
    noti_content: string;

    @Prop({ type: Object, default: {} })
    noti_options: Record<string, any>;

    @Prop({ type: Boolean, default: false })
    isRead: boolean;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
