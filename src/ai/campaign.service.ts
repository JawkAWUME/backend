import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Newsletter } from "src/contents/schemas/newsletter.schema";
import { User } from "src/users/user.schema";
import { OpenaiService } from "./ai.service";
import { AnalyticsService } from "./analytics.service";

@Injectable()
export class CampaignService {
    constructor(
        @InjectModel('Newsletter') private readonly newsletterModel: Model<Newsletter>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly openaiService: OpenaiService,
        private readonly analyticsService: AnalyticsService
    ) {}

    async sendPersonalizedNewsletter(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("Utilisateur non trouvé");

        const preferences = await this.analyticsService.getUserPreferences(userId);
        const body = await this.openaiService.generatePersonalizedContent('newsletter', preferences);
        const newsletter = new this.newsletterModel({
            title: `Newsletter personnalisée`,
            body,
            author: user._id,
            subscriptionList: [user._id],
            frequency: 'mensuelle',
            sendDate: new Date(),

        })

        user.contents.push(newsletter);
        await user.save();
        return newsletter.save();
    }
}