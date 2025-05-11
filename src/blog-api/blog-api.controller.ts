import { Controller, Post, Body, Get } from '@nestjs/common';
import { BlogApiService } from './blog-api.service';
import { BlogColumns } from './blog-api.schema';

@Controller('blog-api')
export class BlogApiController {
  constructor(private readonly blogService: BlogApiService) {}

  @Post()
  async createBlog(@Body() blogData: Partial<BlogColumns>) {
    return this.blogService.create(blogData);
  }

  @Get()
  async getAllBlogs() {
    return this.blogService.findAll();
  }
}
