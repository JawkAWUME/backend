import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsIn, ValidateIf, IsOptional } from "class-validator";

export class CreateChatCompletionRequest {
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ChatCompletionMessageDto)
    messages:ChatCompletionMessageDto[];
}


export class ImageUrl {
    @IsString()
    url: string;
}

export class ChatCompletionMessageDto {
    @IsString()
    @IsIn(["user","developer","assistant"])
    @IsNotEmpty()
    role:string;

    @ValidateIf((o) => typeof o.content === "string")
    @IsString()
    @ValidateIf((o) => Array.isArray(o.content))
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatContentItem)
    content?: string | ChatContentItem[];
}

export class ChatContentItem {
    @IsOptional()
    @IsIn(["text","image_url"],{ message: "Type must be 'text' or 'image_url'"})
    type?: "text" | "image_url";

    @ValidateIf((o) => o.type === "text" || !o.type)
    @IsString()
    text?: string;
    @ValidateIf((o) => o.type === "image_url")
    @ValidateNested()
    @Type(() => ImageUrl)
    image_url?: ImageUrl;
}

