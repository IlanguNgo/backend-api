import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BlogApiService } from './blog-api.service';
import { BlogColumns } from './blog-api.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('blog-api')
export class BlogApiController {
  constructor(private readonly blogService: BlogApiService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
      },
    ),
  )
  async createBlog(
    @UploadedFiles()
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
    },
    @Body() blogData: Partial<BlogColumns>,
  ) {
    if (files.image1?.[0]) {
      blogData.image1 = files.image1[0].filename;
    }
    if (files.image2?.[0]) {
      blogData.image2 = files.image2[0].filename;
    }

    return this.blogService.create(blogData);
  }

  @Get()
  async getAllBlogs() {
    return this.blogService.findAll();
  }
}