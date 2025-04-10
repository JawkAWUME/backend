import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId} from "class-validator";
import { ApiProperty} from "@nestjs/swagger";

export class CreateContentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    topic: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    body: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true})
    reports?: string[];

    @ApiProperty()
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    author: string;

    @ApiProperty()
    @IsOptional()
    createdAt: Date;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true})
    likes: string[];

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true})
    views: string[];
}