


import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.request';
import { ChatCompletionMessageParam } from 'openai/resources';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OpenaiService {
    constructor(private readonly openai: OpenAI) {}

    async createChatCompletion(type: string, messages: ChatCompletionMessageDto[]) {
        const response = await this.openai.chat.completions.create({
            messages: [
                { role: 'system', content: `Tu es un assistant qui rédige des ${type}s.` }, // Contexte du modèle
                ...messages as ChatCompletionMessageParam[],
            ],
            model: 'gpt-4o',
            max_tokens: 500,
        });

        return response.choices[0].message.content;
    }

    async generateImage(description: string) {
        const response = await this.openai.images.generate({
            model: "dall-e-2",
            prompt: description,
            size: "1024x1024"
        })

        return response.data[0].url;
    }

    async generatePersonalizedContent(type:string,preferences: string[]): Promise<string|null> {
        const prompt = `Crée un ${type} marketing personnalisé pour un client intéressé par: ${preferences.join(', ')}`
        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {role: 'user', content: prompt}
            ],
            max_tokens: 600
        });

        return completion.choices[0].message.content;
    }

}