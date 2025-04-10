import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Article } from "./schemas/article.schema";
import { Blog } from "./schemas/blog.schema";
import { Newsletter } from "./schemas/newsletter.schema";
import { Posts } from "./schemas/post.schema";
import { Review } from "./schemas/review.schema";
import { Report } from "./schemas/report.schema";
import { Comment } from "./schemas/comment.schema";
import { User } from "src/users/user.schema";
import { OpenaiService } from "src/ai/ai.service";
import { Content } from "./schemas/content.schema";

@Injectable()
export class ContentService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectModel(Article.name) private articleModel: Model<Article>,
        @InjectModel(Newsletter.name) private newsletterModel: Model<Newsletter>,
        @InjectModel(Posts.name) private postModel: Model<Posts>,
        @InjectModel(Report.name) private reportModel: Model<Report>,
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private readonly openaiService: OpenaiService
    ) {}

    private getModel(type: string): Model<any> {
        const models = {
            article: this.articleModel,
            blog: this.blogModel,
            newsletter: this.newsletterModel,
            post: this.postModel
        };
        return models[type] || null;
    }

    private getAllContentModels(): Model<any>[] {
        return [this.articleModel, this.blogModel, this.newsletterModel, this.postModel];
    }

    async createContent(type: string, createContentDto: any, userId: string): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Utilisateur non trouvé');

        const model = this.getModel(type);
        if (!model) throw new NotFoundException(`Type de contenu non valide : ${type}`);

        let { body, title } = createContentDto;

        if (!body) {
            body = await this.openaiService.createChatCompletion(type, [
                { role: 'user', content: `Rédige un ${type} sur : ${createContentDto.topic || createContentDto.title}` }
            ]);
        }

        if (!title && type !== 'post') {
            title = await this.openaiService.createChatCompletion('titres de contenu', [
                { role: 'user', content: `Propose un titre accrocheur pour un ${type} sur : ${createContentDto.topic || 'un sujet inspirant'}` }
            ]);
        }

        const createdContent = new model({
            ...createContentDto,
            title,
            body,
            author: user._id
        });

        user.contents.push(createdContent._id);
        await user.save();

        return createdContent.save();
    }

    async createArticle(dto: any, userId: string): Promise<Article> {
        return this.createContent("article", dto, userId);
    }

    async createBlog(dto: any, userId: string): Promise<Blog> {
        return this.createContent("blog", dto, userId);
    }

    async createNewsletter(dto: any, userId: string): Promise<Newsletter> {
        return this.createContent("newsletter", dto, userId);
    }

    async createPost(dto: any, userId: string): Promise<Posts> {
        return this.createContent("post", dto, userId);
    }

    async getUserContent(userId: string): Promise<Content[]> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('Utilisateur non trouvé');

        const contentsByUser = await Promise.all(
            this.getAllContentModels().map(model => model.find({ author: userId }).exec())
        );

        const allContents = contentsByUser.flat();
        if (allContents.length === 0) throw new NotFoundException('Aucun contenu trouvé pour cet utilisateur');
        return allContents;
    }

    async getRecentContents(limit = 10): Promise<Content[]> {
        const contents = await Promise.all(
            this.getAllContentModels().map(model => model.find().sort({ createdAt: -1 }).limit(limit).exec())
        );
        return contents.flat().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
    }

    async getMostLikedContents(limit = 10): Promise<Content[]> {
        const contents = await Promise.all(
            this.getAllContentModels().map(model => model.find().exec())
        );
        return contents.flat()
            .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
            .slice(0, limit);
    }

    async getRelevantContents(category: string, limit = 10): Promise<Content[]> {
        const contents = await Promise.all(
            this.getAllContentModels().map(model => model.find({ contentTypes: { $in: [category] } }).exec())
        );
        return contents.flat()
            .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
            .slice(0, limit);
    }

    async getRecommendedContents(userId: string, limit = 5): Promise<Content[]> {
        const userLikedContents = await Promise.all(
            this.getAllContentModels().map(model => model.find({ likes: userId }).exec())
        );

        const liked = userLikedContents.flat();
        const contentTypes = [...new Set(liked.flatMap(c => c.contentTypes))];

        const recommendedContents = await Promise.all(
            this.getAllContentModels().map(model => model.find({
                contentTypes: { $in: contentTypes },
                likes: { $ne: userId }
            }).exec())
        );

        return recommendedContents.flat().slice(0, limit);
    }

    async getTrendingContents(limit = 10): Promise<Content[]> {
        const contents = await Promise.all(
            this.getAllContentModels().map(model => model.find().exec())
        );

        return contents.flat()
            .sort((a, b) =>
                ((b.shares ?? 0) + (b.likes?.length ?? 0)) -
                ((a.shares ?? 0) + (a.likes?.length ?? 0))
            )
            .slice(0, limit);
    }

    async reportContent(contentId: string, reason: string): Promise<Content> {
        const models = this.getAllContentModels();
        let content: Content|null = null;

        for (const model of models) {
            content = await model.findById(contentId);
            if (content) break;
        }

        if (!content) throw new NotFoundException("Contenu non trouvé");

        const report = new this.reportModel({ reason });
        await report.save();

        content.reports = content.reports || [];
        content.reports.push(report);
        return content.save();
    }

    async addReview(contentId: string, userId: string, rating: number, feedback: string): Promise<Content> {
        const models = this.getAllContentModels();
        let content:Content|null = null;

        for (const model of models) {
            content = await model.findById(contentId);
            if (content) break;
        }

        if (!content) throw new NotFoundException("Contenu non trouvé");

        const review = new this.reviewModel({ user: userId, rating, feedback });
        await review.save();

        content.reviews = content.reviews || [];
        content.reviews.push(review);
        return content.save();
    }

    async getReviews(contentId: string): Promise<any[]> {
        const models = this.getAllContentModels();
        for (const model of models) {
            const content = await model.findById(contentId);
            if (content) return content.reviews || [];
        }
        throw new NotFoundException("Contenu non trouvé");
    }

    async addCommentToPost(postId: string, authorId: string, text: string): Promise<Posts> {
        const post = await this.postModel.findById(postId).exec();
        if (!post) throw new NotFoundException("Post non trouvé");

        const comment = new this.commentModel({ author: authorId, text });
        await comment.save();

        post.comments.push(comment);
        await post.save();
        return post;
    }

    async replyToComment(commentId: string, authorId: string, text: string): Promise<Comment> {
        const parentComment = await this.commentModel.findById(commentId).exec();
        if (!parentComment) throw new NotFoundException("Commentaire non trouvé");

        const reply = new this.commentModel({ author: authorId, text, parentComment: parentComment._id });
        await reply.save();

        parentComment.replies.push(reply);
        await parentComment.save();

        return reply;
    }

    async getCommentsByPost(postId: string, filter?: string): Promise<Comment[]> {
        const post = await this.postModel.findById(postId).populate({
            path: "comments",
            populate: {
                path: "replies",
                populate: { path: "author", select: "username" }
            }
        }).exec();

        if (!post) throw new NotFoundException("Post non trouvé");
        let comments = post.comments;

        switch (filter) {
            case "most_liked":
                comments = comments.sort((a, b) => b.likes.length - a.likes.length);
                break;
            case "most_recent":
                comments = comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                break;
            case "reported":
                comments = comments.filter(comment => comment.isReported);
                break;
        }

        return comments;
    }
}
