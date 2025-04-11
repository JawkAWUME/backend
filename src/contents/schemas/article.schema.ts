import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Content } from "./content.schema";


@Schema({timestamps:true})
export class Article extends Content {
    @Prop({ default: null})
    authorName?: string;

    @Prop({ default: 0})
    readTime: number;

    @Prop({ default: null })
    summary?: string;

    @Prop({ default: null })
    journal?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
