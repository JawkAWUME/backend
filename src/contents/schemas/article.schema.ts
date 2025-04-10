import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Content } from "./content.schema";

export class Article extends Content {
    @Prop({ required: true })
    authorName: string;

    @Prop({ default: 0})
    readTime: number;

    @Prop({ default: null })
    summary?: string;

    @Prop({ default: null })
    journal?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
