import { Body, Controller,Get,Param,Post, Query} from "@nestjs/common";
import { ContentService } from "./content.service";
// import { Blog } from "./schemas/blog.schema";
// import { Posts } from "./schemas/post.schema";
// import { Article } from "./schemas/article.schema";
// import { Newsletter } from "./schemas/newsletter.schema";
import { CreateArticleDto } from "./dtos/create.article.dto";
import { CreateBlogDto } from "./dtos/create.blog.dto";
import { CreateNewsletterDto } from "./dtos/create.newsletter.dto";
import { CreatePostDto } from "./dtos/create.post.dto";

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {}

    // Create Article
    @Post('create/article')
    async createArticle(
        @Body() createArticleDto: CreateArticleDto,
        @Body('userId') userId: string
    ) {
        return this.contentService.createArticle(createArticleDto, userId);
    }

    // Create Blog
    @Post('create/blog')
    async createBlog(
        @Body() createBlogDto: CreateBlogDto,
        @Body('userId') userId: string
    ) {
        return this.contentService.createBlog(createBlogDto, userId);
    }

    // Create Newsletter
    @Post('create/newsletter')
    async createNewsletter(
        @Body() createNewsletterDto: CreateNewsletterDto,
        @Body('userId') userId: string
    ) {
        return this.contentService.createNewsletter(createNewsletterDto, userId);
    }

    // Create Post
    @Post('create/post')
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Body('userId') userId: string
    ) {
        return this.contentService.createPost(createPostDto, userId);
    }


    // Get Content by User
    @Get('user/:userId')
    async getUserContent(@Param('userId') userId: string) {
        return this.contentService.getUserContent(userId);
    }

    // Get Recent Contents
    @Get('recent')
    async getRecentContents(@Query('limit') limit: number) {
        return this.contentService.getRecentContents(limit);
    }

    // Get Most Liked Contents
    @Get('most-liked')
    async getMostLikedContents(@Query('limit') limit: number) {
        return this.contentService.getMostLikedContents(limit);
    }

    // Get Relevant Contents by Category
    @Get('relevant')
    async getRelevantContents(@Query('category') category: string, @Query('limit') limit: number) {
        return this.contentService.getRelevantContents(category, limit);
    }

    // Report Content
    @Post('report/:contentId')
    async reportContent(
        @Param('contentId') contentId: string,
        @Body('reason') reason: string
    ) {
        return this.contentService.reportContent(contentId, reason);
    }

    // Add Review
    @Post('review/:contentId')
    async addReview(
        @Param('contentId') contentId: string,
        @Body('userId') userId: string,
        @Body('rating') rating: number,
        @Body('feedback') feedback: string
    ) {
        return this.contentService.addReview(contentId, userId, rating, feedback);
    }

}