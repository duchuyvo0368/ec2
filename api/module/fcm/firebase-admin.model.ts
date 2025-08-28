import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";


@Schema({ timestamps: true })
export class FirebaseAdmin {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId:string;
    @Prop({ type: String, required: true })
    fcm_token: string;
}

export type FirebaseAdminDocument = FirebaseAdmin & Document;
export const FirebaseAdminSchema = SchemaFactory.createForClass(FirebaseAdmin);
