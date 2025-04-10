import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from 'mongoose';
import { Content } from "src/contents/schemas/content.schema";

@Schema({timestamps: true})
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ default: null }) // bio is optional with default null
    bio?: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: false }) // Adding a field for account blocking
    isBlocked: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }], default: [] }) // contents is optional and defaults to an empty array
    contents: Content[];
}

export const UserSchema = SchemaFactory.createForClass(User);
