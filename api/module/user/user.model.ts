
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;
@Schema({ timestamps: true, collection: 'Users' })
export class User {
    @Prop({ trim: true, maxLength: 150 })
    name: string;

    @Prop({ required: true, unique: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, default: 'https://hoseiki.vn/wp-content/uploads/2025/03/avatar-mac-dinh-3.jpg' }) // 
    avatar?: string;

    @Prop({ type: String, default: null })
    bio?: string;
    
    
}


export const UserSchema = SchemaFactory.createForClass(User);
