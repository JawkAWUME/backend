import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blog.schema";
import { Article, ArticleSchema } from "./schemas/article.schema";
import { Newsletter, NewsletterSchema } from "./schemas/newsletter.schema";
import { Posts, PostSchema } from "./schemas/post.schema";
import { ContentService } from "./content.service";
import { Report,ReportSchema } from "./schemas/report.schema";
import { Review, ReviewSchema } from "./schemas/review.schema";
import { User, UserSchema } from "src/users/user.schema";
import { OpenaiService } from "src/ai/ai.service";
import { Comment,CommentSchema } from "./schemas/comment.schema";
import { ConfigModule } from "@nestjs/config";
import OpenAI from "openai";
import { ContentController } from "./content.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema},
            { name: Article.name, schema: ArticleSchema},
            { name: Newsletter.name, schema: NewsletterSchema},
            { name: Posts.name, schema: PostSchema},
            { name: Report.name, schema:ReportSchema},
            { name: Review.name, schema:ReviewSchema},
            { name: User.name, schema:UserSchema},
            { name: Comment.name, schema:CommentSchema},
        ]),
        ConfigModule
    ],
    controllers: [ContentController],
    providers: [ContentService,OpenaiService,{
        provide: OpenAI,
        useFactory: () => {
          return new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // ou une config hardcodée pour test
          });
        },
      },],
    exports: [ContentService,OpenaiService],
})

export class ContentModule {}