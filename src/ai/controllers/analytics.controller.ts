import { Controller, Get } from "@nestjs/common";
import { AnalyticsService } from "../analytics.service";

@Controller('admin')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('trends')
    async getTrends() {
        return this.analyticsService.analyzeTrends();
    }
}