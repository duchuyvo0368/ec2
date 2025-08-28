import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FeelDocument = Feel & Document;

@Schema({ timestamps: true })
export class Feel extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Post", required: true })
  postId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ["like", "love", "haha", "wow", "sad", "angry"],
    required: true,
  })
  feel_type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
}

export const FeelSchema = SchemaFactory.createForClass(Feel);
