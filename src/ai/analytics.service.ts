import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from 'src/contents/schemas/content.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    async analyzeTrends(): Promise<any> {
        const allContents = await this.userModel.find().populate('contents').exec();
        const wordCount : Record<string,number> = {};
        allContents.forEach(user => {
            user.contents.forEach((content: Content) => {
                content.body?.split(" ").forEach(word => {
                    word = word.toLowerCase().replace(/[.,!?]/g, '');
                    wordCount[word] = (wordCount[word] || 0) + 1;
                })
            });
        })
        return Object.entries(wordCount).sort(([,a],[,b]) => b - a).slice(0,10);
    }


    async getUserPreferences(userId:string): Promise<string[]> {
        const user = await this.userModel.findById(userId).populate('contents').exec();
        if (!user) throw new NotFoundException('Utilisateur non trouvé');
        const wordCount: Record<string, number> = {};

        user.contents.forEach((content:Content) => {
            content.body?.split(' ').forEach(word => {
                word = word.toLowerCase().replace(/[.,!?]/g, '');
                wordCount[word] = (wordCount[word] || 0)+1;
            });
        });

        return Object.entries(wordCount)
        .sort(([,a],[,b]) => b - a)
        .slice(0,10)
        .map(([word]) => word);
    }
}