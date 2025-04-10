import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Content } from "./content.schema";
import { User } from "src/users/user.schema";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class Newsletter extends Content {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    subscriptionList: User[];

    @Prop({ required: true })
    frequency: string;

    // @Prop({ default: Date.now })
    // sendDate: Date;
    
    // @Prop({ required: true })
    // subject: string;
    @Prop({ default: false })
    isSent: boolean;

    @Prop({ default: 'informative' })
    newsletterType: string;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter)
