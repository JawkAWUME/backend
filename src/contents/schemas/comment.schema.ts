import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose , {Document} from "mongoose";
import { User } from "src/users/user.schema";
import { Posts } from "src/contents/schemas/post.schema";

@Schema({timestamps: true})
export class Comment extends Document {
    @Prop({ required: true})
    text: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    post: Posts

    @Prop({ required: true, default: Date.now})
    createdAt: Date;

    @Prop({required : true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    likes: User[];

    @Prop({ default: false})
    isReported: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId,ref: "Comment", default: null})
    parentComment?: Comment;

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId,ref: "Comment"}] })
    replies: Comment[];

}

export const CommentSchema = SchemaFactory.createForClass(Comment);