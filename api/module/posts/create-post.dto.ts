import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';


export class CreatePostDto {
     @IsOptional()
     @IsString()
     title?: string;

     @IsOptional()
     @IsString()
     content?: string;

     @IsOptional()
     @IsString()
     privacy?: 'public' | 'friend';

     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     hashtags?: string[];

     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     images?: string[];

     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     videos?: string[];

     @IsOptional()
     @IsArray()
     @IsMongoId({ each: true })
     friends_tagged?: string[];

     @IsOptional()
     post_link_meta?: {
          post_link_url: string;
          post_link_title?: string;
          post_link_description?: string;
          post_link_content?: string;
          post_link_image?: string;
          post_link_video?: string;
     };
}

export class EditPostDto {
     @IsString()
     title: string;

     @IsString()
     content: string;

     @IsOptional()
     @IsString()
     privacy?: string;

     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     hashtags?: string[];

     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     friends_tagged?: string[];


     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     images?: string[];

     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     videos?: string[];
     @IsOptional()
     post_link_meta?: {
          post_link_url: string;
          post_link_title?: string;
          post_link_description?: string;
          post_link_content?: string;
          post_link_image?: string;
     };
}

