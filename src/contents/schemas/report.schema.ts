import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose , {Document} from "mongoose";
import { User } from "src/users/user.schema";
import { Comment } from "src/contents/schemas/comment.schema";
import { Posts } from "src/contents/schemas/post.schema";

@Schema({timestamps: true})
export class Report extends Document {
    @Prop({ required: true})
    reason: string;

    @Prop({ required: true, default: Date.now})
    createdAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId,ref: "Comment", default: null})
    parentComment?: Comment;

}

export const ReportSchema = SchemaFactory.createForClass(Report);