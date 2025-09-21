import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { HiddenStarsService } from './hidden-stars.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogColumns } from 'src/blog-api/blog-api.schema';
import { HiddenStar } from './hidden-stars.schema';

@Controller('hidden-stars')
export class HiddenStarsController {
  constructor(private readonly hiddenStar: HiddenStarsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'ppt', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './powerPoint',
          filename: (req, file, cb) => {
            console.log("filename : ", file )
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
      ppt?: Express.Multer.File[];
 
    },
    @Body() HiddenStarData: Partial<HiddenStar>,
  ) {
    if (files?.ppt?.[0]) {
      HiddenStarData.ppt = files.ppt[0].filename;
    }
   
    return this.hiddenStar.create(HiddenStarData);
  }

  @Get()
  async getAllBlogs() {
    return this.hiddenStar.findAll();
  }
}