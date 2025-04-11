import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/user.schema";
import { Review } from "./review.schema";
import { Report } from "./report.schema";


@Schema({timestamps:true})
export class Content extends Document {
    @Prop({required: true})
    title?: string;

    @Prop({required: true})
    imageUrl?: string;

    @Prop({required: true})
    body: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }] })
    reports: Report[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
    reviews: Review[];

    @Prop({default: 'draft'})
    status: string;

    @Prop({ required : true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author: User;

    @Prop({ required: true, default: Date.now})
    createdAt: Date;

    @Prop({ required : true, type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []})
    likes: User[];

    @Prop({ required : true, type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], default: []})
    views: User[];
}

export const ContentSchema = SchemaFactory.createForClass(Content) 