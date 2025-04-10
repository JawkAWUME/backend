import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose , {Document} from "mongoose";
import { User } from "src/users/user.schema";


@Schema({timestamps: true})
export class Review extends Document {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId,ref: "User"})
    user: User;

    @Prop({default: 0})
    rating: number;
    
    @Prop({ required: true})
    comment: string;

    @Prop({ required: true, default: Date.now})
    createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);