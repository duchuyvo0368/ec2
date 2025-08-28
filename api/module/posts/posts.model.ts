import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends Document {
     @Prop({ type: Types.ObjectId, ref: "User", required: true })
     userId: Types.ObjectId;

     @Prop({ type: String, default: "" })
     title: string;

     @Prop({ type: String, default: "" })
     content: string;

     @Prop({ type: String, enum: ["public", "friend"], default: "public" })
     privacy: string;

     @Prop({ type: [String], default: [] })
     hashtags: string[];

     @Prop({ type: [String], default: [] })
     images: string[];

     @Prop({ type: [String], default: [] })
     videos: string[];

     @Prop({
          type: {
               post_link_url: String,
               post_link_title: String,
               post_link_description: String,
               post_link_content: String,
               post_link_image: String,
               post_link_video: String,
          },
          _id: false,
     })
     post_link_meta?: {
          post_link_url: string;
          post_link_title?: string;
          post_link_description?: string;
          post_link_content?: string;
          post_link_image?: string;
          post_link_video?: string;
     };

     @Prop({ type: [Types.ObjectId], ref: "User", default: [] })
     friends_tagged: Types.ObjectId[];


     @Prop({ type: Number, default: 0 })
     comments: number;

     @Prop({ type: Number, default: 0 })
     views: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
