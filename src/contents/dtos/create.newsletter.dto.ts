import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateContentDto } from "./create.content.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateNewsletterDto extends CreateContentDto {
    @ApiProperty()
    @IsArray()
    @IsMongoId({ each: true})
    @Type(() => String)
    subscriptionList: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    frequency: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isSent: boolean = false;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEnum(['informative', 'promotional', 'transactional'])
    newsletterType: string = 'informative';


}