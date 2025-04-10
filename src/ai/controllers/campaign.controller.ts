import { Controller, Param, Post } from "@nestjs/common";
import { CampaignService } from "../campaign.service";
import { ContentService } from "src/contents/content.service";

@Controller('campaign')
export class CampaignController {
    constructor(private readonly campaignService: CampaignService,
        private readonly contentService: ContentService 
    ) {}

    @Post('send-newsletter/:userId')
    async sendNewsletter(@Param('userId') userId: string) {
        return this.campaignService.sendPersonalizedNewsletter(userId);
    }

}