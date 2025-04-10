import { Controller, Post, Body } from "@nestjs/common";
import { OpenaiService } from "../ai.service";

@Controller('preference')
export class PreferenceController {
    constructor(private readonly openaiService: OpenaiService) {}

    @Post('generate-content')
    async generateContent(@Body() body: { type: string, preferences: string[] }) {
        return this.openaiService.generatePersonalizedContent(body.type, body.preferences);
    }

}  