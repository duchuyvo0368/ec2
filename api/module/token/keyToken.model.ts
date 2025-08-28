
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeyTokenDocument = KeyToken & Document;

@Schema({ timestamps: true, collection: 'KeyTokens' })
export class KeyToken {
    @Prop({ required: true, unique: true,ref: 'User' })
    userId: string;

    @Prop({ required: true })
    refreshToken: string;

    @Prop({ type: [String], default: [] }) 
    refreshTokensUsed: string[];

    @Prop({ default: null })
    publicKey?: string;

    @Prop({ default: null })
    privateKey?: string;
}

export const TokenSchema = SchemaFactory.createForClass(KeyToken);
