import {
    IsArray,
    IsOptional,
    IsString,
    IsMongoId,
  } from 'class-validator';
import { CreateContentDto } from './create.content.dto';

export class CreateBlogDto extends CreateContentDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
  
    @IsString()
    @IsOptional()
    featuredImage?: string;
    // @IsString()
    // @IsOptional()
    // authorBio?: string;
  
    // @IsDate()
    // @IsOptional()
    // @Type(() => Date)
    // publishedDate?: Date;
  
    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    relatedBlogs?: string[]; 
}
  