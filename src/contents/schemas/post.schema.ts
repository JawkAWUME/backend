import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Content } from "./content.schema";
import mongoose from "mongoose";
import { User } from "src/users/user.schema";
import { Comment } from "src/contents/schemas/comment.schema";

@Schema({timestamps: true})
export class Posts extends Content {
    @Prop({ required: true})
    platform: string;

    @Prop({ required : true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    shares: User[];

    @Prop({ required : true, type: mongoose.Schema.Types.ObjectId, ref: 'Comment'})
    comments: Comment[];

    @Prop({ type: [String], default: [] })
    hashtags: string[];

    @Prop({ default: null })
    location?: string;
    
}

export const PostSchema = SchemaFactory.createForClass(Posts);