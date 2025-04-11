import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsMongoId } from "class-validator";
import { CreateContentDto } from "./create.content.dto";

export class CreatePostDto extends CreateContentDto {
    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // platform: string;

    // @ApiProperty()
    // @IsString()
    // @IsNotEmpty()
    // postType: string;

    // @ApiProperty()
    // @IsString()
    // @IsMongoId({ each: true})
    // shares: string[];

    // @ApiProperty()
    // @IsString()
    // @IsMongoId({ each: true})
    // comments: string[];

}