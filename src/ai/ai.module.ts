import { Module } from "@nestjs/common";
import { AnalyticsController } from "./controllers/analytics.controller";
import { CampaignController } from "./controllers/campaign.controller";
import { PreferenceController } from "./controllers/preference.controller";
import { OpenaiService } from "./ai.service";
import { AnalyticsService } from "./analytics.service";
import { CampaignService } from "./campaign.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/user.schema";
import { Newsletter, NewsletterSchema } from "src/contents/schemas/newsletter.schema";
import { ContentService } from "src/contents/content.service";
import { Article, ArticleSchema } from "src/contents/schemas/article.schema";
import { Blog, BlogSchema } from "src/contents/schemas/blog.schema";
import { Posts, PostSchema } from "src/contents/schemas/post.schema";
import { Report, ReportSchema } from "src/contents/schemas/report.schema";
import { Review, ReviewSchema } from "src/contents/schemas/review.schema";
import { Comment, CommentSchema } from "src/contents/schemas/comment.schema";


@Module({
    controllers: [AnalyticsController,CampaignController,PreferenceController],
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
        ConfigModule],
    providers: [
        OpenaiService,AnalyticsService,CampaignService,ContentService,{
        provide: OpenAI,
        useFactory: (configService: ConfigService) =>
            new OpenAI({apiKey:process.env.OPENAI_API_KEY}),
        inject: [ConfigService]
    }],
    exports: [OpenaiService,AnalyticsService,CampaignService,ContentService]

})

export class AIModule {}