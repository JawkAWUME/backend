import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Content } from "./content.schema";
import mongoose from "mongoose";

@Schema({timestamps:true})
export class Blog extends Content {
    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ default: null })
    featuredImage?: string;

    // @Prop({ default: null })
    // authorBio?: string;

    // @Prop({ default: Date.now })
    // publishedDate: Date;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }] })
    relatedBlogs: Blog[];
   
}

export const BlogSchema = SchemaFactory.createForClass(Blog);