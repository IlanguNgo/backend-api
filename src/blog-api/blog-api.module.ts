import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogApiController } from './blog-api.controller';
import { BlogApiService } from './blog-api.service';
import { BlogColumns, BlogSchema } from './blog-api.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BlogColumns.name, schema: BlogSchema }]),
  ],
  controllers: [BlogApiController],
  providers: [BlogApiService],
})
export class BlogApiModule {}
