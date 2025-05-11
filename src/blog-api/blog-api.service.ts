import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogColumns, BlogDocument } from './blog-api.schema';
@Injectable()
export class BlogApiService {
  constructor(
    @InjectModel(BlogColumns.name) private blogModel: Model<BlogDocument>,
  ) {}

  async create(blogData: Partial<BlogColumns>): Promise<BlogColumns> {
    const blog = new this.blogModel(blogData);
    return blog.save();
  }

  async findAll(): Promise<BlogColumns[]> {
    return this.blogModel.find().exec();
  }
}
