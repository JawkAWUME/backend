import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import { CreateContentDto } from "./create.content.dto";

export class CreateArticleDto extends CreateContentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    authorName: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    readTime: number;
    
}